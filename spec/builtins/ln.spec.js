import { LnFSM } from '../../src/builtins/ln.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('LnFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ln-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new LnFSM();
  });

  test('Basic ln (hard link)', () => {
    const sourceFile = path.join(tempDir, 'source');
    const linkFile = path.join(tempDir, 'link');
    fs.writeFileSync(sourceFile, 'Test content');
    expect(fsm.isValid(`ln ${sourceFile} ${linkFile}`)).toBe(true);
    execSync(`ln ${sourceFile} ${linkFile}`);
    expect(fs.existsSync(linkFile)).toBe(true);
    expect(fs.readFileSync(linkFile, 'utf8')).toBe('Test content');
    expect(fs.statSync(sourceFile).ino).toBe(fs.statSync(linkFile).ino);
  });

  test('ln with -s option (symbolic link)', () => {
    const sourceFile = path.join(tempDir, 'source');
    const linkFile = path.join(tempDir, 'symlink');
    fs.writeFileSync(sourceFile, 'Test content');
    expect(fsm.isValid(`ln -s ${sourceFile} ${linkFile}`)).toBe(true);
    execSync(`ln -s ${sourceFile} ${linkFile}`);
    expect(fs.existsSync(linkFile)).toBe(true);
    expect(fs.readlinkSync(linkFile)).toBe(sourceFile);
    expect(fs.readFileSync(linkFile, 'utf8')).toBe('Test content');
  });

  test('ln with -f option', () => {
    const sourceFile = path.join(tempDir, 'source');
    const linkFile = path.join(tempDir, 'link');
    fs.writeFileSync(sourceFile, 'Source content');
    fs.writeFileSync(linkFile, 'Existing content');
    expect(fsm.isValid(`ln -f ${sourceFile} ${linkFile}`)).toBe(true);
    execSync(`ln -f ${sourceFile} ${linkFile}`);
    expect(fs.readFileSync(linkFile, 'utf8')).toBe('Source content');
  });

  test('ln with non-existent source', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent');
    const linkFile = path.join(tempDir, 'link');
    expect(fsm.isValid(`ln ${nonExistentFile} ${linkFile}`)).toBe(true);
    expect(() => execSync(`ln ${nonExistentFile} ${linkFile}`)).toThrow();
  });

  test('ln with invalid option', () => {
    const sourceFile = path.join(tempDir, 'source');
    const linkFile = path.join(tempDir, 'link');
    expect(fsm.isValid(`ln -z ${sourceFile} ${linkFile}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`ln -z ${sourceFile} ${linkFile}`)).toThrow();
  });
});