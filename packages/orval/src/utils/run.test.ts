import { describe, expect, it } from 'vite-plus/test';

import { run } from './run';

describe('run', () => {
  it('resolves when the process exits 0', async () => {
    await expect(run(process.execPath, ['-e', ''])).resolves.toBeUndefined();
  });

  it('rejects with the exit code and stderr on failure', async () => {
    await expect(
      run(process.execPath, ['-e', 'console.error("boom"); process.exit(3)']),
    ).rejects.toThrow(/exited with code 3\nboom/);
  });

  it('rejects with ENOENT when the binary does not exist', async () => {
    await expect(
      run('orval-definitely-missing-binary', []),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
