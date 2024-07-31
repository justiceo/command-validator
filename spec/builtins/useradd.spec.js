import { UseraddFSM, useraddTestCases } from '../../src/builtins/useradd.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('UseraddFSM', () => {
  let fsm;
  let tempDir;
  const testUser = 'testuser_' + Math.floor(Math.random() * 10000);

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'useradd-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    try {
      execSync(`userdel -r ${testUser}`);
    } catch (error) {
      // User might not exist, ignore error
    }
  });

  beforeEach(() => {
    fsm = new UseraddFSM();
  });

  useraddTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('useradd basic execution', () => {
    const command = `useradd ${testUser}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`id ${testUser}`).toString();
      expect(userInfo).toContain(testUser);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('useradd with home directory', () => {
    const homeDir = path.join(tempDir, testUser);
    const command = `useradd -m -d ${homeDir} ${testUser}_home`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      expect(fs.existsSync(homeDir)).toBe(true);
      execSync(`userdel -r ${testUser}_home`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('useradd with specific UID', () => {
    const uid = 2000;
    const command = `useradd -u ${uid} ${testUser}_uid`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`id ${testUser}_uid`).toString();
      expect(userInfo).toContain(`uid=${uid}`);
      execSync(`userdel ${testUser}_uid`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('useradd with system account', () => {
    const command = `useradd -r ${testUser}_system`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const userInfo = execSync(`id ${testUser}_system`).toString();
      expect(userInfo).toContain(testUser);
      execSync(`userdel ${testUser}_system`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});