import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { NoSqlDatabase } from './db/nosql.js';
import {
  defaultVocabularies,
  defaultToeicTest,
  defaultProfile,
  VocabDoc,
  ToeicTestDoc,
  UserProfileDoc
} from './db/seedData.js';
import { createVocabRouter } from './routes/vocab.routes.js';
import { createTestRouter, SubmissionDoc } from './routes/test.routes.js';
import { createProfileRouter } from './routes/profile.routes.js';
import { createTtsRouter } from './routes/tts.routes.js';
import { createAccountRouter } from './routes/account.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', createAccountRouter());

// Initialize NoSQL Document Database
const dataDir = path.join(__dirname, '..', 'data');
const db = new NoSqlDatabase(dataDir);

const vocabCol = db.collection<VocabDoc>('vocabularies', defaultVocabularies);
const testCol = db.collection<ToeicTestDoc>('tests', [defaultToeicTest]);
const submissionCol = db.collection<SubmissionDoc>('submissions', []);
const profileCol = db.collection<UserProfileDoc>('profile', [defaultProfile]);

// Mount API Routes
app.use('/api/vocab', createVocabRouter(vocabCol));
app.use('/api/tests', createTestRouter(testCol, submissionCol));
app.use('/api/profile', createProfileRouter(profileCol));
app.use('/api/tts', createTtsRouter());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ing Lịch Tét API Server',
    database: 'Embedded NoSQL Document Store',
    collections: ['vocabularies', 'tests', 'submissions', 'profile'],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[🚀 Server] "Ing Lịch Tét" backend running at http://localhost:${PORT}`);
  console.log(`[💾 NoSQL] Documents stored at ${dataDir}`);
});
