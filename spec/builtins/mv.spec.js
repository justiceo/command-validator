import { MvFSM } from '../../src/builtins/mv.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('MvFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new MvFSM();
  });

  test('Basic mv', () => {
    const sourceFile = path.join(tempDir, 'source');
    const destFile = path.join(tempDir, 'dest');
    fs.writeFileSync(sourceFile, 'Test content');
    expect(fsm.isValid(`mv ${sourceFile} ${destFile}`)).toBe(true);
    execSync(`mv ${sourceFile} ${destFile}`);
    expect(fs.existsSync(sourceFile)).toBe(false);
    expect(fs.existsSync(destFile)).toBe(true);
    expect(fs.readFileSync(destFile, 'utf8')).toBe('Test content');
  });

  test('mv with multiple sources', () => {
    const sourceDir = path.join(tempDir, 'sourcedir');
    fs.mkdirSync(sourceDir);
    const file1 = path.join(sourceDir, 'file1');
    const file2 = path.join(sourceDir, 'file2');
    fs.writeFileSync(file1, 'Content 1');
    fs.writeFileSync(file2, 'Content 2');
    const destDir = path.join(tempDir, 'destdir');
    fs.mkdirSync(destDir);
    expect(fsm.isValid(`mv ${file1} ${file2} ${destDir}`)).toBe(true);
    execSync(`mv ${file1} ${file2} ${destDir}`);
    expect(fs.existsSync(file1)).toBe(false);
    expect(fs.existsSync(file2)).toBe(false);
    expect(fs.existsSync(path.join(destDir, 'file1'))).toBe(true);
    expect(fs.existsSync(path.join(destDir, 'file2'))).toBe(true);
  });

  test('mv with -f option', () => {
    const sourceFile = path.join(tempDir, 'source');
    const destFile = path.join(tempDir, 'dest');
    fs.writeFileSync(sourceFile, 'Source content');
    fs.writeFileSync(destFile, 'Dest content');
    expect(fsm.isValid(`mv -f ${sourceFile} ${destFile}`)).toBe(true);
    execSync(`mv -f ${sourceFile} ${destFile}`);
    expect(fs.existsSync(sourceFile)).toBe(false);
    expect(fs.readFileSync(destFile, 'utf8')).toBe('Source content');
  });

  test('mv with non-existent source', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent');
    const destFile = path.join(tempDir, 'dest');
    expect(fsm.isValid(`mv ${nonExistentFile} ${destFile}`)).toBe(true);
    expect(() => execSync(`mv ${nonExistentFile} ${destFile}`)).toThrow();
  });

  test('mv with invalid option', () => {
    const sourceFile = path.join(tempDir, 'source');
    const destFile = path.join(tempDir, 'dest');
    expect(fsm.isValid(`mv -z ${sourceFile} ${destFile}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`mv -z ${sourceFile} ${destFile}`)).toThrow();
  });
});