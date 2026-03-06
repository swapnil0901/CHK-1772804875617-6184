## Packages
recharts | Dashboard analytics charts and data visualization
papaparse | Exporting reports to CSV
@types/papaparse | TypeScript definitions for papaparse
framer-motion | Beautiful page transitions and micro-interactions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes without style conflicts

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  sans: ["var(--font-sans)"],
}
Authentication expects a JWT token stored in localStorage under the key 'token' and sent via 'Authorization: Bearer <token>' header.
Currency symbol is hardcoded to Indian Rupee (₹).
