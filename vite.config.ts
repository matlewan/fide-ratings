import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-static';

export default defineConfig(({ mode }) => ({
    plugins: [
        sveltekit({
            adapter: adapter({
                pages: 'build',
                assets: 'build',
                fallback: '404.html',
                precompress: false,
                strict: true
            }),
            paths: {
                base: mode === 'production' ? '/fide-ratings' : ''
            }
        })
    ]
}));