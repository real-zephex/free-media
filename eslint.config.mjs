import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Client components hydrate watch-history from localStorage in
      // effects (SSR-safe). That is the intended pattern here, but the
      // new compiler rule flags any synchronous setState in an effect.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "dist-electron/**"],
  },
];

export default config;
