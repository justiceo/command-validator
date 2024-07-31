import { MkdirFSM } from '../../src/builtins/mkdir.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('MkdirFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mkdir-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new MkdirFSM();
  });

  test('Basic mkdir', () => {
    const newDir = path.join(tempDir, 'newdir');
    expect(fsm.isValid(`mkdir ${newDir}`)).toBe(true);
    execSync(`mkdir ${newDir}`);
    expect(fs.existsSync(newDir)).toBe(true);
  });

  test('mkdir with multiple directories', () => {
    const dir1 = path.join(tempDir, 'dir1');
    const dir2 = path.join(tempDir, 'dir2');
    expect(fsm.isValid(`mkdir ${dir1} ${dir2}`)).toBe(true);
    execSync(`mkdir ${dir1} ${dir2}`);
    expect(fs.existsSync(dir1)).toBe(true);
    expect(fs.existsSync(dir2)).toBe(true);
  });

  test('mkdir with -p option', () => {
    const nestedDir = path.join(tempDir, 'parent/child');
    expect(fsm.isValid(`mkdir -p ${nestedDir}`)).toBe(true);
    execSync(`mkdir -p ${nestedDir}`);
    expect(fs.existsSync(nestedDir)).toBe(true);
  });

  test('mkdir with -m option', () => {
    const modeDir = path.join(tempDir, 'modedir');
    expect(fsm.isValid(`mkdir -m 700 ${modeDir}`)).toBe(true);
    execSync(`mkdir -m 700 ${modeDir}`);
    const stats = fs.statSync(modeDir);
    expect(stats.mode & 0o777).toBe(0o700);
  });

  test('mkdir with existing directory', () => {
    const existingDir = path.join(tempDir, 'existing');
    fs.mkdirSync(existingDir);
    expect(fsm.isValid(`mkdir ${existingDir}`)).toBe(true);
    expect(() => execSync(`mkdir ${existingDir}`)).toThrow();
  });

  test('mkdir with invalid option', () => {
    expect(fsm.isValid(`mkdir -z ${tempDir}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`mkdir -z ${tempDir}`)).toThrow();
  });
});