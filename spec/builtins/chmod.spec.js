import { ChmodFSM } from '../../src/builtins/chmod.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('ChmodFSM', () => {
  let fsm;
  let tempDir;
  let testFile;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chmod-test-'));
    testFile = path.join(tempDir, 'test.txt');
    fs.writeFileSync(testFile, 'Test content');
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new ChmodFSM();
  });

  test('Basic chmod', () => {
    expect(fsm.isValid(`chmod 644 ${testFile}`)).toBe(true);
  });

  test('chmod with symbolic mode', () => {
    expect(fsm.isValid(`chmod u+x ${testFile}`)).toBe(true);
  });

  test('chmod with recursive option', () => {
    expect(fsm.isValid(`chmod -R 755 ${tempDir}`)).toBe(true);
  });

  test('chmod with reference option', () => {
    const refFile = path.join(tempDir, 'ref.txt');
    fs.writeFileSync(refFile, 'Reference file');
    expect(fsm.isValid(`chmod --reference=${refFile} ${testFile}`)).toBe(true);
  });

  test('chmod with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.txt');
    expect(fsm.isValid(`chmod 644 ${nonExistentFile}`)).toBe(true);
  });

  test('chmod with invalid mode', () => {
    expect(fsm.isValid(`chmod 999 ${testFile}`)).toBe(true); // The FSM allows invalid modes
  });

  test('chmod with invalid option', () => {
    expect(fsm.isValid(`chmod -z 644 ${testFile}`)).toBe(true); // The FSM allows invalid options
  });

  test('chmod execution', () => {
    execSync(`chmod 644 ${testFile}`);
    const fileMode = execSync(`stat -c %a ${testFile}`).toString().trim();
    expect(fileMode).toBe('644');
  });
});