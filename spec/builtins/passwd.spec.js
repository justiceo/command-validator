import { PasswdFSM, passwdTestCases } from '../../src/builtins/passwd.js';
import { execSync } from 'child_process';
import os from 'os';

describe('PasswdFSM', () => {
  let fsm;
  let currentUser;

  beforeAll(() => {
    currentUser = os.userInfo().username;
  });

  beforeEach(() => {
    fsm = new PasswdFSM();
  });

  passwdTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('passwd with current user', () => {
    expect(fsm.isValid(`passwd ${currentUser}`)).toBe(true);
  });

  test('passwd with non-existent user', () => {
    const nonExistentUser = 'nonexistentuser12345';
    expect(fsm.isValid(`passwd ${nonExistentUser}`)).toBe(true);
  });

  test('passwd with real system users', () => {
    const systemUsers = execSync("cut -d: -f1 /etc/passwd").toString().split('\n');
    systemUsers.slice(0, 5).forEach(user => {
      expect(fsm.isValid(`passwd ${user}`)).toBe(true);
    });
  });
});