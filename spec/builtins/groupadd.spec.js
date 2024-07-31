import { GroupaddFSM, groupaddTestCases } from '../../src/builtins/groupadd.js';
import { execSync } from 'child_process';

describe('GroupaddFSM', () => {
  let fsm;
  const testGroup = 'testgroup_' + Math.floor(Math.random() * 10000);

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
    fsm = new GroupaddFSM();
  });

  groupaddTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('groupadd basic execution', () => {
    const command = `groupadd ${testGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const groupInfo = execSync(`grep ${testGroup} /etc/group`).toString();
      expect(groupInfo).toContain(testGroup);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupadd with specific GID', () => {
    const gid = 2000;
    const specificGroup = `${testGroup}_gid`;
    const command = `groupadd -g ${gid} ${specificGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const groupInfo = execSync(`grep ${specificGroup} /etc/group`).toString();
      expect(groupInfo).toContain(`${specificGroup}:x:${gid}:`);
      execSync(`groupdel ${specificGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupadd system group', () => {
    const systemGroup = `${testGroup}_system`;
    const command = `groupadd -r ${systemGroup}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command);
      const groupInfo = execSync(`grep ${systemGroup} /etc/group`).toString();
      const gid = parseInt(groupInfo.split(':')[2]);
      expect(gid).toBeLessThan(1000);  // System GIDs are typically less than 1000
      execSync(`groupdel ${systemGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });

  test('groupadd with force option', () => {
    const forceGroup = `${testGroup}_force`;
    const command1 = `groupadd -f ${forceGroup}`;
    const command2 = `groupadd -f ${forceGroup}`;
    expect(fsm.isValid(command1)).toBe(true);
    expect(fsm.isValid(command2)).toBe(true);

    if (process.getuid() === 0) {  // Only run if root
      execSync(command1);
      execSync(command2);  // This should not throw an error due to -f
      const groupInfo = execSync(`grep ${forceGroup} /etc/group`).toString();
      expect(groupInfo).toContain(forceGroup);
      execSync(`groupdel ${forceGroup}`);
    } else {
      console.warn('Test skipped: requires root privileges');
    }
  });
});