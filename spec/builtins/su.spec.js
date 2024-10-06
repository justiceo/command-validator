import { CommandValidator } from "../../src/cmd-validator.js";

describe("su command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic su command", () => {
    expect(validator.validateCommand("su")).toBe(true);
  });

  test("Switch to specific user", () => {
    expect(validator.validateCommand("su - user")).toBe(true);
  });

  test("Run a command as another user", () => {
    expect(validator.validateCommand("su -c 'command' user")).toBe(true);
  });

  test("Run a command as another user with double quotes", () => {
    expect(validator.validateCommand('su -c "command" user')).toBe(true);
  });

  test("Run a command with fast option", () => {
    expect(validator.validateCommand("su -f user")).toBe(true);
  });

  test("Run a login shell", () => {
    expect(validator.validateCommand("su -l user")).toBe(true);
  });

  test("Preserve environment variables", () => {
    expect(validator.validateCommand("su -m user")).toBe(true);
  });

  test("Specify a different shell", () => {
    expect(validator.validateCommand("su --shell=/bin/bash user")).toBe(true);
  });

  test("Help command", () => {
    expect(validator.validateCommand("su --help")).toBe(true);
  });

  test("Version command", () => {
    expect(validator.validateCommand("su --version")).toBe(true);
  });

  test("Invalid: su without user", () => {
    expect(validator.validateCommand("su -c 'command'")).toBe(false);
  });

  test("Invalid: su with unknown option", () => {
    expect(validator.validateCommand("su --unknown-option")).toBe(false);
  });

  test("Invalid: su with unmatched quotes", () => {
    expect(validator.validateCommand("su -c 'command")).toBe(false);
  });

  test("Invalid: su with typo", () => {
    expect(validator.validateCommand("suu -c 'command")).toBe(false);
  });

  test("Invalid: su with misplaced option", () => {
    expect(validator.validateCommand("su user -c")).toBe(false);
  });

  test("Invalid: su with restricted shell", () => {
    expect(validator.validateCommand("su -s /bin/false user")).toBe(false);
  });
});