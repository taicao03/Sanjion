import React, { useState } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Eye,
  Code as CodeIcon,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';

interface GmailConfirmEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail?: string;
  fullName?: string;
}

export const GmailConfirmEmailModal: React.FC<GmailConfirmEmailModalProps> = ({
  isOpen,
  onClose,
  targetEmail = 'user@gmail.com',
  fullName = 'Học Viên Sanjion',
}) => {
  const [email, setEmail] = useState<string>(targetEmail);
  const [userName, setUserName] = useState<string>(fullName);
  const [otpCode, setOtpCode] = useState<string>('849-204');
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'HTML_CODE' | 'CONFIG'>('PREVIEW');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!isOpen) return null;

  // GENERATE PROFESSIONAL GMAIL CONFIRMATION EMAIL HTML
  const generateGmailConfirmHtml = () => {
    const confirmationLink = `https://sanjion.dev/auth/confirm-email?token=${Date.now().toString(36)}&email=${encodeURIComponent(
      email
    )}`;

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác Nhận Địa Chỉ Gmail — Sanjion Code Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0D11; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #EDEFF2; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0B0D11; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Outer Card Container -->
        <table role="presentation" width="580" cellspacing="0" cellpadding="0" style="background-color: #161B22; border: 1px solid rgba(201, 150, 44, 0.4); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);">
          
          <!-- Top Cyber Gold Brand Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #181F2A 0%, #0F141C 100%); padding: 36px 40px 30px 40px; border-bottom: 2px solid #C9962C; text-align: center;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <!-- Brand Badge -->
                    <div style="display: inline-block; background-color: rgba(201, 150, 44, 0.12); border: 1px solid #C9962C; border-radius: 50px; padding: 8px 20px; margin-bottom: 16px;">
                      <span style="color: #C9962C; font-weight: 800; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
                        🛡️ SANJION PLATFORM SECURITY
                      </span>
                    </div>
                    <h1 style="margin: 10px 0 0 0; color: #FFFFFF; font-size: 26px; font-weight: 800; tracking-tight: -0.5px; line-height: 1.3;">
                      Xác Nhận Địa Chỉ Gmail Của Bạn
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #8B94A3; font-size: 14px;">
                      Hoàn tất đăng ký tài khoản để truy cập kho học liệu Frontend 2026
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <!-- Greeting -->
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #EDEFF2; line-height: 1.6;">
                      Xin chào <strong style="color: #C9962C; font-size: 16px;">${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 14px; color: #8B94A3; line-height: 1.6;">
                      Cảm ơn bạn đã đăng ký tài khoản tại <strong>Sanjion Code Academy</strong> bằng Gmail <span style="color: #2FAE79; font-weight: 600;">${email}</span>. Vui lòng xác nhận địa chỉ Gmail để kích hoạt toàn bộ tính năng chấm bài AI và lưu tiến độ học tập.
                    </p>

                    <!-- Big Verification Button (CTA) -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                      <tr>
                        <td align="center">
                          <a href="${confirmationLink}" target="_blank" style="display: inline-block; background-color: #C9962C; color: #0B0D11; font-weight: 900; font-size: 15px; text-decoration: none; padding: 16px 36px; border-radius: 12px; box-shadow: 0 10px 25px rgba(201, 150, 44, 0.3); transition: all 0.3s ease;">
                            ✅ KÍCH HOẠT TÀI KHOẢN GMAIL
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- OTP Code Alternative Box -->
                    <div style="background-color: #0B0D11; border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 14px; padding: 20px; text-align: center; margin: 28px 0 20px 0;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #8B94A3; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                        HOẶC NHẬP MÃ XÁC THỰC OTP (6 CHỮ SỐ):
                      </p>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; color: #2FAE79; letter-spacing: 6px; margin: 8px 0;">
                        ${otpCode}
                      </div>
                      <p style="margin: 6px 0 0 0; font-size: 11px; color: #C1553B;">
                        ⏱️ Mã OTP này có hiệu lực trong vòng 15 phút.
                      </p>
                    </div>

                    <!-- Direct URL Backup Link -->
                    <p style="margin: 20px 0 6px 0; font-size: 12px; color: #8B94A3;">
                      Nếu nút bấm không hoạt động, copy và dán đường dẫn dưới đây vào trình duyệt:
                    </p>
                    <div style="background-color: #0B0D11; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 10px 14px; word-break: break-all; font-family: monospace; font-size: 11px; color: #5B54D9;">
                      ${confirmationLink}
                    </div>

                    <!-- Security Alert Note -->
                    <div style="margin-top: 28px; padding: 14px; background-color: rgba(91, 84, 217, 0.1); border-left: 3px solid #5B54D9; border-radius: 4px; font-size: 12px; color: #8B94A3; line-height: 1.5;">
                      🔒 <strong>Lưu ý bảo mật:</strong> Nếu bạn không phải là người thực hiện yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email. Tài khoản Gmail của bạn sẽ không bị ảnh hưởng.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #0B0D11; padding: 24px 40px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #EDEFF2; font-weight: 700;">
                Sanjion Frontend Developer Academy 2026
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; color: #8B94A3;">
                Tối ưu hóa kỹ năng lập trình Frontend theo tiêu chuẩn Enterprise
              </p>
              <p style="margin: 0; font-size: 11px; color: #5B54D9;">
                Cần trợ giúp? Liên hệ: <a href="mailto:support@sanjion.dev" style="color: #C9962C; text-decoration: none;">support@sanjion.dev</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const handleCopyHtml = () => {
    const html = generateGmailConfirmHtml();
    navigator.clipboard.writeText(html);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendSimulatedEmail = () => {
    setSendStatus('sending');
    setTimeout(() => {
      setSendStatus('sent');
      setTimeout(() => setSendStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 font-mono animate-fadeIn">
      <div className="bg-[#161B22] border border-white/10 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9962C]/20 border border-[#C9962C]/50 flex items-center justify-center text-[#C9962C]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Template Email Xác Nhận Tài Khoản Gmail
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#2FAE79]/20 border border-[#2FAE79]/40 text-[#2FAE79]">
                  Chuyên Nghiệp 2026
                </span>
              </h3>
              <p className="text-[11px] text-[#8B94A3]">
                Dùng cho xác thực tài khoản Gmail (Supabase Auth / SendGrid / Resend)
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="py-4 space-y-3">
          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-[#8B94A3] mb-1 font-bold">Địa Chỉ Gmail Hướng Tới:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#2FAE79] focus:outline-none focus:border-[#C9962C]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8B94A3] mb-1 font-bold">Tên Học Viên:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9962C]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8B94A3] mb-1 font-bold">Mã OTP (6 chữ số):</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#C9962C] font-bold focus:outline-none focus:border-[#C9962C]"
              />
            </div>
          </div>

          {/* Action Tabs & Buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-1 bg-[#0B0D11] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('PREVIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'PREVIEW'
                    ? 'bg-[#C9962C] text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Giao Diện Email</span>
              </button>

              <button
                onClick={() => setActiveTab('HTML_CODE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'HTML_CODE'
                    ? 'bg-[#5B54D9] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                <span>Mã Nguồn HTML Template</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                className="px-3.5 py-1.5 rounded-lg bg-[#0F141C] border border-white/10 hover:bg-white/5 text-xs text-[#2FAE79] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-[#2FAE79]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Đã Copy Mã HTML!' : 'Copy HTML Template'}</span>
              </button>

              <button
                onClick={handleSendSimulatedEmail}
                disabled={sendStatus === 'sending'}
                className="py-1.5 px-4 rounded-lg bg-[#2FAE79] hover:bg-[#2FAE79]/90 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {sendStatus === 'sending' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : sendStatus === 'sent' ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>
                  {sendStatus === 'sending'
                    ? 'Đang Gửi...'
                    : sendStatus === 'sent'
                    ? 'Đã Gửi Gmail!'
                    : 'Gửi Email Xác Nhận Thử'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* View Canvas */}
        <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-white max-h-[52vh]">
          {activeTab === 'PREVIEW' ? (
            <iframe
              title="Gmail Confirmation Email Preview"
              srcDoc={generateGmailConfirmHtml()}
              className="w-full h-full border-none"
            />
          ) : (
            <textarea
              readOnly
              value={generateGmailConfirmHtml()}
              className="w-full h-full p-4 bg-[#0B0D11] text-[#2FAE79] font-mono text-xs focus:outline-none leading-relaxed resize-none"
            />
          )}
        </div>

      </div>
    </div>
  );
};
