import { GroupsFSM, groupsTestCases } from '../../src/builtins/groups.js';
import { execSync } from 'child_process';
import os from 'os';

describe('GroupsFSM', () => {
  let fsm;
  const currentUser = os.userInfo().username;

  beforeEach(() => {
    fsm = new GroupsFSM();
  });

  groupsTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('groups for current user', () => {
    const command = 'groups';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output.split(' ').length).toBeGreaterThanOrEqual(1);
  });

  test('groups for specific user', () => {
    const command = `groups ${currentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output.startsWith(`${currentUser} : `)).toBe(true);
    expect(output.split(' : ')[1].split(' ').length).toBeGreaterThanOrEqual(1);
  });

  test('groups for root user', () => {
    const command = 'groups root';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output.startsWith('root : ')).toBe(true);
    expect(output.split(' : ')[1].split(' ')).toContain('root');
  });

  test('groups for non-existent user', () => {
    const nonExistentUser = 'nonexistentuser_' + Math.floor(Math.random() * 10000);
    const command = `groups ${nonExistentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    expect(() => execSync(command)).toThrow();
  });

  test('groups with multiple users', () => {
    const command = `groups ${currentUser} root`;
    expect(fsm.isValid(command)).toBe(false);  // groups command only accepts one user argument
  });
});