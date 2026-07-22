import React from 'react';

interface CategoryIconProps {
  slug?: string;
  name?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ slug = '', name = '', className = 'w-5 h-5' }) => {
  const s = (slug + ' ' + name).toLowerCase();

  // ⚛️ React Logo
  if (s.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // ⬛ Next.js Logo
  if (s.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path d="M149.508 157.52L69.141 54H54V125.97H66.8136V69.7574L136.873 160.038C141.353 159.395 145.58 158.552 149.508 157.52Z" fill="white" />
        <path d="M115 54H127.814V126H115V54Z" fill="white" />
      </svg>
    );
  }

  // 🟦 TypeScript Logo
  if (s.includes('typescript') || s.includes('ts')) {
    return (
      <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="24" fill="#3178C6" />
        <path d="M72.062 108v-9.523h12.569V50.81H97.2v47.667h12.569V108H72.062zm-28.536 0c-4.94 0-9.255-1.077-12.946-3.23-3.69-2.154-6.496-5.262-8.415-9.324-1.92-4.06-2.88-8.917-2.88-14.568h12.443c0 3.754.899 6.837 2.697 9.25 1.798 2.413 4.673 3.62 8.625 3.62 3.412 0 5.992-.816 7.74-2.447 1.748-1.632 2.622-3.69 2.622-6.176 0-1.798-.444-3.23-1.332-4.296-.888-1.065-2.203-1.93-3.945-2.593-1.742-.663-4.475-1.442-8.2-2.338-5.362-1.34-9.458-3.073-12.288-5.197-2.83-2.124-4.836-4.66-6.018-7.608-1.182-2.948-1.773-6.425-1.773-10.432 0-4.646 1.055-8.618 3.164-11.917 2.11-3.298 5.176-5.834 9.2-7.608 4.024-1.774 8.784-2.66 14.28-2.66 5.556 0 10.36 1.026 14.412 3.078 4.053 2.052 7.07 4.968 9.053 8.748 1.982 3.78 2.973 8.167 2.973 13.161H81.258c0-3.328-.772-6.02-2.316-8.077-1.544-2.057-4.004-3.085-7.38-3.085-3.056 0-5.368.743-6.936 2.228-1.568 1.485-2.352 3.376-2.352 5.672 0 1.632.41 2.948 1.23 3.948.82 1 2.052 1.83 3.696 2.49 1.644.66 4.316 1.43 8.016 2.31 5.39 1.287 9.53 2.97 12.42 5.05 2.89 2.08 4.92 4.594 6.09 7.54 1.17 2.947 1.755 6.46 1.755 10.538 0 4.675-1.077 8.684-3.23 12.027-2.154 3.343-5.268 5.908-9.342 7.695-4.075 1.787-8.91 2.68-14.505 2.68z" fill="white" />
      </svg>
    );
  }

  // 🟨 JavaScript Logo
  if (s.includes('js') || s.includes('javascript')) {
    return (
      <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="24" fill="#F7DF1E" />
        <path d="M67.312 103.93c4.17 2.457 9.062 4.17 14.15 4.17 10.155 0 16.626-5.074 16.626-14.73 0-8.97-5.91-12.723-14.542-16.488l-4.17-1.785c-5.73-2.457-8.622-4.536-8.622-8.97 0-4.08 3.255-6.99 8.25-6.99 4.17 0 7.44 1.545 9.72 3.795l5.265-7.905c-3.795-3.615-9.18-5.55-15.075-5.55-10.425 0-17.1 6.555-17.1 16.32 0 8.61 5.07 12.435 13.095 15.915l4.17 1.785c6.375 2.73 9.99 4.905 9.99 9.87 0 4.725-3.99 7.725-10.155 7.725-5.64 0-9.825-2.46-12.72-5.46l-5.88 8.355zM33.72 103.48c4.35 2.91 9.915 4.62 15.345 4.62 13.8 0 21.6-7.815 21.6-25.02V50.85H58.815v32.55c0 8.805-3.795 12.33-10.875 12.33-3.615 0-6.99-1.005-9.255-2.64l-4.965 10.39z" fill="#000000" />
      </svg>
    );
  }

  // 🟧 HTML5 / CSS3 Logo
  if (s.includes('html') || s.includes('css')) {
    return (
      <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="128" height="128" rx="24" fill="#E34F26" />
        <path d="M29 23h70l-6.364 71.4L58.5 105 25.364 94.4z" fill="#E34F26" />
        <path d="M64 29v69.2l23.864-7.6L92.5 29z" fill="#EF652A" />
        <path d="M64 45H43.5l.9 10h19.6v10H45.3l.9 10H64v10H36.2L33.5 35H64z" fill="#FFFFFF" />
        <path d="M64 45v10h18.7l-.9 10H64v10h16.9l-1.6 18.2L64 97.4V105l23.864-7.6L91.5 55H64z" fill="#ECECEC" />
      </svg>
    );
  }

  // ⚡ Async / Performance / Security Logo
  if (s.includes('async') || s.includes('performance') || s.includes('security') || s.includes('event')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#F59E0B" stroke="#D97706" />
      </svg>
    );
  }

  // Default Fallback Logo
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8B5CF6" />
    </svg>
  );
};
