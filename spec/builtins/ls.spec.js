import { LsFSM } from '../../src/builtins/ls.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('LsFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ls-test-'));
    fs.writeFileSync(path.join(tempDir, 'file1'), 'content');
    fs.writeFileSync(path.join(tempDir, 'file2'), 'content');
    fs.mkdirSync(path.join(tempDir, 'dir1'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new LsFSM();
  });

  test('Basic ls', () => {
    expect(fsm.isValid(`ls ${tempDir}`)).toBe(true);
    const output = execSync(`ls ${tempDir}`).toString().trim().split('\n');
    expect(output).toContain('file1');
    expect(output).toContain('file2');
    expect(output).toContain('dir1');
  });

  test('ls with -l option', () => {
    expect(fsm.isValid(`ls -l ${tempDir}`)).toBe(true);
    const output = execSync(`ls -l ${tempDir}`).toString().trim().split('\n');
    expect(output.length).toBeGreaterThan(1);
    expect(output[0]).toMatch(/^total \d+$/);
    expect(output[1]).toMatch(/^[-d]([rwx-]{3}){3}\s+\d+\s+\w+\s+\w+\s+\d+\s+\w+\s+\d+\s+\d+:\d+\s+\w+$/);
  });

  test('ls with -a option', () => {
    expect(fsm.isValid(`ls -a ${tempDir}`)).toBe(true);
    const output = execSync(`ls -a ${tempDir}`).toString().trim().split('\n');
    expect(output).toContain('.');
    expect(output).toContain('..');
  });

  test('ls with -R option', () => {
    fs.writeFileSync(path.join(tempDir, 'dir1', 'file3'), 'content');
    expect(fsm.isValid(`ls -R ${tempDir}`)).toBe(true);
    const output = execSync(`ls -R ${tempDir}`).toString().trim();
    expect(output).toContain('dir1:');
    expect(output).toContain('file3');
  });

  test('ls with multiple options', () => {
    expect(fsm.isValid(`ls -la ${tempDir}`)).toBe(true);
    const output = execSync(`ls -la ${tempDir}`).toString().trim().split('\n');
    expect(output).toContain('.');
    expect(output).toContain('..');
    expect(output[0]).toMatch(/^total \d+$/);
  });

  test('ls with non-existent directory', () => {
    const nonExistentDir = path.join(tempDir, 'nonexistent');
    expect(fsm.isValid(`ls ${nonExistentDir}`)).toBe(true);
    expect(() => execSync(`ls ${nonExistentDir}`)).toThrow();
  });

  test('ls with invalid option', () => {
    expect(fsm.isValid(`ls -z ${tempDir}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`ls -z ${tempDir}`)).toThrow();
  });
});