import { HeadFSM } from '../../src/builtins/head.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('HeadFSM', () => {
  let fsm;
  let tempDir;
  let testFile;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'head-test-'));
    testFile = path.join(tempDir, 'test.txt');
    const content = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}\n`).join('');
    fs.writeFileSync(testFile, content);
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new HeadFSM();
  });

  test('Basic head', () => {
    expect(fsm.isValid('head')).toBe(true);
  });

  test('head with file', () => {
    expect(fsm.isValid(`head ${testFile}`)).toBe(true);
    const output = execSync(`head ${testFile}`).toString();
    expect(output.split('\n').length).toBe(11); // 10 lines + empty line
  });

  test('head with -n option', () => {
    expect(fsm.isValid(`head -n 5 ${testFile}`)).toBe(true);
    const output = execSync(`head -n 5 ${testFile}`).toString();
    expect(output.split('\n').length).toBe(6); // 5 lines + empty line
  });

  test('head with -c option', () => {
    expect(fsm.isValid(`head -c 20 ${testFile}`)).toBe(true);
    const output = execSync(`head -c 20 ${testFile}`).toString();
    expect(output.length).toBe(20);
  });

  test('head with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.txt');
    expect(fsm.isValid(`head ${nonExistentFile}`)).toBe(true);
    expect(() => execSync(`head ${nonExistentFile}`)).toThrow();
  });

  test('head with invalid option', () => {
    expect(fsm.isValid('head -z')).toBe(true); // The FSM allows invalid options
    expect(() => execSync('head -z')).toThrow();
  });
});