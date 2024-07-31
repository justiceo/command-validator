import fs from 'fs';
import path from 'path';
import os from 'os';
import { CdFSM } from '../../src/builtins/cd.js';

describe('CdFSM', () => {
  let tempDir;
  let fsm;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cd-fsm-test-'));
    fs.mkdirSync(path.join(tempDir, 'Documents'));
    fs.mkdirSync(path.join(tempDir, 'My Documents'));
    fs.mkdirSync(path.join(tempDir, 'path with spaces'));
    fs.mkdirSync(path.join(tempDir, 'üñîçødë'));
    fs.symlinkSync(path.join(tempDir, 'Documents'), path.join(tempDir, 'Symbolic Link'), 'dir');
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new CdFSM();
  });

  test('Basic cd', () => {
    expect(fsm.isValid('cd')).toBe(true);
  });

  test('Absolute path', () => {
    expect(fsm.isValid(`cd ${tempDir}`)).toBe(true);
  });

  test('Parent directory', () => {
    expect(fsm.isValid('cd ..')).toBe(true);
  });

  test('Home directory with subfolder', () => {
    expect(fsm.isValid('cd ~/Documents')).toBe(true);
  });

  test('Directory with spaces (quoted)', () => {
    expect(fsm.isValid(`cd "${path.join(tempDir, 'My Documents')}"`)).toBe(true);
  });

  test('Option with path', () => {
    expect(fsm.isValid(`cd -P ${tempDir}`)).toBe(true);
  });

  test('Option with symbolic link (quoted)', () => {
    expect(fsm.isValid(`cd -L "${path.join(tempDir, 'Symbolic Link')}"`)).toBe(true);
  });

  test('Previous directory', () => {
    expect(fsm.isValid('cd -')).toBe(true);
  });

  test("Another user's home directory", () => {
    expect(fsm.isValid('cd ~username')).toBe(true);
  });

  test('Environment variable', () => {
    expect(fsm.isValid('cd $HOME')).toBe(true);
  });

  test('Environment variable with path', () => {
    expect(fsm.isValid('cd ${HOME}/Documents')).toBe(true);
  });

  test('Subshell command', () => {
    expect(fsm.isValid('cd $(pwd)')).toBe(true);
  });

  test('Path with escaped spaces', () => {
    expect(fsm.isValid(`cd ${path.join(tempDir, 'path\\ with\\ spaces')}`)).toBe(true);
  });

  test('Path with multiple escaped spaces', () => {
    expect(fsm.isValid(`cd ${path.join(tempDir, 'path\\ with\\ spaces')}`)).toBe(true);
  });

  test('Tab-separated path', () => {
    expect(fsm.isValid(`cd \t${tempDir}`)).toBe(true);
  });

  test('Trailing space in path', () => {
    expect(fsm.isValid(`cd ${tempDir} `)).toBe(true);
  });

  test('Invalid: extra word', () => {
    expect(fsm.isValid(`cd to ${tempDir}`)).toBe(false);
  });

  test('Invalid: multiple paths', () => {
    expect(fsm.isValid(`cd ${tempDir} ${tempDir}/Documents`)).toBe(false);
  });

  test('Invalid: multiple relative paths', () => {
    expect(fsm.isValid('cd a b')).toBe(false);
  });

  test('Invalid: unclosed quote', () => {
    expect(fsm.isValid('cd "Unclosed Quote')).toBe(false);
  });

  test('Tab and space-separated', () => {
    expect(fsm.isValid(`cd \t${tempDir}\t${path.join(tempDir, 'Documents')}`)).toBe(false);
  });

  test('Empty path', () => {
    expect(fsm.isValid('cd ""')).toBe(true);
  });

  test('Environment variable with curly braces', () => {
    expect(fsm.isValid('cd ${HOME}')).toBe(true);
  });

  test('Path with special characters', () => {
    expect(fsm.isValid('cd /path/with!@#$%^&*()_+')).toBe(true);
  });

  test('Path with unicode characters', () => {
    expect(fsm.isValid(`cd ${path.join(tempDir, 'üñîçødë')}`)).toBe(true);
  });

  test('Invalid: unescaped space in path', () => {
    expect(fsm.isValid(`cd ${path.join(tempDir, 'path with spaces')}`)).toBe(false);
  });

  test('Invalid: invalid option', () => {
    expect(fsm.isValid('cd -invalidOption')).toBe(false);
  });

  test('Escaped quotes in path', () => {
    expect(fsm.isValid('cd /path/with/\\"escaped\\"/quotes')).toBe(true);
  });

  test('Invalid: unmatched parentheses in subshell', () => {
    expect(fsm.isValid('cd $(pwd')).toBe(false);
  });

  test('Complex path with multiple elements', () => {
    expect(fsm.isValid(`cd -P $(pwd)/~username/${tempDir}/Documents`)).toBe(true);
  });

  test('Path with only spaces (quoted)', () => {
    expect(fsm.isValid('cd "   "')).toBe(true);
  });

  test('Path with only spaces (unquoted)', () => {
    expect(fsm.isValid('cd    ')).toBe(true);
  });

  test('Path with special characters in quotes', () => {
    expect(fsm.isValid('cd "/path/with/special/!$%^&*()"')).toBe(true);
  });
});