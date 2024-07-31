import { UserdelFSM, userdelTestCases } from '../../src/builtins/userdel.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('UserdelFSM', () => {
  let fsm;
  let tempDir;
  const testUser = 'testuser_' + Math.floor(Math.random() * 10000);

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'userdel-test-'));
    if (process.getuid() === 0) {  // Only run if root
      execSync(`useradd -m -d ${path.join(tempDir, testUser)} ${testUser}`);
    }
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new UserdelFSM();
  });

  userdelTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('userdel basic execution', () => {
    const command = `userdel ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      expect(() => execSync(`id ${testUser}`)).toThrow();
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('userdel with remove option', () => {
    const newUser = `${testUser}_remove`;
    const homeDir = path.join(tempDir, newUser);

    if (process.getuid() === 0) {  // Only run if root
      execSync(`useradd -m -d ${homeDir} ${newUser}`);
      
      const command = `userdel -r ${newUser}`;
      expect(fsm.isValid(command)).toBe(true);

      execSync(command);
      expect(() => execSync(`id ${newUser}`)).toThrow();
      expect(fs.existsSync(homeDir)).toBe(false);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('userdel with force option', () => {
    const newUser = `${testUser}_force`;

    if (process.getuid() === 0) {  // Only run if root
      execSync(`useradd ${newUser}`);
      
      const command = `userdel -f ${newUser}`;
      expect(fsm.isValid(command)).toBe(true);

      execSync(command);
      expect(() => execSync(`id ${newUser}`)).toThrow();
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('userdel non-existent user', () => {
    const command = `userdel nonexistentuser_${Math.floor(Math.random() * 10000)}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      expect(() => execSync(command)).toThrow();
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});