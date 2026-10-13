import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldLogo } from './ShieldLogo';
import { tacticalAudio } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const {
    signInWithGoogle,
    signInWithDiscord,
    signInWithApple,
    signInWithCredentials,
    signUpWithCredentials,
    quickLoginDemo
  } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberTier, setMemberTier] = useState<'TEST' | 'TITULAIRE' | 'PREMIUM'>('TITULAIRE');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security: only show test accounts in development mode or if explicitly enabled
  const showTestAccounts = Boolean(
    import.meta.env.DEV || import.meta.env.VITE_SHOW_TEST_ACCOUNTS === 'true'
  );

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithDiscord();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec de la connexion avec Discord');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithApple();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec de la connexion avec Apple');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'login') {
        await signInWithCredentials(email, password);
      } else {
        await signUpWithCredentials({
          email,
          password,
          callsign: callsign.trim() || 'OPERATEUR',
          displayName: displayName.trim() || callsign,
          phone,
          memberTier
        });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Identifiants incorrects. Vérifiez votre email et mot de passe.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Cette adresse email est déjà enregistrée. Veuillez vous connecter.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      } else {
        setErrorMsg(err.message || 'Une erreur est survenue lors de l\'authentification.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'VIPER' | 'RECRUE') => {
    setLoading(true);
    try {
      await quickLoginDemo(role);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#16181A] border-2 border-[#E87A1E]/80 rounded-lg shadow-[0_0_60px_rgba(232,122,30,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A1D20] border-b border-[#282a2c]">
          <div className="flex items-center gap-2.5">
            <ShieldLogo size={32} showGlow={true} />
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-[#E2E3DF]">
                {mode === 'login' ? 'Connexion Opérateur' : 'Inscription Escouade'}
              </span>
              <p className="font-mono text-[9px] text-[#E87A1E] uppercase">
                Portail d'Authentification Sécurisé FOST
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded bg-[#22262B] hover:bg-[#282a2c] text-[#8E9297] hover:text-[#E2E3DF] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#282a2c] bg-[#111315]">
          <button
            onClick={() => {
              tacticalAudio.playClick();
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-mono text-xs uppercase font-bold transition-colors cursor-pointer border-b-2 ${
              mode === 'login'
                ? 'border-[#E87A1E] text-[#E87A1E] bg-[#16181A]'
                : 'border-transparent text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            Se Connecter
          </button>
          <button
            onClick={() => {
              tacticalAudio.playClick();
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-mono text-xs uppercase font-bold transition-colors cursor-pointer border-b-2 ${
              mode === 'signup'
                ? 'border-[#E87A1E] text-[#E87A1E] bg-[#16181A]'
                : 'border-transparent text-[#8E9297] hover:text-[#E2E3DF]'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Social OAuth Sign-In */}
          <div className="space-y-2">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#22262B] hover:bg-[#282a2c] border border-[#333537] hover:border-[#E87A1E] text-[#E2E3DF] font-mono text-xs font-semibold rounded flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            {/* Discord */}
            <button
              type="button"
              onClick={handleDiscordLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-xs font-semibold rounded flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(88,101,242,0.4)]"
            >
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Continuer avec Discord</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-black hover:bg-zinc-900 border border-zinc-700 text-white font-mono text-xs font-semibold rounded flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm hover:border-zinc-500"
            >
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-0.92.04-2.01.62-2.65 1.37-.56.65-.99 1.71-.87 2.73 1.03.08 2-.51 2.6-1.23z" />
              </svg>
              <span>Continuer avec Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#8E9297]">
            <div className="flex-1 border-t border-[#282a2c]" />
            <span>OU AVEC VOS IDENTIFIANTS</span>
            <div className="flex-1 border-t border-[#282a2c]" />
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                      Callsign / Indicatif *
                    </label>
                    <input
                      type="text"
                      required
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value)}
                      placeholder="EX: VIPER, GHOST"
                      className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alexandre D."
                      className="w-full bg-[#111315] text-[#E2E3DF] font-['Inter'] text-xs px-3 py-2 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                    Formule d'Adhésion Initiale
                  </label>
                  <select
                    value={memberTier}
                    onChange={(e) => setMemberTier(e.target.value as any)}
                    className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none cursor-pointer"
                  >
                    <option value="TITULAIRE">Membre Titulaire Officiel (20€ / an - 0€ les sessions)</option>
                    <option value="PREMIUM">Membre Premium Élite (80€ / an - Avantages Cerakote)</option>
                    <option value="TEST">Membre Test (15€ - Essai 6 mois)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operateur@fost.fr"
                className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase text-[#8E9297] mb-1 font-semibold">
                Mot de Passe *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111315] text-[#E2E3DF] font-mono text-xs px-3 py-2 rounded border border-[#333537] focus:border-[#E87A1E] focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-[#2A1517] border border-[#E74C3C] rounded font-mono text-[11px] text-[#E74C3C] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#E87A1E] hover:brightness-110 text-[#111315] font-mono text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(232,122,30,0.4)]"
            >
              <span className="material-symbols-outlined text-sm">
                {mode === 'login' ? 'login' : 'how_to_reg'}
              </span>
              <span>
                {loading
                  ? 'Traitement...'
                  : mode === 'login'
                  ? 'Accéder à mon Profil'
                  : "Finaliser l'Inscription"}
              </span>
            </button>
          </form>

          {/* Quick Demo Switcher - Uniquement visible en environnement de développement ou si VITE_SHOW_TEST_ACCOUNTS=true */}
          {showTestAccounts && (
            <div className="p-3 bg-[#111315] border border-[#282a2c] rounded space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8E9297]">
                <span>COMPTES TEST RAPIDES (SANS MOT DE PASSE) :</span>
                <span className="text-[#2ECC71]">1-CLIC</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('VIPER')}
                  className="py-1.5 px-2 bg-[#1A1D20] hover:bg-[#282a2c] border border-[#E87A1E]/30 text-[#E87A1E] text-[10px] font-mono rounded text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">shield</span>
                  <span className="truncate">VIPER (Staff)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('RECRUE')}
                  className="py-1.5 px-2 bg-[#1A1D20] hover:bg-[#282a2c] border border-[#2ECC71]/30 text-[#2ECC71] text-[10px] font-mono rounded text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">person</span>
                  <span className="truncate">RECRUE (Test)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
