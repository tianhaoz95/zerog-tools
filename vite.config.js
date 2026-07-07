import { defineConfig } from 'vite';
import { spawnSync } from 'node:child_process';

// Re-generate the per-tool pre-rendered pages, OG images, and sitemap after
// every build write — including watch-mode rebuilds. `vite build --watch`
// empties dist/ on each rebuild, so without this hook the /tools/<id> static
// pages vanish after the first source change and deep links go stale.
const postbuildPlugin = {
  name: 'zerog-postbuild',
  apply: 'build',
  closeBundle() {
    const res = spawnSync('node', ['scripts/postbuild.js'], { stdio: 'inherit' });
    if (res.error) throw res.error;
    if (res.signal) {
      // Killed externally (Ctrl+C, dev-server restart) — the whole process is
      // going down anyway; don't turn shutdown into a build error.
      console.warn(`postbuild interrupted by ${res.signal}`);
      return;
    }
    if (res.status !== 0) {
      throw new Error(`postbuild failed (exit ${res.status})`);
    }
  },
};

export default defineConfig({
  plugins: [postbuildPlugin],
  server: {
    port: 5002,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    port: 5002,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    // Exclude graphql from main bundle to avoid mangling issues
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/graphql')) {
            return 'graphql';
          }
        },
      },
    },
  },
});
