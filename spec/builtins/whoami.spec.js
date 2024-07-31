import { WhoamiFSM, whoamiTestCases } from '../../src/builtins/whoami.js';
import { execSync } from 'child_process';
import os from 'os';

describe('WhoamiFSM', () => {
  let fsm;
  const currentUser = os.userInfo().username;

  beforeEach(() => {
    fsm = new WhoamiFSM();
  });

  whoamiTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('whoami basic execution', () => {
    const command = 'whoami';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(currentUser);
  });

  test('whoami with leading/trailing spaces', () => {
    const command = '  whoami  ';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(currentUser);
  });

  test('whoami with invalid option', () => {
    const command = 'whoami -invalid';
    expect(fsm.isValid(command)).toBe(false);

    expect(() => execSync(command)).toThrow();
  });

  test('whoami with argument', () => {
    const command = 'whoami argument';
    expect(fsm.isValid(command)).toBe(false);

    expect(() => execSync(command)).toThrow();
  });
});