import { ReniceFSM, reniceTestCases } from '../../src/builtins/renice.js';
import { execSync, spawn } from 'child_process';
import os from 'os';

describe('ReniceFSM', () => {
  let fsm;
  let testProcessPid;

  beforeAll(() => {
    // Start a test process
    const testProcess = spawn('sleep', ['3600']);
    testProcessPid = testProcess.pid;
  });

  afterAll(() => {
    // Kill the test process
    try {
      process.kill(testProcessPid);
    } catch (error) {
      // Process might have already exited
    }
  });

  beforeEach(() => {
    fsm = new ReniceFSM();
  });

  reniceTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('renice with real process ID', () => {
    expect(fsm.isValid(`renice -n 10 -p ${testProcessPid}`)).toBe(true);
  });

  test('renice with current user', () => {
    const currentUser = os.userInfo().username;
    expect(fsm.isValid(`renice -n 10 -u ${currentUser}`)).toBe(true);
  });

  test('renice with real user and group', () => {
    const { username, gid } = os.userInfo();
    const group = execSync(`getent group ${gid}`).toString().split(':')[0];

    expect(fsm.isValid(`renice -n 10 -u ${username} -g ${group}`)).toBe(true);
  });

  test('renice and verify priority change', () => {
    const originalPriority = parseInt(execSync(`ps -o nice -p ${testProcessPid} | tail -n 1`).toString().trim());
    const newPriority = originalPriority + 5;

    expect(fsm.isValid(`renice -n ${newPriority} -p ${testProcessPid}`)).toBe(true);
    execSync(`renice -n ${newPriority} -p ${testProcessPid}`);

    const changedPriority = parseInt(execSync(`ps -o nice -p ${testProcessPid} | tail -n 1`).toString().trim());
    expect(changedPriority).toBe(newPriority);
  });
});