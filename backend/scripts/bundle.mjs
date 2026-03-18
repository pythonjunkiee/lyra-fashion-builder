import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/vercel-entry.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/index.js',
  format: 'cjs',
  // Keep cloudinary external — it uses native Node.js APIs internally
  external: ['cloudinary'],
});

console.log('✅ Bundle written to api/index.js');
