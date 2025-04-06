import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	
				adapter: adapter({
					pages: 'build',
					fallback: 'index.html',
					precompress: true
				})
			

	
};

export default config;
