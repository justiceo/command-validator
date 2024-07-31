import { GroupmodFSM, groupmodTestCases } from '../../src/builtins/groupmod.js';
import { execSync } from 'child_process';

describe('GroupmodFSM', () => {
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
    fsm = new GroupmodFSM();
  });

  groupmodTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('groupmod change group name', () => {
    const newName = `${testGroup}_new`;
    const command = `groupmod -n ${newName} ${testGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const groupInfo = execSync(`grep ${newName} /etc/group`).toString();
      expect(groupInfo).toContain(newName);
      execSync(`groupmod -n ${testGroup} ${newName}`);  // Change back for other tests
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupmod change GID', () => {
    const newGid = 2000;
    const command = `groupmod -g ${newGid} ${testGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const groupInfo = execSync(`grep ${testGroup} /etc/group`).toString();
      expect(groupInfo).toContain(`${testGroup}:x:${newGid}:`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupmod with non-unique GID', () => {
    const nonUniqueGroup = `${testGroup}_nonunique`;
    const existingGid = execSync(`grep ${testGroup} /etc/group`).toString().split(':')[2];
    
    if (process.getuid() === 0) {  // Only run if root
      execSync(`groupadd ${nonUniqueGroup}`);
      
      const command = `groupmod -o -g ${existingGid} ${nonUniqueGroup}`;
      expect(fsm.isValid(command)).toBe(true);
      
      execSync(command);
      const groupInfo = execSync(`grep ${nonUniqueGroup} /etc/group`).toString();
      expect(groupInfo).toContain(`${nonUniqueGroup}:x:${existingGid}:`);
      
      execSync(`groupdel ${nonUniqueGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});