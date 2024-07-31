import { TypeFSM, typeTestCases } from '../../src/builtins/type.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('TypeFSM', () => {
  let fsm;
  let tempDir;
  let tempScript;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-test-'));
    tempScript = path.join(tempDir, 'test-script.sh');
    fs.writeFileSync(tempScript, '#!/bin/bash\necho "Hello, World!"', { mode: 0o755 });
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new TypeFSM();
  });

  typeTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test('type with built-in command', () => {
    const command = 'type cd';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('cd is a shell builtin');
  });

  test('type with external command', () => {
    const command = 'type ls';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toMatch(/ls is .*\/ls/);
  });

  test('type with alias', () => {
    execSync('alias test_alias="echo test"');
    const command = 'type test_alias';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('test_alias is aliased to `echo test\'');
    execSync('unalias test_alias');
  });

  test('type with custom script', () => {
    const command = `type ${tempScript}`;
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain(tempScript);
  });

  test('type with -t option', () => {
    const command = 'type -t cd';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe('builtin');
  });

  test('type with -a option', () => {
    const command = 'type -a echo';
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString();
    expect(output).toContain('echo is a shell builtin');
    expect(output).toMatch(/echo is .*\/echo/);
  });
});