import { IdFSM, idTestCases } from '../../src/builtins/id.js';
import { execSync } from 'child_process';
import os from 'os';

describe('IdFSM', () => {
  let fsm;
  const currentUser = os.userInfo().username;

  beforeEach(() => {
    fsm = new IdFSM();
  });

  idTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('id for current user', () => {
    const command = 'id';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/uid=\d+/);
    expect(output).toMatch(/gid=\d+/);
    expect(output).toMatch(/groups=\d+/);
  });

  test('id for specific user', () => {
    const command = `id ${currentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/uid=\d+\(${currentUser}\)/);
    expect(output).toMatch(/gid=\d+/);
    expect(output).toMatch(/groups=\d+/);
  });

  test('id with -u option', () => {
    const command = 'id -u';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/^\d+$/);
  });

  test('id with -g option', () => {
    const command = 'id -g';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/^\d+$/);
  });

  test('id with -G option', () => {
    const command = 'id -G';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output.split(' ').every(gid => /^\d+$/.test(gid))).toBe(true);
  });

  test('id with -n option', () => {
    const command = 'id -un';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(currentUser);
  });

  test('id for non-existent user', () => {
    const nonExistentUser = 'nonexistentuser_' + Math.floor(Math.random() * 10000);
    const command = `id ${nonExistentUser}`;
    expect(fsm.isValid(command)).toBe(true);

    expect(() => execSync(command)).toThrow();
  });
});