import { SuFSM, suTestCases } from '../../src/builtins/su.js';
import { execSync } from 'child_process';
import os from 'os';

describe('SuFSM', () => {
  let fsm;
  let currentUser;

  beforeAll(() => {
    currentUser = os.userInfo().username;
  });

  beforeEach(() => {
    fsm = new SuFSM();
  });

  suTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('su to current user', () => {
    expect(fsm.isValid(`su ${currentUser}`)).toBe(true);
  });

  test('su with real system users', () => {
    const systemUsers = execSync("cut -d: -f1 /etc/passwd").toString().split('\n');
    systemUsers.slice(0, 5).forEach(user => {
      expect(fsm.isValid(`su ${user}`)).toBe(true);
    });
  });

  test('su with command execution', () => {
    expect(fsm.isValid(`su -c 'echo "Hello, World!"'`)).toBe(true);
  });

  test('su with environment preservation', () => {
    expect(fsm.isValid(`su -p -c 'echo $HOME'`)).toBe(true);
  });
});