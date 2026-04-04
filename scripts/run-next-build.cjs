/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');

const distDir = process.argv[2] || `.next-verify-${Date.now()}`;
const env = {
  ...process.env,
  NEXT_DIST_DIR: distDir,
};

const result = spawnSync('next', ['build', '--webpack'], {
  stdio: 'inherit',
  shell: true,
  env,
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
