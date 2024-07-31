import { ChownFSM } from '../../src/builtins/chown.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('ChownFSM', () => {
  let fsm;
  let tempDir;
  let testFile;
  let testUser;
  let testGroup;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chown-test-'));
    testFile = path.join(tempDir, 'test.txt');
    fs.writeFileSync(testFile, 'Test content');
    testUser = execSync('id -un').toString().trim();
    testGroup = execSync('id -gn').toString().trim();
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new ChownFSM();
  });

  test('Basic chown', () => {
    expect(fsm.isValid(`chown ${testUser} ${testFile}`)).toBe(true);
  });

  test('chown with user:group format', () => {
    expect(fsm.isValid(`chown ${testUser}:${testGroup} ${testFile}`)).toBe(true);
  });

  test('chown with recursive option', () => {
    expect(fsm.isValid(`chown -R ${testUser} ${tempDir}`)).toBe(true);
  });

  test('chown with reference option', () => {
    const refFile = path.join(tempDir, 'ref.txt');
    fs.writeFileSync(refFile, 'Reference file');
    expect(fsm.isValid(`chown --reference=${refFile} ${testFile}`)).toBe(true);
  });

  test('chown with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.txt');
    expect(fsm.isValid(`chown ${testUser} ${nonExistentFile}`)).toBe(true);
  });

  test('chown with non-existent user', () => {
    expect(fsm.isValid(`chown nonexistentuser ${testFile}`)).toBe(true);
  });

  test('chown with invalid option', () => {
    expect(fsm.isValid(`chown -z ${testUser} ${testFile}`)).toBe(true); // The FSM allows invalid options
  });

  test('chown execution (requires root)', () => {
    if (process.getuid() === 0) {
      execSync(`chown ${testUser}:${testGroup} ${testFile}`);
      const fileOwner = execSync(`stat -c %U:%G ${testFile}`).toString().trim();
      expect(fileOwner).toBe(`${testUser}:${testGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});