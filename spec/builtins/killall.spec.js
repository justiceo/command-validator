import { KillallFSM, killallTestCases } from '../../src/builtins/killall.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('KillallFSM', () => {
  let fsm;
  let tempDir;
  let testProcesses = [];

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'killall-test-'));
  });

  afterAll(() => {
    testProcesses.forEach(process => {
      try {
        process.kill();
      } catch (error) {
        // Process might have already exited
      }
    });
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new KillallFSM();
  });

  killallTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('killall with real process', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = 'killall sleep';
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    setTimeout(() => {
      expect(testProcess.killed).toBe(true);
    }, 1000);
  });

  test('killall with signal', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = 'killall -9 sleep';
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    setTimeout(() => {
      expect(testProcess.killed).toBe(true);
    }, 1000);
  });

  test('killall with user filter', () => {
    const currentUser = os.userInfo().username;
    const command = `killall -u ${currentUser} sleep`;
    expect(fsm.isValid(command)).toBe(true);
  });

  test('killall with non-existent process', () => {
    const command = 'killall non_existent_process_12345';
    expect(fsm.isValid(command)).toBe(true);
    
    try {
      execSync(command);
    } catch (error) {
      expect(error.status).not.toBe(0);
    }
  });
});