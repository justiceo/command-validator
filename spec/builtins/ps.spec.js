import { PsFSM, psTestCases } from '../../src/builtins/ps.js';
import { execSync, spawn } from 'child_process';
import os from 'os';

describe('PsFSM', () => {
  let fsm;
  let testProcess;

  beforeEach(() => {
    fsm = new PsFSM();
    testProcess = spawn('sleep', ['3600']);
  });

  afterEach(() => {
    if (testProcess) {
      testProcess.kill();
    }
  });

  psTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('ps basic execution', () => {
    const command = 'ps';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('PID');
  });

  test('ps with all processes', () => {
    const command = 'ps aux';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('USER');
    expect(output).toContain('PID');
    expect(output).toContain('%CPU');
    expect(output).toContain('%MEM');
  });

  test('ps with specific PID', () => {
    const command = `ps -p ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(`${testProcess.pid}`);
    expect(output).toContain('sleep');
  });

  test('ps with custom format', () => {
    const command = 'ps -o pid,user,%cpu,command';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('PID');
    expect(output).toContain('USER');
    expect(output).toContain('%CPU');
    expect(output).toContain('COMMAND');
  });

  test('ps with sorting', () => {
    const command = 'ps aux --sort=-%cpu';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    const lines = output.trim().split('\n');
    const cpuValues = lines.slice(1).map(line => parseFloat(line.split(/\s+/)[2]));
    expect(cpuValues).toEqual([...cpuValues].sort((a, b) => b - a));
  });

  test('ps with specific user', () => {
    const currentUser = os.userInfo().username;
    const command = `ps -u ${currentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(currentUser);
  });
});