import { WhereisFSM, whereisTestCases } from '../../src/builtins/whereis.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('WhereisFSM', () => {
  let fsm;
  let tempDir;
  let tempScript;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'whereis-test-'));
    tempScript = path.join(tempDir, 'test-script.sh');
    fs.writeFileSync(tempScript, '#!/bin/bash\necho "Hello, World!"', { mode: 0o755 });
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new WhereisFSM();
  });

  whereisTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('whereis with common command', () => {
    const command = 'whereis ls';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toMatch(/ls: .*\/ls/);
  });

  test('whereis with multiple results', () => {
    const command = 'whereis python';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toMatch(/python: .*\/python/);
    // May include binary, source, and manual page locations
  });

  test('whereis with custom script', () => {
    const command = `whereis ${tempScript}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(tempScript);
  });

  test('whereis with -b option (binaries only)', () => {
    const command = 'whereis -b ls';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toMatch(/ls: .*\/ls/);
    expect(output).not.toMatch(/ls: .*\/ls.1/);  // Should not include man pages
  });

  test('whereis with -m option (manual pages only)', () => {
    const command = 'whereis -m ls';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toMatch(/ls: .*\/ls.1/);
    expect(output).not.toMatch(/ls: .*\/bin\/ls/);  // Should not include binary
  });

  test('whereis with non-existent command', () => {
    const nonExistentCmd = 'nonexistentcmd_' + Math.floor(Math.random() * 10000);
    const command = `whereis ${nonExistentCmd}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toBe(`${nonExistentCmd}:\n`);
  });
});