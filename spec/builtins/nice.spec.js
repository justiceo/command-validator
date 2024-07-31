import { NiceFSM, niceTestCases } from '../../src/builtins/nice.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('NiceFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nice-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new NiceFSM();
  });

  niceTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('nice with real command execution', () => {
    const testFile = path.join(tempDir, 'nice-test.txt');
    const command = `nice -n 10 sh -c "echo 'Hello, nice' > ${testFile}"`;
    
    expect(fsm.isValid(command)).toBe(true);
    
    execSync(command);

    expect(fs.existsSync(testFile)).toBe(true);
    expect(fs.readFileSync(testFile, 'utf-8').trim()).toBe('Hello, nice');
  });

  test('nice and verify priority', () => {
    const command = 'nice -n 15 sleep 60';
    expect(fsm.isValid(command)).toBe(true);

    const child = spawn('nice', ['-n', '15', 'sleep', '60']);
    
    setTimeout(() => {
      const priority = parseInt(execSync(`ps -o nice -p ${child.pid} | tail -n 1`).toString().trim());
      expect(priority).toBe(15);
      child.kill();
    }, 1000);
  });

  test('nice with different priority levels', () => {
    [-20, -10, 0, 10, 19].forEach(priority => {
      const command = `nice -n ${priority} echo "Priority ${priority}"`;
      expect(fsm.isValid(command)).toBe(true);
    });
  });

  test('nice with real system commands', () => {
    const commands = ['ls', 'cat', 'echo', 'grep', 'ps'];
    commands.forEach(cmd => {
      expect(fsm.isValid(`nice ${cmd}`)).toBe(true);
    });
  });
});