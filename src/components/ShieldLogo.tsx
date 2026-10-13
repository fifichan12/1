import React, { useState } from 'react';
import officialLogoImg from '../assets/images/fost_official_logo_1791795065414.jpg';

interface ShieldLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
  customLogoUrl?: string;
}

export const ShieldLogo: React.FC<ShieldLogoProps> = ({
  size = 40,
  className = '',
  showGlow = true,
  customLogoUrl
}) => {
  const [imgError, setImgError] = useState(false);
  const [storedLogo, setStoredLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('fost_custom_logo');
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        setStoredLogo(localStorage.getItem('fost_custom_logo'));
        setImgError(false);
      } catch {
        // ignore
      }
    };
    window.addEventListener('fost_site_config_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('fost_site_config_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeLogoSrc = customLogoUrl || storedLogo || officialLogoImg || '/fost-logo.jpg';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ width: size, height: size }}
      title="Écusson Officiel FOST Airsoft"
    >
      {/* Tactical Glow Aura */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-sm opacity-60 bg-[#E87A1E]/40 pointer-events-none group-hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Main Logo Disc / Patch */}
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-[#E87A1E]/80 shadow-[0_0_12px_rgba(232,122,30,0.35)] transition-transform duration-300 group-hover:scale-105 bg-[#14171A] flex items-center justify-center">
        {!imgError ? (
          <img
            key={activeLogoSrc}
            src={activeLogoSrc}
            alt="Écusson Officiel FOST Airsoft"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <img
            src={officialLogoImg || '/fost-logo.jpg'}
            alt="Écusson Officiel FOST Airsoft"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full"
          />
        )}

        {/* Circular tactical glass sheen overlay */}
        <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-white/10 bg-gradient-to-tr from-transparent via-transparent to-white/15" />
      </div>
    </div>
  );
};
