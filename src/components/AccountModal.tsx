import React, { FormEvent, useEffect, useState } from 'react';
import { X, Mail, LockKeyhole, LoaderCircle, Cloud, LogOut } from 'lucide-react';
import { useLearningProgress } from '../contexts/ProgressContext';

interface AccountModalProps {
  onClose: () => void;
}

type AccountMode = 'signin' | 'signup';

export const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  const {
    user,
    authLoading,
    syncStatus,
    authError,
    signInWithEmail,
    signInWithGoogle,
    createEmailAccount,
    sendPasswordReset,
    signOut,
    clearAuthError,
  } = useLearningProgress();
  const [mode, setMode] = useState<AccountMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const switchMode = (nextMode: AccountMode) => {
    setMode(nextMode);
    setNotice('');
    clearAuthError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    clearAuthError();

    const success = mode === 'signup'
      ? await createEmailAccount(email.trim(), password)
      : await signInWithEmail(email.trim(), password);

    setBusy(false);
    if (success) onClose();
  };

  const handleGoogleSignIn = async () => {
    setBusy(true);
    setNotice('');
    clearAuthError();
    const success = await signInWithGoogle();
    setBusy(false);
    if (success) onClose();
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setNotice('Nhập email trước, rồi mình sẽ gửi link đặt lại mật khẩu.');
      return;
    }

    setBusy(true);
    setNotice('');
    clearAuthError();
    const sent = await sendPasswordReset(email.trim());
    setBusy(false);
    if (sent) setNotice('Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư nhé.');
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 px-4 py-6 flex items-center justify-center"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
        className="w-full max-w-md bg-white border-4 border-black shadow-neo-lg p-5 sm:p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 border-2 border-black bg-neoYellow flex items-center justify-center hover:bg-yellow-300"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-10">
          <h2 id="account-modal-title" className="text-2xl font-black font-heading">
            {user ? 'Tài khoản của bạn' : mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-1">
            {user ? 'Tiến trình sẽ đồng bộ theo tài khoản này.' : 'Đăng nhập bằng Google hoặc email và mật khẩu để đồng bộ tiến trình.'}
          </p>
        </div>

        {user ? (
          <div className="mt-5 space-y-4">
            <div className="bg-cyan-50 border-2 border-black px-3 py-3 flex items-center gap-2 font-bold break-all">
              <Cloud className={`w-5 h-5 shrink-0 ${syncStatus === 'error' ? 'text-red-600' : 'text-cyan-700'}`} />
              <span>{user.email} · {syncStatus === 'saved' ? 'Đã đồng bộ' : syncStatus === 'error' ? 'Lỗi đồng bộ' : 'Đang đồng bộ'}</span>
            </div>
            <button
              onClick={() => { void signOut(); onClose(); }}
              className="w-full min-h-11 bg-white border-2 border-black shadow-neo-sm font-black flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { void handleGoogleSignIn(); }}
              disabled={busy || authLoading}
              className="mt-5 w-full min-h-12 px-4 bg-white border-2 border-black shadow-neo-sm font-black flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <span aria-hidden="true" className="text-xl font-black text-[#4285F4]">G</span>}
              Đăng nhập bằng Google
            </button>

            <div className="mt-3 flex items-center gap-3 text-xs font-bold text-gray-500">
              <span className="h-px flex-1 bg-gray-300" />
              Hoặc dùng email
              <span className="h-px flex-1 bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              <label className="block text-sm font-black">
                Email
                <span className="mt-1 flex items-center gap-2 border-2 border-black px-3 bg-white focus-within:ring-2 focus-within:ring-cyan-500">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="ban@example.com"
                    disabled={busy}
                    className="w-full h-11 outline-none bg-transparent font-bold"
                  />
                </span>
              </label>

              <label className="block text-sm font-black">
                Mật khẩu
                <span className="mt-1 flex items-center gap-2 border-2 border-black px-3 bg-white focus-within:ring-2 focus-within:ring-cyan-500">
                  <LockKeyhole className="w-4 h-4 text-gray-500 shrink-0" />
                  <input
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder={mode === 'signup' ? 'Ít nhất 6 ký tự' : 'Mật khẩu'}
                    disabled={busy}
                    className="w-full h-11 outline-none bg-transparent font-bold"
                  />
                </span>
              </label>

              {authError && <p role="alert" className="bg-red-50 border-2 border-red-400 px-3 py-2 text-sm font-bold text-red-800">{authError}</p>}
              {notice && <p role="status" className="bg-cyan-50 border-2 border-cyan-500 px-3 py-2 text-sm font-bold text-cyan-900">{notice}</p>}

              <button
                type="submit"
                disabled={busy || authLoading}
                className="w-full min-h-12 px-4 bg-neoYellow border-2 border-black shadow-neo-sm font-black flex items-center justify-center gap-2 hover:bg-yellow-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy || authLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : null}
                {mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập và đồng bộ'}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
              <button onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="underline underline-offset-2">
                {mode === 'signin' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
              </button>
              {mode === 'signin' && (
                <button onClick={() => { void handlePasswordReset(); }} disabled={busy} className="underline underline-offset-2 disabled:opacity-50">
                  Quên mật khẩu?
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
