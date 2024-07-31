import { CatFSM } from '../../src/builtins/cat.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('CatFSM', () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cat-test-'));
    testFile1 = path.join(tempDir, 'test1.txt');
    testFile2 = path.join(tempDir, 'test2.txt');
    fs.writeFileSync(testFile1, 'Hello, World!\n');
    fs.writeFileSync(testFile2, 'Test file content\n');
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new CatFSM();
  });

  test('Basic cat', () => {
    expect(fsm.isValid('cat')).toBe(true);
  });

  test('cat with single file', () => {
    expect(fsm.isValid(`cat ${testFile1}`)).toBe(true);
    const output = execSync(`cat ${testFile1}`).toString();
    expect(output).toBe('Hello, World!\n');
  });

  test('cat with multiple files', () => {
    expect(fsm.isValid(`cat ${testFile1} ${testFile2}`)).toBe(true);
    const output = execSync(`cat ${testFile1} ${testFile2}`).toString();
    expect(output).toBe('Hello, World!\nTest file content\n');
  });

  test('cat with -n option', () => {
    expect(fsm.isValid(`cat -n ${testFile1}`)).toBe(true);
    const output = execSync(`cat -n ${testFile1}`).toString();
    expect(output).toMatch(/^\s*1\s+Hello, World!$/m);
  });

  test('cat with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.txt');
    expect(fsm.isValid(`cat ${nonExistentFile}`)).toBe(true);
    expect(() => execSync(`cat ${nonExistentFile}`)).toThrow();
  });

  test('cat with invalid option', () => {
    expect(fsm.isValid('cat -z')).toBe(true); // The FSM allows invalid options
    expect(() => execSync('cat -z')).toThrow();
  });
});