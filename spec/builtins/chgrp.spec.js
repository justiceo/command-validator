import { ChgrpFSM } from '../../src/builtins/chgrp.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('ChgrpFSM', () => {
  let fsm;
  let tempDir;
  let testFile;
  let testGroup;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chgrp-test-'));
    testFile = path.join(tempDir, 'test.txt');
    fs.writeFileSync(testFile, 'Test content');
    testGroup = execSync('id -gn').toString().trim();
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new ChgrpFSM();
  });

  test('Basic chgrp', () => {
    expect(fsm.isValid(`chgrp ${testGroup} ${testFile}`)).toBe(true);
  });

  test('chgrp with recursive option', () => {
    expect(fsm.isValid(`chgrp -R ${testGroup} ${tempDir}`)).toBe(true);
  });

  test('chgrp with reference option', () => {
    const refFile = path.join(tempDir, 'ref.txt');
    fs.writeFileSync(refFile, 'Reference file');
    expect(fsm.isValid(`chgrp --reference=${refFile} ${testFile}`)).toBe(true);
  });

  test('chgrp with non-existent file', () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.txt');
    expect(fsm.isValid(`chgrp ${testGroup} ${nonExistentFile}`)).toBe(true);
  });

  test('chgrp with non-existent group', () => {
    expect(fsm.isValid(`chgrp nonexistentgroup ${testFile}`)).toBe(true);
  });

  test('chgrp with invalid option', () => {
    expect(fsm.isValid(`chgrp -z ${testGroup} ${testFile}`)).toBe(true); // The FSM allows invalid options
  });

  test('chgrp execution (requires root)', () => {
    if (process.getuid() === 0) {
      execSync(`chgrp ${testGroup} ${testFile}`);
      const fileGroup = execSync(`stat -c %G ${testFile}`).toString().trim();
      expect(fileGroup).toBe(testGroup);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});