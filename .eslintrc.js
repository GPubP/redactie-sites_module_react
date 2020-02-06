module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'react',
		'import',
		'react-hooks',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		"plugin:react/recommended",
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
	],
	env: {
		"browser": true,
		"amd": true,
		"node": true
	},
	rules: {
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-explicit-any': 0,
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		'import/order': 2,
		'import/first': 2,
		'import/exports-last': 2,
		'import/no-duplicates': 2,
		'quotes': [2, 'single'],
		'indent': [2, 'tab'],
		'react/prop-types': 0,
		"comma-dangle": ["error", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "always-multiline",
			"exports": "always-multiline",
			"functions": "never"
		}]
	}
};
