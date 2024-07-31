import { KillFSM, killTestCases } from '../../src/builtins/kill.js';
import { execSync, spawn } from 'child_process';

describe('KillFSM', () => {
  let fsm;
  let testProcesses = [];

  afterEach(() => {
    testProcesses.forEach(process => {
      try {
        process.kill();
      } catch (error) {
        // Process might have already exited
      }
    });
    testProcesses = [];
  });

  beforeEach(() => {
    fsm = new KillFSM();
  });

  killTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('kill with real process', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = `kill ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    return new Promise((resolve) => {
      testProcess.on('exit', () => {
        expect(testProcess.killed).toBe(true);
        resolve();
      });
    });
  });

  test('kill with signal', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = `kill -9 ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    return new Promise((resolve) => {
      testProcess.on('exit', (code, signal) => {
        expect(signal).toBe('SIGKILL');
        resolve();
      });
    });
  });

  test('kill with signal name', () => {
    const testProcess = spawn('sleep', ['3600']);
    testProcesses.push(testProcess);

    const command = `kill -SIGTERM ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);

    return new Promise((resolve) => {
      testProcess.on('exit', (code, signal) => {
        expect(signal).toBe('SIGTERM');
        resolve();
      });
    });
  });

  test('kill with non-existent process', () => {
    const command = 'kill 999999';
    expect(fsm.isValid(command)).toBe(true);
    
    try {
      execSync(command);
    } catch (error) {
      expect(error.status).not.toBe(0);
    }
  });
});