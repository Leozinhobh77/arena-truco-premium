// ============================================================
// TELA DE LOGIN — LoginScreen.tsx
// Login REAL via Supabase Auth (Email + Senha)
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useValidateAuth } from '../hooks/useValidateAuth';
import { useValidateForm } from '../hooks/useValidateForm';
import { ValidationErrorModal } from '../components/ValidationErrorModal';
import { NickSelectionModal } from '../components/NickSelectionModal';
import { AccountExistsModal } from '../components/AccountExistsModal';
import type { ValidationError } from '../hooks/useValidateAuth';

// ── Partículas de fundo ──────────────────────────────────────
function Particles() {
  const [particles] = useState(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 5,
    color: i % 3 === 0 ? 'var(--gold-400)' : i % 3 === 1 ? 'var(--ruby)' : 'var(--lavender)',
  })));

  return (
    <div className="particles-bg">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`, bottom: '-10px',
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Anel orbital ─────────────────────────────────────────────
function OrbitRing({ radius, duration, children }: { radius: number; duration: number; children: React.ReactNode }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2, height: radius * 2,
        borderRadius: '50%',
        border: '1px solid rgba(212,160,23,0.15)',
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.div>
  );
}

// ── Campo de Input ───────────────────────────────────────────
function Campo({
  icone, placeholder, value, onChange, onBlur, type = 'text', autoFocus = false, error = false
}: {
  icone: string; placeholder: string; value: string;
  onChange: (v: string) => void; onBlur?: () => void; type?: string; autoFocus?: boolean; error?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span style={{
        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
        fontSize: 18, pointerEvents: 'none', zIndex: 2
      }}>
        {icone}
      </span>
      <input
        className={`input-field ${error ? 'input-error' : ''}`}
        style={{ paddingLeft: 48, paddingRight: isPassword ? 48 : 16 }}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        autoFocus={autoFocus}
        autoComplete={isPassword ? 'current-password' : 'off'}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 2
          }}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

// ── Botão Social ─────────────────────────────────────────────
function SocialButton({ onClick, icon, label, disabled }: { onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-social"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
        color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease',
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── LoginScreen principal ────────────────────────────────────
type Modo = 'intro' | 'login' | 'cadastro' | 'loading';

export function LoginScreen() {
  const [modo, setModo] = useState<Modo>('intro');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nick, setNick] = useState('');

  const { signIn, signInWithGoogle, signUp, carregando, erro, limparErro } = useAuthStore();
  const { nickError, validating, validateNick, clearErrors } = useValidateAuth();
  const { emailError: formEmailError, senhaError, validateEmailFormat, validateEmailExists, validateSenha, clearErrors: clearFormErrors } = useValidateForm();

  const [modal, setModal] = useState<{ aberto: boolean; dados: ValidationError | null }>({
    aberto: false,
    dados: null,
  });

  const [modalNickGoogle, setModalNickGoogle] = useState(false);
  const [modalAccountExists, setModalAccountExists] = useState(false);

  const fecharModal = () => setModal({ aberto: false, dados: null });

  const abrirModal = (dados: ValidationError) => setModal({ aberto: true, dados });

  const resetForm = () => {
    setEmail(''); setSenha(''); setNick(''); limparErro(); clearErrors(); clearFormErrors();
  };

  const irPara = (m: Modo) => { resetForm(); setModo(m); };

  // Detectar erro de email duplicado durante cadastro
  useEffect(() => {
    if (modo === 'cadastro' && erro && (erro.includes('User already registered') || erro.includes('email já'))) {
      setModalAccountExists(true);
    }
  }, [erro, modo]);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) return;
    await signIn(email.trim(), senha.trim());
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleNickBlur = async () => {
    if (!nick.trim() || modo !== 'cadastro') return;
    const err = await validateNick(nick.trim());
    if (err) abrirModal(err);
  };

  const handleLoginEmailBlur = () => {
    validateEmailFormat(email.trim());
  };

  const handleLoginSenhaChange = (v: string) => {
    setSenha(v);
    if (v.trim()) validateSenha(v.trim());
  };

  const handleCadastroEmailBlur = async () => {
    if (!email.trim()) return;
    await validateEmailExists(email.trim());
  };

  const handleCadastroSenhaChange = (v: string) => {
    setSenha(v);
    if (v.trim()) validateSenha(v.trim());
  };

  const handleCadastro = async () => {
    if (!email.trim() || !senha.trim() || !nick.trim()) return;

    const nickErr = await validateNick(nick.trim());
    if (nickErr) { abrirModal(nickErr); return; }

    const emailErr = await validateEmailExists(email.trim());
    if (emailErr) {
      // Se email existe, não bloqueia - deixa o servidor confirmar
      // Mas mostra inline também
    }

    if (senha.trim().length < 6) { return; }

    await signUp(email.trim(), senha.trim(), nick.trim());
  };

  const { signUpWithGoogle } = useAuthStore();

  const handleConfirmNickGoogle = async (nickSelecionado: string) => {
    await signUpWithGoogle(nickSelecionado);
  };

  const handleAccountExistsGoToLogin = () => {
    setModalAccountExists(false);
    limparErro();
    irPara('login');
  };

  const handleAccountExistsTryAnother = () => {
    setModalAccountExists(false);
    limparErro();
    setEmail('');
    setSenha('');
  };

  const formAnimation = erro ? { x: [-10, 10, -10, 10, 0] } : {};

  return (
    <div className="login-screen" style={{ background: 'var(--obsidian-900)' }}>
      <Particles />

      {/* Anéis orbitais */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <OrbitRing radius={160} duration={20}>
          <div style={{ position: 'absolute', top: -4, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-400)', boxShadow: '0 0 10px var(--gold-400)' }} />
        </OrbitRing>
        <OrbitRing radius={220} duration={30}>
          <div style={{ position: 'absolute', bottom: -3, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--ruby)', boxShadow: '0 0 8px var(--ruby)' }} />
        </OrbitRing>
        <OrbitRing radius={280} duration={45}>
          <div style={{ position: 'absolute', top: '30%', right: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--lavender)', boxShadow: '0 0 8px var(--lavender)' }} />
        </OrbitRing>
      </div>

      {/* Conteúdo */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 32, padding: '0 24px',
      }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 80, lineHeight: 1, marginBottom: 16 }}
            className="arena-logo-glow"
          >
            🃏
          </motion.div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 900,
            color: 'var(--gold-400)', margin: 0, letterSpacing: '-0.03em',
            textShadow: '0 0 30px rgba(212,160,23,0.5)',
          }}>
            ARENA TRUCO
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
            color: 'var(--text-muted)', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: '6px 0 0',
          }}>
            Premium · Obsidian & Gold
          </p>
        </motion.div>

        {/* Formulários */}
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {modo === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <button id="btn-entrar-arena" className="btn-primary animate-pulse-gold" onClick={() => irPara('login')}>
                ENTRAR NA ARENA
              </button>
              <button id="btn-criar-conta" className="btn-secondary" onClick={() => irPara('cadastro')}>
                Criar Conta
              </button>
            </motion.div>
          )}

          {/* ── LOGIN ── */}
          {modo === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, ...formAnimation }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
                color: 'var(--text-primary)', textAlign: 'center', marginBottom: 4,
              }}>
                Entrar na Conta
              </div>

              <div>
                <Campo icone="✉️" placeholder="Seu email" value={email} onChange={setEmail} type="email" autoFocus onBlur={handleLoginEmailBlur} error={!!formEmailError || (!!erro && !email.trim())} />
                {formEmailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#e63946', paddingLeft: 4, marginTop: 6 }}
                  >
                    {formEmailError.message}
                  </motion.div>
                )}
              </div>

              <div>
                <Campo icone="🔒" placeholder="Sua senha" value={senha} onChange={handleLoginSenhaChange} type="password" error={!!senhaError || (!!erro && !senha.trim())} />
                {senhaError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#f97316', paddingLeft: 4, marginTop: 6 }}
                  >
                    {senhaError.message}
                  </motion.div>
                )}
              </div>

              {erro && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)',
                    borderRadius: 10, padding: '10px 14px',
                    fontSize: 12, color: '#e63946', textAlign: 'center',
                  }}
                >
                  {erro}
                </motion.div>
              )}

              <button
                id="btn-login-submit"
                className="btn-primary"
                onClick={handleLogin}
                disabled={carregando}
                style={{ opacity: email.trim() && senha.trim() ? 1 : 0.6 }}
              >
                {carregando ? 'CARREGANDO...' : 'ENTRAR 🃏'}
              </button>

              <div className="separator" style={{ margin: '8px 0' }} />

              <SocialButton
                onClick={handleGoogleLogin}
                disabled={carregando}
                label="Entrar com Google"
                icon={(
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.19 2.7 1.24 6.636l4.026 3.129Z"/>
                    <path fill="#FBBC05" d="M1.24 6.636a7.077 7.077 0 0 0 0 10.728l4.027-3.136a4.173 4.173 0 0 1 0-4.463L1.24 6.636Z"/>
                    <path fill="#4285F4" d="M12 19.091a7.023 7.023 0 0 1-4.932-2.036L3.045 20.19a11.97 11.97 0 0 0 18.91-5.636h-9.954v4.537Z"/>
                    <path fill="#34A853" d="M21.955 14.554c.036-.345.045-.71.045-1.091 0-.61-.045-1.2-.145-1.782h-9.855v3.91h5.81c-.5 1.5-1.645 2.6-3.01 3.49l3.864 3.01c2.254-2.082 3.827-5.145 4.318-8.537Z"/>
                  </svg>
                )}
              />

              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Não tem conta?{' '}
                <span
                  onClick={() => irPara('cadastro')}
                  style={{ color: 'var(--gold-400)', cursor: 'pointer', fontWeight: 700 }}
                >
                  Criar agora
                </span>
              </div>

              <button className="btn-secondary" onClick={() => irPara('intro')}>← Voltar</button>
            </motion.div>
          )}

          {/* ── CADASTRO ── */}
          {modo === 'cadastro' && (
            <motion.div
              key="cadastro"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, ...formAnimation }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
                color: 'var(--text-primary)', textAlign: 'center', marginBottom: 4,
              }}>
                Criar Conta
              </div>

              <div>
                <Campo
                  icone="🎮"
                  placeholder="Nick de truqueiro"
                  value={nick}
                  onChange={v => { setNick(v); }}
                  onBlur={handleNickBlur}
                  autoFocus
                  error={!!nickError || (!!erro && !nick.trim())}
                />
                {nickError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#e63946', paddingLeft: 4, marginTop: 6 }}
                  >
                    {nickError.message}
                  </motion.div>
                )}
              </div>

              <div>
                <Campo
                  icone="✉️"
                  placeholder="Seu email"
                  value={email}
                  onChange={v => { setEmail(v); }}
                  onBlur={handleCadastroEmailBlur}
                  type="email"
                  error={!!formEmailError || (!!erro && !email.trim())}
                />
                {formEmailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#e63946', paddingLeft: 4, marginTop: 6 }}
                  >
                    {formEmailError.message}
                  </motion.div>
                )}
              </div>

              <div>
                <Campo icone="🔒" placeholder="Senha (mín. 6 caracteres)" value={senha} onChange={handleCadastroSenhaChange} type="password" error={!!senhaError || (!!erro && !senha.trim())} />
                {senhaError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#f97316', paddingLeft: 4, marginTop: 6 }}
                  >
                    {senhaError.message}
                  </motion.div>
                )}
              </div>

              {erro && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)',
                    borderRadius: 10, padding: '10px 14px',
                    fontSize: 12, color: '#e63946', textAlign: 'center',
                  }}
                >
                  {erro}
                </motion.div>
              )}

              <button
                id="btn-cadastro-submit"
                className="btn-primary"
                onClick={handleCadastro}
                disabled={carregando || validating}
                style={{ opacity: email.trim() && senha.trim() && nick.trim() && !validating ? 1 : 0.6 }}
              >
                {validating ? 'VERIFICANDO...' : carregando ? 'CRIANDO...' : 'CRIAR CONTA 🚀'}
              </button>

              <div className="separator" style={{ margin: '8px 0' }} />

              <SocialButton
                onClick={() => setModalNickGoogle(true)}
                disabled={carregando}
                label="Cadastrar com Google"
                icon={(
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.19 2.7 1.24 6.636l4.026 3.129Z"/>
                    <path fill="#FBBC05" d="M1.24 6.636a7.077 7.077 0 0 0 0 10.728l4.027-3.136a4.173 4.173 0 0 1 0-4.463L1.24 6.636Z"/>
                    <path fill="#4285F4" d="M12 19.091a7.023 7.023 0 0 1-4.932-2.036L3.045 20.19a11.97 11.97 0 0 0 18.91-5.636h-9.954v4.537Z"/>
                    <path fill="#34A853" d="M21.955 14.554c.036-.345.045-.71.045-1.091 0-.61-.045-1.2-.145-1.782h-9.855v3.91h5.81c-.5 1.5-1.645 2.6-3.01 3.49l3.864 3.01c2.254-2.082 3.827-5.145 4.318-8.537Z"/>
                  </svg>
                )}
              />

              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                Já tem conta?{' '}
                <span
                  onClick={() => irPara('login')}
                  style={{ color: 'var(--gold-400)', cursor: 'pointer', fontWeight: 700 }}
                >
                  Entrar
                </span>
              </div>

              <button className="btn-secondary" onClick={() => irPara('intro')}>← Voltar</button>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {modo === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 60, height: 60, borderRadius: '50%',
                  border: '3px solid rgba(212,160,23,0.2)',
                  borderTop: '3px solid var(--gold-400)',
                  boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)',
                }}
              />
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 15,
                color: 'var(--gold-400)', letterSpacing: '0.1em',
                animation: 'glow-pulse 1s ease-in-out infinite',
              }}>
                Entrando na Arena...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}
        >
          Agente Forge v5.2 · Supabase Auth
        </motion.p>
      </div>

      {/* Modal de erro de validação */}
      <ValidationErrorModal
        isOpen={modal.aberto}
        type={modal.dados?.type ?? 'nick_invalid'}
        message={modal.dados?.message ?? ''}
        suggestions={modal.dados?.suggestions}
        onClose={fecharModal}
        onSelectSuggestion={(sugestao) => {
          setNick(sugestao);
          fecharModal();
        }}
        onGoToLogin={() => {
          fecharModal();
          irPara('login');
        }}
        onTryAnother={fecharModal}
      />

      {/* Modal de seleção de nick para Google */}
      <NickSelectionModal
        isOpen={modalNickGoogle}
        onClose={() => setModalNickGoogle(false)}
        onConfirm={handleConfirmNickGoogle}
        carregando={carregando}
      />

      {/* Modal de conta já existente */}
      <AccountExistsModal
        isOpen={modalAccountExists}
        email={email}
        onGoToLogin={handleAccountExistsGoToLogin}
        onTryAnother={handleAccountExistsTryAnother}
      />
    </div>
  );
}
