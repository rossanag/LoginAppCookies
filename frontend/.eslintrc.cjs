module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['react-app', 'plugin:react/recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],  
	parser: '@typescript-eslint/parser',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: [
		'react',
		'css',
		'jest',
		'@typescript-eslint'
	],
	rules: {        
		'indent': [        
			'error',
			'tab'
		],      
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'react/react-in-jsx-scope': 'off',
		'react/jsx-uses-react': 'off',
		'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
	},
	root: true
};
