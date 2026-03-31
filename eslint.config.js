import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const RAW_GEOMETRY_TAGS = new Set(["path", "line", "circle", "ellipse", "polygon", "polyline"]);
const COLOR_LITERAL_PATTERN = /#(?:[0-9a-f]{3,8})\b/i;

const geointRules = {
  "no-raw-geometry": {
    meta: {
      type: "problem",
      docs: {
        description: "Force surface renderers to use the shared geometry primitives.",
      },
      schema: [],
    },
    create(context) {
      const filename = context.filename ?? context.getFilename();
      if (!filename.includes("/src/workspace/") || filename.endsWith("/geometryPrimitives.tsx") || filename.endsWith("/WorkspaceQaPage.tsx")) {
        return {};
      }

      return {
        JSXOpeningElement(node) {
          if (node.name.type !== "JSXIdentifier") return;
          if (!RAW_GEOMETRY_TAGS.has(node.name.name)) return;
          context.report({
            node,
            message: "Use shared geometry primitives instead of raw SVG geometry in workspace surface files.",
          });
        },
      };
    },
  },
  "no-hardcoded-workspace-colors": {
    meta: {
      type: "problem",
      docs: {
        description: "Prevent hard-coded color literals in workspace rendering files.",
      },
      schema: [],
    },
    create(context) {
      const filename = context.filename ?? context.getFilename();
      if (
        (!filename.endsWith("/src/workspace/SurfaceViews.tsx") && !filename.endsWith("/src/workspace/geo.ts")) ||
        filename.endsWith("/geometryPrimitives.tsx")
      ) {
        return {};
      }

      function checkValue(node, value) {
        if (typeof value !== "string") return;
        if (!COLOR_LITERAL_PATTERN.test(value)) return;
        context.report({
          node,
          message: "Use workspace tokens or semantic color helpers instead of hard-coded colors.",
        });
      }

      return {
        Literal(node) {
          checkValue(node, node.value);
        },
        TemplateElement(node) {
          checkValue(node, node.value.raw);
        },
      };
    },
  },
};

export default tseslint.config(
  {
    ignores: ["dist/**", "coverage/**", "playwright-report/**", "test-results/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      geoint: {
        rules: geointRules,
      },
    },
    rules: {
      "geoint/no-raw-geometry": "error",
      "geoint/no-hardcoded-workspace-colors": "error",
    },
  }
);
