import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formattedEmail = email.includes('@') ? email : `${email}@sanjion.dev`;
      if (mode === 'login') {
        await authService.loginWithEmail(formattedEmail, password);
        setSuccessMsg('Đăng nhập thành công!');
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 600);
      } else {
        await authService.registerWithEmail(formattedEmail, password, fullName);
        setSuccessMsg('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Xảy ra lỗi trong quá trình xác thực.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      await authService.loginWithOAuth(provider);
    } catch (err: any) {
      if (err.message && (err.message.includes('provider is not enabled') || err.message.includes('Unsupported provider'))) {
        setErrorMsg(`⚠️ Cần kích hoạt ${provider.toUpperCase()} Provider trên Supabase Dashboard: Vào Authentication -> Providers -> ${provider.toUpperCase()} -> Bật Enable và dán Client ID/Secret.`);
      } else {
        setErrorMsg(err.message || `Không thể đăng nhập bằng ${provider}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#0B0D11]/90 flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#161B22] border border-white/[0.06] rounded-lg max-w-md w-full p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#8B94A3] hover:text-[#EDEFF2] rounded hover:bg-white/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-2">
          <div className="w-12 h-12 rounded bg-[#0B0D11] border border-white/[0.06] flex items-center justify-center text-[#C9962C] mx-auto mb-3">
            <Heart className="w-6 h-6 text-[#C9962C]" />
          </div>
          <h3 className="text-xl font-display font-medium text-[#EDEFF2] tracking-tight">
            {mode === 'login' ? 'Đăng Nhập Sanjion' : 'Tạo Tài Khoản Sanjion'}
          </h3>
          <p className="text-xs text-[#8B94A3] font-mono mt-1">
            Đồng bộ tiến độ học tập và điểm Sanjion.
          </p>
        </div>

        {/* PROMINENT GOOGLE & GITHUB 1-CLICK OAUTH BUTTONS */}
        <div className="mt-4 mb-3 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleOAuth('google')}
            disabled={isLoading}
            className="py-2 px-3 rounded bg-[#0B0D11] border border-white/[0.06] hover:border-white/20 text-[#EDEFF2] text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={() => handleOAuth('github')}
            disabled={isLoading}
            className="py-2 px-3 rounded bg-[#0B0D11] border border-white/[0.06] hover:border-white/20 text-[#EDEFF2] text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <div className="relative my-3 flex items-center justify-center">
          <div className="border-t border-white/[0.06] w-full" />
          <span className="bg-[#161B22] px-3 text-[10px] uppercase font-mono text-[#8B94A3] absolute">HOẶC DÙNG EMAIL</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0B0D11] p-1 rounded border border-white/[0.06] mb-3">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
              mode === 'login'
                ? 'bg-[#161B22] text-[#EDEFF2] border-b-2 border-[#C9962C]'
                : 'text-[#8B94A3] hover:text-[#EDEFF2]'
            }`}
          >
            Đăng Nhập Email
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
              mode === 'register'
                ? 'bg-[#161B22] text-[#EDEFF2] border-b-2 border-[#C9962C]'
                : 'text-[#8B94A3] hover:text-[#EDEFF2]'
            }`}
          >
            Tạo Tài Khoản Mới
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="flex items-start gap-2 p-3 rounded bg-[#C1553B]/10 border border-[#C1553B]/30 text-[#C1553B] text-xs mb-3 leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded bg-[#2FAE79]/10 border border-[#2FAE79]/30 text-[#2FAE79] text-xs mb-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 font-mono">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-[#8B94A3] mb-1">Họ và Tên:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B94A3]" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-9 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#C9962C]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-[#8B94A3] mb-1">Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B94A3]" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-9 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#C9962C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#8B94A3] mb-1">Mật khẩu:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B94A3]" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-9 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#C9962C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded border border-[#C9962C] text-[#C9962C] bg-[#C9962C]/10 hover:bg-[#C9962C]/20 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {isLoading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng Nhập Email' : 'Tạo Tài Khoản Mới'}
          </button>
        </form>
      </div>
    </div>
  );
};
