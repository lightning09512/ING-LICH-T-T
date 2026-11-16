import { randomBytes, randomUUID, scrypt as scryptCallback, createHash, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const SESSION_COOKIE = 'ing_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DEFAULT_PROGRESS = {
  grammarProgress: {} as Record<string, number>,
  vocabUnlockedDay: 1,
  vocabDayStars: {} as Record<number, number>,
};

export interface AccountUser {
  id: string;
  username: string;
}

export interface LearningProgressData {
  grammarProgress: Record<string, number>;
  vocabUnlockedDay: number;
  vocabDayStars: Record<number, number>;
}

export interface AccountApiResult {
  status: number;
  body: Record<string, unknown>;
  cookie?: string;
}

type SqlClient = ReturnType<typeof neon>;
let schemaPromise: Promise<void> | null = null;

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_NOT_CONFIGURED');
  return url;
}

function hashPassword(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

async function initializeSchema(sql: SqlClient): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS app_accounts (
      id uuid PRIMARY KEY,
      username varchar(20) NOT NULL UNIQUE,
      password_salt char(32) NOT NULL,
      password_hash char(128) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS app_sessions (
      token_hash char(64) PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES app_accounts(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS app_sessions_expiry_idx ON app_sessions(expires_at)`;
  await sql`
    CREATE TABLE IF NOT EXISTS app_progress (
      user_id uuid PRIMARY KEY REFERENCES app_accounts(id) ON DELETE CASCADE,
      grammar_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
      vocab_unlocked_day integer NOT NULL DEFAULT 1,
      vocab_day_stars jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

async function getSql(): Promise<SqlClient> {
  const sql = neon(databaseUrl());
  if (!schemaPromise) {
    schemaPromise = initializeSchema(sql).catch(error => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
  return sql;
}

function normalizeUsername(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const username = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_.-]{2,19}$/.test(username) ? username : null;
}

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function readSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const session = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`));
  return session ? decodeURIComponent(session.slice(SESSION_COOKIE.length + 1)) : null;
}

function sessionCookie(token: string | null, secure: boolean): string {
  const flags = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  return token
    ? `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${flags}; Max-Age=${SESSION_MAX_AGE_SECONDS}`
    : `${SESSION_COOKIE}=; ${flags}; Max-Age=0`;
}

function jsonFailure(status: number, message: string): AccountApiResult {
  return { status, body: { success: false, message } };
}

function safeProgress(value: unknown): LearningProgressData | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Partial<LearningProgressData>;
  if (!raw.grammarProgress || typeof raw.grammarProgress !== 'object' || Array.isArray(raw.grammarProgress)) return null;
  if (!raw.vocabDayStars || typeof raw.vocabDayStars !== 'object' || Array.isArray(raw.vocabDayStars)) return null;

  const grammarEntries = Object.entries(raw.grammarProgress);
  if (grammarEntries.length > 500) return null;
  const grammarProgress: Record<string, number> = {};
  for (const [topicId, score] of grammarEntries) {
    if (!topicId || topicId.length > 100 || !Number.isSafeInteger(score) || (score as number) < 0 || (score as number) > 10000) return null;
    grammarProgress[topicId] = score as number;
  }

  const unlocked = raw.vocabUnlockedDay;
  if (!Number.isInteger(unlocked) || (unlocked as number) < 1 || (unlocked as number) > 26) return null;

  const vocabDayStars: Record<number, number> = {};
  for (const [dayText, stars] of Object.entries(raw.vocabDayStars)) {
    const day = Number(dayText);
    if (!Number.isInteger(day) || day < 1 || day > 26 || !Number.isInteger(stars) || (stars as number) < 0 || (stars as number) > 3) return null;
    vocabDayStars[day] = stars as number;
  }

  return { grammarProgress, vocabUnlockedDay: unlocked as number, vocabDayStars };
}

async function findSession(cookieHeader: string | null): Promise<AccountUser | null> {
  const token = readSessionToken(cookieHeader);
  if (!token) return null;
  const sql = await getSql();
  const rows = await sql`
    SELECT a.id::text AS id, a.username
    FROM app_sessions s
    JOIN app_accounts a ON a.id = s.user_id
    WHERE s.token_hash = ${tokenHash(token)} AND s.expires_at > now()
    LIMIT 1
  `;
  return rows.length ? { id: String(rows[0].id), username: String(rows[0].username) } : null;
}

async function createSession(user: AccountUser, secure: boolean): Promise<string> {
  const sql = await getSql();
  const token = randomBytes(32).toString('base64url');
  await sql`
    DELETE FROM app_sessions WHERE expires_at <= now()
  `;
  await sql`
    INSERT INTO app_sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash(token)}, ${user.id}, now() + (${SESSION_MAX_AGE_SECONDS} * interval '1 second'))
  `;
  return sessionCookie(token, secure);
}

async function authenticate(usernameInput: unknown, passwordInput: unknown, createAccount: boolean, secure: boolean): Promise<AccountApiResult> {
  const username = normalizeUsername(usernameInput);
  if (!username) return jsonFailure(400, 'Tên tài khoản cần 3–20 ký tự: chữ không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.');
  if (typeof passwordInput !== 'string' || passwordInput.length < 8 || passwordInput.length > 128) {
    return jsonFailure(400, 'Mật khẩu cần dài từ 8 đến 128 ký tự.');
  }

  const sql = await getSql();
  let user: AccountUser;

  if (createAccount) {
    const salt = randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(passwordInput, salt);
    const id = randomUUID();
    const rows = await sql`
      INSERT INTO app_accounts (id, username, password_salt, password_hash)
      VALUES (${id}, ${username}, ${salt}, ${passwordHash.toString('hex')})
      ON CONFLICT (username) DO NOTHING
      RETURNING id::text AS id, username
    `;
    if (!rows.length) return jsonFailure(409, 'Tên tài khoản này đã được sử dụng.');
    user = { id: String(rows[0].id), username: String(rows[0].username) };
  } else {
    const rows = await sql`
      SELECT id::text AS id, username, password_salt, password_hash
      FROM app_accounts WHERE username = ${username} LIMIT 1
    `;
    const account = rows[0];
    const salt = account ? String(account.password_salt) : '00000000000000000000000000000000';
    const actualHash = await hashPassword(passwordInput, salt);
    const expectedHash = Buffer.from(account ? String(account.password_hash) : '0'.repeat(128), 'hex');
    const passwordMatches = actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
    if (!account || !passwordMatches) return jsonFailure(401, 'Tên tài khoản hoặc mật khẩu chưa đúng.');
    user = { id: String(account.id), username: String(account.username) };
  }

  const cookie = await createSession(user, secure);
  return { status: createAccount ? 201 : 200, body: { success: true, user }, cookie };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function handleAuthApi(
  method: string,
  cookieHeader: string | null,
  body: unknown,
  secure: boolean,
): Promise<AccountApiResult> {
  try {
    if (method === 'GET') {
      const user = await findSession(cookieHeader);
      return { status: 200, body: { success: true, user } };
    }
    if (method !== 'POST' || !isRecord(body)) return jsonFailure(405, 'Method not allowed.');

    if (body.action === 'register') {
      return await authenticate(body.username, body.password, true, secure);
    }
    if (body.action === 'login') {
      return await authenticate(body.username, body.password, false, secure);
    }
    if (body.action === 'logout') {
      const token = readSessionToken(cookieHeader);
      if (token) {
        const sql = await getSql();
        await sql`DELETE FROM app_sessions WHERE token_hash = ${tokenHash(token)}`;
      }
      return { status: 200, body: { success: true, user: null }, cookie: sessionCookie(null, secure) };
    }
    return jsonFailure(400, 'Unsupported account action.');
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED') {
      return jsonFailure(503, 'Tính năng đồng bộ chưa sẵn sàng vì máy chủ chưa kết nối cơ sở dữ liệu.');
    }
    console.error('[Account API] Request failed:', error instanceof Error ? error.message : 'unknown error');
    return jsonFailure(500, 'Tài khoản chưa xử lý được. Thử lại sau nhé.');
  }
}

export async function handleProgressApi(
  method: string,
  cookieHeader: string | null,
  body: unknown,
): Promise<AccountApiResult> {
  try {
    const user = await findSession(cookieHeader);
    if (!user) return jsonFailure(401, 'Cần đăng nhập để đồng bộ tiến trình.');

    const sql = await getSql();
    if (method === 'GET') {
      const rows = await sql`
        SELECT grammar_progress, vocab_unlocked_day, vocab_day_stars
        FROM app_progress WHERE user_id = ${user.id} LIMIT 1
      `;
      if (!rows.length) return { status: 200, body: { success: true, data: DEFAULT_PROGRESS } };
      return {
        status: 200,
        body: {
          success: true,
          data: {
            grammarProgress: rows[0].grammar_progress,
            vocabUnlockedDay: Number(rows[0].vocab_unlocked_day),
            vocabDayStars: rows[0].vocab_day_stars,
          },
        },
      };
    }
    if (method !== 'PUT' || !isRecord(body)) return jsonFailure(405, 'Method not allowed.');

    const progress = safeProgress(body);
    if (!progress) return jsonFailure(400, 'Tiến trình không hợp lệ.');

    await sql`
      INSERT INTO app_progress (user_id, grammar_progress, vocab_unlocked_day, vocab_day_stars, updated_at)
      VALUES (
        ${user.id},
        ${JSON.stringify(progress.grammarProgress)}::jsonb,
        ${progress.vocabUnlockedDay},
        ${JSON.stringify(progress.vocabDayStars)}::jsonb,
        now()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        grammar_progress = (
          SELECT COALESCE(jsonb_object_agg(key, best_score), '{}'::jsonb)
          FROM (
            SELECT key, MAX(score) AS best_score
            FROM (
              SELECT key, value::integer AS score FROM jsonb_each_text(app_progress.grammar_progress)
              UNION ALL
              SELECT key, value::integer AS score FROM jsonb_each_text(EXCLUDED.grammar_progress)
            ) all_scores
            GROUP BY key
          ) merged_scores
        ),
        vocab_unlocked_day = GREATEST(app_progress.vocab_unlocked_day, EXCLUDED.vocab_unlocked_day),
        vocab_day_stars = (
          SELECT COALESCE(jsonb_object_agg(key, best_stars), '{}'::jsonb)
          FROM (
            SELECT key, MAX(stars) AS best_stars
            FROM (
              SELECT key, value::integer AS stars FROM jsonb_each_text(app_progress.vocab_day_stars)
              UNION ALL
              SELECT key, value::integer AS stars FROM jsonb_each_text(EXCLUDED.vocab_day_stars)
            ) all_stars
            GROUP BY key
          ) merged_stars
        ),
        updated_at = now()
    `;
    return { status: 200, body: { success: true } };
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED') {
      return jsonFailure(503, 'Tính năng đồng bộ chưa sẵn sàng vì máy chủ chưa kết nối cơ sở dữ liệu.');
    }
    console.error('[Progress API] Request failed:', error instanceof Error ? error.message : 'unknown error');
    return jsonFailure(500, 'Không đồng bộ được tiến trình lúc này.');
  }
}

export function requestIsSecure(protocol: string | null, url: string): boolean {
  return protocol?.split(',')[0].trim() === 'https' || new URL(url).protocol === 'https:';
}
