import { HtopFSM, htopTestCases } from '../../src/builtins/htop.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('HtopFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'htop-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new HtopFSM();
  });

  htopTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('htop basic execution', () => {
    const command = 'htop';
    expect(fsm.isValid(command)).toBe(true);

    // We can't actually run htop in a test environment, so we'll just check if it's installed
    try {
      execSync('which htop');
    } catch (error) {
      console.warn('htop is not installed on this system. Skipping execution test.');
      return;
    }
  });

  test('htop with delay option', () => {
    const command = 'htop -d 10';
    expect(fsm.isValid(command)).toBe(true);
  });

  test('htop with user filter', () => {
    const currentUser = os.userInfo().username;
    const command = `htop -u ${currentUser}`;
    expect(fsm.isValid(command)).toBe(true);
  });

  test('htop with process filter', () => {
    const testProcess = spawn('sleep', ['3600']);
    const command = `htop -p ${testProcess.pid}`;
    expect(fsm.isValid(command)).toBe(true);
    testProcess.kill();
  });

  test('htop with tree view', () => {
    const command = 'htop -t';
    expect(fsm.isValid(command)).toBe(true);
  });

  test('htop with sorting', () => {
    const command = 'htop -s PERCENT_CPU';
    expect(fsm.isValid(command)).toBe(true);
  });
});