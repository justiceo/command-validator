import { TopFSM, topTestCases } from '../../src/builtins/top.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('TopFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'top-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new TopFSM();
  });

  topTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('top basic execution', () => {
    const command = 'top -b -n 1';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('top -');
  });

  test('top with delay option', () => {
    const command = 'top -b -n 2 -d 2';
    expect(fsm.isValid(command)).toBe(true);

    const startTime = Date.now();
    execSync(command);
    const duration = Date.now() - startTime;
    expect(duration).toBeGreaterThanOrEqual(4000);
  });

  test('top with user filter', () => {
    const currentUser = os.userInfo().username;
    const command = `top -b -n 1 -u ${currentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(currentUser);
  });

  test('top with process filter', () => {
    const testProcess = spawn('sleep', ['3600']);
    const command = `top -b -n 1 -p ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(`${testProcess.pid}`);
    testProcess.kill();
  });

  test('top with sorting', () => {
    const command = 'top -b -n 1 -o %CPU';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('%CPU');
  });

  test('top output to file', () => {
    const outputFile = path.join(tempDir, 'top_output.txt');
    const command = `top -b -n 1 > ${outputFile}`;
    expect(fsm.isValid(command)).toBe(true);

    execSync(command);
    const output = fs.readFileSync(outputFile, 'utf-8');
    expect(output).toContain('top -');
  });
});