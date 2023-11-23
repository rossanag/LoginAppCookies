/// <reference types="vitest" />
/// <reference types="Vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
//import fs from 'fs';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import type { Plugin } from 'vite';



function certPlugin(keyPath, certPath): Plugin {
	
	return {
		name: 'vite:cert-plugin',
		async config(config) {
			const https = () => ({
				https: {
					key: keyPath,
					cert: certPath,
				},
			});
			return {
				server: https(),
			};
		},
	};
}


const certPath = '../backend/certs/localhost.pem';
const keyPath = '../backend/certs/localhost-key.pem';

 

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(),eslint(),svgr(), certPlugin(keyPath, certPath)],	
	base: '/',
	server: {
		open: '/index.html',
		https: {
			/* key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath), */
			key: keyPath,
			cert: certPath,
		}, 
	}, 
	resolve: {
		alias: {
			'@root': path.resolve(__dirname, ''),
		},
	},
	test: {
		environment: 'happy-dom',
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html']
		},
		setupFiles: ['setupTest.ts']
	},
}); 
