import { GroupdelFSM, groupdelTestCases } from '../../src/builtins/groupdel.js';
import { execSync } from 'child_process';

describe('GroupdelFSM', () => {
  let fsm;
  const testGroup = 'testgroup_' + Math.floor(Math.random() * 10000);

  beforeAll(() => {
    if (process.getuid() === 0) {  // Only run if root
      execSync(`groupadd ${testGroup}`);
    }
  });

  afterAll(() => {
    if (process.getuid() === 0) {  // Only run if root
      try {
        execSync(`groupdel ${testGroup}`);
      } catch (error) {
        // Group might not exist, ignore error
      }
    }
  });

  beforeEach(() => {
    fsm = new GroupdelFSM();
  });

  groupdelTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('groupdel basic execution', () => {
    const command = `groupdel ${testGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      expect(() => execSync(`grep ${testGroup} /etc/group`)).toThrow();
      execSync(`groupadd ${testGroup}`);  // Recreate for other tests
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupdel non-existent group', () => {
    const nonExistentGroup = `nonexistent_${Math.floor(Math.random() * 10000)}`;
    const command = `groupdel ${nonExistentGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      expect(() => execSync(command)).toThrow();
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupdel primary group of existing user', () => {
    const primaryGroup = `primary_${Math.floor(Math.random() * 10000)}`;
    const testUser = `testuser_${Math.floor(Math.random() * 10000)}`;
    
    if (process.getuid() === 0) {  // Only run if root
      execSync(`groupadd ${primaryGroup}`);
      execSync(`useradd -g ${primaryGroup} ${testUser}`);
      
      const command = `groupdel ${primaryGroup}`;
      expect(fsm.isValid(command)).toBe(true);
      
      expect(() => execSync(command)).toThrow();
      
      execSync(`userdel -r ${testUser}`);
      execSync(`groupdel ${primaryGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});