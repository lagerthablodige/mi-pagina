// Íconos de WhatsApp e Instagram compartidos (inicio y páginas de prenda).
export function WhatsAppIcon({ color = "#f5f0e8", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 1.68.44 3.26 1.21 4.63L2.5 21.5l5.02-1.19a9.46 9.46 0 0 0 4.48 1.14c5.25 0 9.5-4.25 9.5-9.5s-4.25-9.45-9.5-9.45Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 7.6c.2-.45.4-.46.6-.47.16-.01.35-.01.5.01.17.02.4-.02.62.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.47-.14.16-.3.36-.43.48-.14.14-.28.28-.13.56.16.29.7 1.2 1.53 1.95 1.06.96 1.94 1.26 2.23 1.4.29.15.46.13.63-.07.17-.2.72-.82.91-1.1.19-.28.38-.23.63-.14.26.1 1.65.79 1.93.94.28.14.47.21.53.34.06.13.06.75-.19 1.47-.25.72-1.42 1.38-1.96 1.44-.5.06-1.13.09-1.83-.11-.42-.12-.96-.31-1.65-.6-2.91-1.24-4.81-4.08-4.96-4.28-.14-.2-1.18-1.56-1.18-2.98 0-1.42.75-2.12 1.02-2.41Z"
        fill={color}
      />
    </svg>
  );
}

export function InstagramIcon({ color = "#f5f0e8", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke={color} strokeWidth="1.2" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill={color} />
    </svg>
  );
}
