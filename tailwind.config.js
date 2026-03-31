/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* ── Surface colors mapped from css_variables.css ── */
      colors: {
        surface: {
          canvas: "var(--surface-canvas)",
          base: "var(--surface-base)",
          panel: "var(--surface-panel)",
          "panel-alt": "var(--surface-panel-alt)",
          elevated: "var(--surface-elevated)",
          paper: "var(--surface-paper)",
        },
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-ink": "var(--accent-primary-ink)",
          secondary: "var(--accent-secondary)",
          alert: "var(--accent-alert)",
          verified: "var(--accent-verified)",
        },
        geometry: {
          reference: "var(--geometry-reference-blue)",
          active: "var(--geometry-active-amber)",
          neutral: "var(--geometry-neutral-muted)",
          incident: "var(--geometry-node-incident)",
          asset: "var(--geometry-node-asset)",
          marker: "var(--geometry-node-reference)",
        },
        panel: {
          bg: "var(--color-panel-bg)",
          border: "var(--color-panel-border)",
        },
      },
      /* ── Spacing scale (4–64) ── */
      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
      },
      /* ── Border radius tokens ── */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
        shell: "1.75rem", // 28px — outer workspace shell
      },
      /* ── Shadows ── */
      boxShadow: {
        soft: "var(--shadow-soft)",
        strong: "var(--shadow-strong)",
        "workspace-xl": "0 24px 80px rgba(0, 0, 0, 0.38)",
        glow: "0 0 0 1px var(--surface-glow)",
        "glow-strong": "0 0 0 1px var(--surface-glow-strong)",
      },
      borderWidth: {
        ringPrimary: "var(--geometry-ring-thickness-primary)",
        ringSecondary: "var(--geometry-ring-thickness-secondary)",
        vectorPrimary: "var(--geometry-vector-primary)",
        vectorSecondary: "var(--geometry-vector-secondary)",
        vectorDashed: "var(--geometry-vector-dashed)",
      },
      backdropBlur: {
        panel: "var(--panel-blur)",
      },
      /* ── Typography ── */
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "meta-xs": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],  // 10px
        "meta-sm": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }], // 11px
        "label":   ["0.75rem", { lineHeight: "1.5" }],   // 12px
        "body-sm": ["0.8125rem", { lineHeight: "1.6" }],  // 13px
        "body":    ["0.875rem", { lineHeight: "1.6" }],   // 14px
      },
      maxWidth: {
        container: "var(--container-max)",
      },
    },
  },
  plugins: [],
};
