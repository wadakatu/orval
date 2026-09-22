import spawn from 'cross-spawn';

/**
 * Run a binary and resolve once it exits with code 0. Rejects with the spawn
 * error (for example `ENOENT` when the binary is missing) or with an Error
 * naming the exit code and the captured stderr.
 *
 * `cross-spawn` rather than `node:child_process` so npm-installed CLIs
 * (`prettier.cmd`, `npx.cmd`, ...) resolve on Windows with arguments quoted.
 */
export function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr?.on('data', (chunk: Buffer) => (stderr += chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) return resolve();
      const detail = stderr.trim();
      reject(
        new Error(
          `${bin} exited with code ${code}${detail ? `\n${detail}` : ''}`,
        ),
      );
    });
  });
}
