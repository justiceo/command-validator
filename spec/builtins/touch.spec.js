import { TouchFSM } from '../../src/builtins/touch.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('TouchFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'touch-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new TouchFSM();
  });

  test('Basic touch', () => {
    const newFile = path.join(tempDir, 'newfile');
    expect(fsm.isValid(`touch ${newFile}`)).toBe(true);
    execSync(`touch ${newFile}`);
    expect(fs.existsSync(newFile)).toBe(true);
  });

  test('touch existing file', () => {
    const existingFile = path.join(tempDir, 'existing');
    fs.writeFileSync(existingFile, 'Content');
    const originalMtime = fs.statSync(existingFile).mtime;
    expect(fsm.isValid(`touch ${existingFile}`)).toBe(true);
    execSync(`touch ${existingFile}`);
    const newMtime = fs.statSync(existingFile).mtime;
    expect(newMtime.getTime()).toBeGreaterThan(originalMtime.getTime());
  });

  test('touch with -a option', () => {
    const file = path.join(tempDir, 'atime');
    fs.writeFileSync(file, 'Content');
    const originalAtime = fs.statSync(file).atime;
    const originalMtime = fs.statSync(file).mtime;
    expect(fsm.isValid(`touch -a ${file}`)).toBe(true);
    execSync(`touch -a ${file}`);
    const newStats = fs.statSync(file);
    expect(newStats.atime.getTime()).toBeGreaterThan(originalAtime.getTime());
    expect(newStats.mtime.getTime()).toBe(originalMtime.getTime());
  });

  test('touch with -m option', () => {
    const file = path.join(tempDir, 'mtime');
    fs.writeFileSync(file, 'Content');
    const originalAtime = fs.statSync(file).atime;
    const originalMtime = fs.statSync(file).mtime;
    expect(fsm.isValid(`touch -m ${file}`)).toBe(true);
    execSync(`touch -m ${file}`);
    const newStats = fs.statSync(file);
    expect(newStats.atime.getTime()).toBe(originalAtime.getTime());
    expect(newStats.mtime.getTime()).toBeGreaterThan(originalMtime.getTime());
  });

  test('touch with -t option', () => {
    const file = path.join(tempDir, 'specifictime');
    const timestamp = '202101010000.00';
    expect(fsm.isValid(`touch -t ${timestamp} ${file}`)).toBe(true);
    execSync(`touch -t ${timestamp} ${file}`);
    const stats = fs.statSync(file);
    expect(stats.mtime.getFullYear()).toBe(2021);
    expect(stats.mtime.getMonth()).toBe(0); // January
    expect(stats.mtime.getDate()).toBe(1);
  });

  test('touch with invalid option', () => {
    const file = path.join(tempDir, 'invalid');
    expect(fsm.isValid(`touch -z ${file}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`touch -z ${file}`)).toThrow();
  });
});