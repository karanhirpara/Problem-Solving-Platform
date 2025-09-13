import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function runCppCode(cppCode: string, input: string): string {
  // Work in a temp directory to avoid path/space issues
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-run-'));
  const cppPath = path.join(tmpDir, 'solution.cpp');

  // Choose proper output name per platform
  const isWindows = process.platform === 'win32';
  const outName = isWindows ? 'solution.exe' : 'solution';
  const outPath = path.join(tmpDir, outName);

  try {
    // Write code
    fs.writeFileSync(cppPath, cppCode, 'utf8');

    // Compile (ensure g++ is on PATH)
    // Quote paths in case tmp dir has spaces
    const compileCmd = `g++ "${cppPath}" -O2 -std=c++17 -o "${outPath}"`;
    execSync(compileCmd, { stdio: 'pipe', encoding: 'utf8' });

    // Build the run command
    // Windows CMD: run by absolute path without "./"
    // Unix: prefix with "./" only if using relative path; absolute is fine directly.
    const runCmd = isWindows ? `"${outPath}"` : `"${outPath}"`;

    const output = execSync(runCmd, {
      input,
      encoding: 'utf8',
      timeout: 5000, // ms
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return output.trim();
  } catch (error: any) {
    // Extract the most informative message
    const msg =
      (error?.stderr && error.stderr.toString().trim()) ||
      (error?.stdout && error.stdout.toString().trim()) ||
      (error?.message ?? String(error));
    throw new Error(msg);
  } finally {
    // Cleanup
    try { fs.unlinkSync(cppPath); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
    try { fs.rmdirSync(tmpDir); } catch {}
  }
}

