module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/interface-name-prefix': 0,
    }
};