module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: {
          var: 2,
          let: 2,
          const: 3,
        },
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-underscore-dangle': [
      'off',
    ],
    'func-names': [
      'error',
      'as-needed',
    ],
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          VariableDeclarator: true,
        },
      },
    ],
    'one-var': [
      'off',
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'consistent-return': [
      'off',
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    radix: [
      'off',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    camelcase: [
      'off',
    ],
    'function-paren-newline': [
      'error',
      'consistent',
    ],

    'import/no-unresolved': [
      'off',
    ],
    'import/no-extraneous-dependencies': [
      'off',
    ],
    'arrow-parens': [
      'error',
      'as-needed',
    ],
    '@typescript-eslint/interface-name-prefix': [
      'error',
      'always',
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
