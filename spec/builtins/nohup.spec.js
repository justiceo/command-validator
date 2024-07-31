import { NohupFSM, nohupTestCases } from '../../src/builtins/nohup.js';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('NohupFSM', () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nohup-test-'));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new NohupFSM();
  });

  nohupTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('nohup with real command execution', () => {
    const testFile = path.join(tempDir, 'test.txt');
    const command = `nohup sh -c "echo 'Hello, nohup' > ${testFile}" &`;
    
    expect(fsm.isValid(command)).toBe(true);
    
    const child = spawn('sh', ['-c', command], { detached: true, stdio: 'ignore' });
    child.unref();

    // Wait for the command to complete
    setTimeout(() => {
      expect(fs.existsSync(testFile)).toBe(true);
      expect(fs.readFileSync(testFile, 'utf-8').trim()).toBe('Hello, nohup');
    }, 1000);
  });

  test('nohup with output redirection', () => {
    const outputFile = path.join(tempDir, 'nohup.out');
    const command = `nohup echo 'Redirected output' > ${outputFile} &`;
    
    expect(fsm.isValid(command)).toBe(true);
    
    execSync(command);

    // Wait for the command to complete
    setTimeout(() => {
      expect(fs.existsSync(outputFile)).toBe(true);
      expect(fs.readFileSync(outputFile, 'utf-8').trim()).toBe('Redirected output');
    }, 1000);
  });
});