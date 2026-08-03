import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      import: importPlugin,
    },

    rules: {
      // Imports
      "import/no-unresolved": "error",
      "import/named": "error",

      // General JS
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "no-undef": "error",
      "no-duplicate-imports": "error",
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".json"],
        },
      },
    },
  },
];
