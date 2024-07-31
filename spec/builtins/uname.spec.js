import { UnameFSM, unameTestCases } from '../../src/builtins/uname.js';
import { execSync } from 'child_process';

describe('UnameFSM', () => {
  let fsm;

  beforeEach(() => {
    fsm = new UnameFSM();
  });

  unameTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('uname basic execution', () => {
    const command = 'uname';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).not.toBe('');
  });

  test('uname with -a option', () => {
    const command = 'uname -a';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output.split(' ').length).toBeGreaterThan(1);
  });

  test('uname with -s option', () => {
    const command = 'uname -s';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(execSync('uname').toString().trim());
  });

  test('uname with -n option', () => {
    const command = 'uname -n';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(execSync('hostname').toString().trim());
  });

  test('uname with multiple options', () => {
    const command = 'uname -sm';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim().split(' ');
    expect(output.length).toBe(2);
  });

  test('uname with invalid option', () => {
    const command = 'uname -z';
    expect(fsm.isValid(command)).toBe(true);  // The FSM allows invalid options

    expect(() => execSync(command)).toThrow();
  });
});