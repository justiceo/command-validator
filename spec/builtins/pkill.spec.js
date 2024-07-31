import { PkillFSM, pkillTestCases } from '../../src/builtins/pkill.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('PkillFSM', () => {
  let fsm;
  let tempDir;
  let testProcesses = [];

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pkill-test-'));
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
    fsm = new PkillFSM();
  });

  pkillTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('pkill with real process', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = 'pkill sleep';
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    setTimeout(() => {
      expect(testProcess.killed).toBe(true);
    }, 1000);
  });

  test('pkill with signal', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = 'pkill -9 sleep';
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    setTimeout(() => {
      expect(testProcess.killed).toBe(true);
    }, 1000);
  });

  test('pkill with user filter', () => {
    const currentUser = os.userInfo().username;
    const command = `pkill -u ${currentUser} sleep`;
    expect(fsm.isValid(command)).toBe(true);
  });

  test('pkill with full command match', () => {
    const testScript = path.join(tempDir, 'test-script.sh');
    fs.writeFileSync(testScript, '#!/bin/bash\nwhile true; do sleep 1; done\n');
    fs.chmodSync(testScript, '755');

    const testProcess = spawn(testScript);
    testProcesses.push(testProcess);

    const command = `pkill -f "${testScript}"`;
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    setTimeout(() => {
      expect(testProcess.killed).toBe(true);
    }, 1000);
  });

  test('pkill with non-existent process', () => {
    const command = 'pkill non_existent_process_12345';
    expect(fsm.isValid(command)).toBe(true);
    
    try {
      execSync(command);
    } catch (error) {
      expect(error.status).not.toBe(0);
    }
  });
});