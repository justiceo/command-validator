import { UsermodFSM, usermodTestCases } from '../../src/builtins/usermod.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('UsermodFSM', () => {
  let fsm;
  let tempDir;
  const testUser = 'testuser_' + Math.floor(Math.random() * 10000);

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'usermod-test-'));
    if (process.getuid() === 0) {  // Only run if root
      execSync(`useradd -m -d ${path.join(tempDir, testUser)} ${testUser}`);
    }
  });

  afterAll(() => {
    if (process.getuid() === 0) {  // Only run if root
      execSync(`userdel -r ${testUser}`);
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new UsermodFSM();
  });

  usermodTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('usermod change login name', () => {
    const newName = `${testUser}_new`;
    const command = `usermod -l ${newName} ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`id ${newName}`).toString();
      expect(userInfo).toContain(newName);
      execSync(`usermod -l ${testUser} ${newName}`);  // Change back for other tests
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('usermod change home directory', () => {
    const newHome = path.join(tempDir, `${testUser}_newhome`);
    const command = `usermod -d ${newHome} -m ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`grep ${testUser} /etc/passwd`).toString();
      expect(userInfo).toContain(newHome);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('usermod change shell', () => {
    const newShell = '/bin/sh';
    const command = `usermod -s ${newShell} ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`grep ${testUser} /etc/passwd`).toString();
      expect(userInfo).toContain(newShell);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('usermod lock account', () => {
    const command = `usermod -L ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const shadowInfo = execSync(`grep ${testUser} /etc/shadow`).toString();
      expect(shadowInfo).toMatch(/^[^:]*:!/);
      execSync(`usermod -U ${testUser}`);  // Unlock for other tests
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});