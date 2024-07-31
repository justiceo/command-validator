import { SudoFSM, sudoTestCases } from '../../src/builtins/sudo.js';
import { execSync } from 'child_process';
import os from 'os';

describe('SudoFSM', () => {
  let fsm;
  let currentUser;

  beforeAll(() => {
    currentUser = os.userInfo().username;
  });

  beforeEach(() => {
    fsm = new SudoFSM();
  });

  sudoTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('sudo with current user', () => {
    expect(fsm.isValid(`sudo -u ${currentUser} whoami`)).toBe(true);
  });

  test('sudo with real system commands', () => {
    const commands = ['ls', 'cat', 'echo', 'grep', 'ps'];
    commands.forEach(cmd => {
      expect(fsm.isValid(`sudo ${cmd}`)).toBe(true);
    });
  });

  test('sudo with environment variables', () => {
    expect(fsm.isValid('sudo -E env')).toBe(true);
  });

  test('sudo with real system users', () => {
    const systemUsers = execSync("cut -d: -f1 /etc/passwd").toString().split('\n');
    systemUsers.slice(0, 5).forEach(user => {
      expect(fsm.isValid(`sudo -u ${user} whoami`)).toBe(true);
    });
  });

  test('sudo with real system groups', () => {
    const systemGroups = execSync("cut -d: -f1 /etc/group").toString().split('\n');
    systemGroups.slice(0, 5).forEach(group => {
      expect(fsm.isValid(`sudo -g ${group} id`)).toBe(true);
    });
  });
});