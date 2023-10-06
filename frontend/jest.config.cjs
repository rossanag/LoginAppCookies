	module.exports =  {
	verbose: true,
	preset: 'ts-jest',	        
	setupFilesAfterEnv: ['./setupTest.ts'],  
	testPathIgnorePatterns: ['./node_modules/'],    
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/src/__mocks__/fileMock.ts',
		'\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',
		//'\\.(css|less|scss|sass)$': 'identity-obj-proxy' 
	},   
	// testPathIgnorePatterns: ['./node_modules/'],
	collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**', '!**/vendor/**'],	
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},			
};

// https://stackoverflow.com/questions/39418555/syntaxerror-with-jest-and-react-and-importing-css-files