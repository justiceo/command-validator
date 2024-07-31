import { WhichFSM, whichTestCases } from '../../src/builtins/which.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('WhichFSM', () => {
  let fsm;
  let tempDir;
  let tempScript;
  let originalPath;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'which-test-'));
    tempScript = path.join(tempDir, 'test-script.sh');
    fs.writeFileSync(tempScript, '#!/bin/bash\necho "Hello, World!"', { mode: 0o755 });
    originalPath = process.env.PATH;
    process.env.PATH = `${tempDir}:${process.env.PATH}`;
  });

  afterAll(() => {
    process.env.PATH = originalPath;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new WhichFSM();
  });

  whichTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('which with common command', () => {
    const command = 'which ls';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/\/ls$/);
  });

  test('which with custom script', () => {
    const command = 'which test-script.sh';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(tempScript);
  });

  test('which with multiple commands', () => {
    const command = 'which ls cat grep';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim().split('\n');
    expect(output.length).toBe(3);
    expect(output[0]).toMatch(/\/ls$/);
    expect(output[1]).toMatch(/\/cat$/);
    expect(output[2]).toMatch(/\/grep$/);
  });

  test('which with -a option', () => {
    const command = 'which -a bash';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim().split('\n');
    expect(output.length).toBeGreaterThanOrEqual(1);
    output.forEach(line => expect(line).toMatch(/\/bash$/));
  });

  test('which with non-existent command', () => {
    const nonExistentCmd = 'nonexistentcmd_' + Math.floor(Math.random() * 10000);
    const command = `which ${nonExistentCmd}`;
    expect(fsm.isValid(command)).toBe(true);

    expect(() => execSync(command)).toThrow();
  });
});