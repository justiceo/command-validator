import { RmFSM } from '../../src/builtins/rm.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('RmFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rm-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new RmFSM();
  });

  test('Basic rm', () => {
    const testFile = path.join(tempDir, 'testfile');
    fs.writeFileSync(testFile, 'Test content');
    expect(fsm.isValid(`rm ${testFile}`)).toBe(true);
    execSync(`rm ${testFile}`);
    expect(fs.existsSync(testFile)).toBe(false);
  });

  test('rm with multiple files', () => {
    const file1 = path.join(tempDir, 'file1');
    const file2 = path.join(tempDir, 'file2');
    fs.writeFileSync(file1, 'Content 1');
    fs.writeFileSync(file2, 'Content 2');
    expect(fsm.isValid(`rm ${file1} ${file2}`)).toBe(true);
    execSync(`rm ${file1} ${file2}`);
    expect(fs.existsSync(file1)).toBe(false);
    expect(fs.existsSync(file2)).toBe(false);
  });

  test('rm with -r option', () => {
    const testDir = path.join(tempDir, 'testdir');
    fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(testDir, 'file'), 'Content');
    expect(fsm.isValid(`rm -r ${testDir}`)).toBe(true);
    execSync(`rm -r ${testDir}`);
    expect(fs.existsSync(testDir)).toBe(false);
  });

  test('rm with -f option', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent');
    expect(fsm.isValid(`rm -f ${nonExistentFile}`)).toBe(true);
    execSync(`rm -f ${nonExistentFile}`); // Should not throw
  });

  test('rm with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent');
    expect(fsm.isValid(`rm ${nonExistentFile}`)).toBe(true);
    expect(() => execSync(`rm ${nonExistentFile}`)).toThrow();
  });

  test('rm with invalid option', () => {
    expect(fsm.isValid(`rm -z ${tempDir}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`rm -z ${tempDir}`)).toThrow();
  });
});