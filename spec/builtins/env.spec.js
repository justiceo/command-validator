import { CommandValidator } from "../../src/cmd-validator.js";

describe("env command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Set an environment variable and execute a command", () => {
    expect(validator.validateCommand('env VAR=value command')).toBe(true);
  });

  test("Execute command with only specified environment variables", () => {
    expect(validator.validateCommand('env -i command')).toBe(true);
  });

  test("Remove an environment variable", () => {
    expect(validator.validateCommand('env -u VAR command')).toBe(true);
  });

  test("Specify an alternate path for utility", () => {
    expect(validator.validateCommand('env -P /custom/path command')).toBe(true);
  });

  test("Add environment variables from login class", () => {
    expect(validator.validateCommand('env -L user class command')).toBe(true);
  });

  test("Verbose output", () => {
    expect(validator.validateCommand('env -v command')).toBe(true);
  });

  test("Null-terminated output", () => {
    expect(validator.validateCommand('env -0')).toBe(true);
  });

  test("Split string into multiple arguments", () => {
    expect(validator.validateCommand('env -S "arg1 arg2" command')).toBe(true);
  });

  test("Invalid variable name handling", () => {
    expect(validator.validateCommand('env 123INVALID=value command')).toBe(false);
  });

  test("Multiple environment variables", () => {
    expect(validator.validateCommand('env VAR1=value1 VAR2=value2 command')).toBe(true);
  });

  test("User-specific environment variables", () => {
    expect(validator.validateCommand('env -U user command')).toBe(true);
  });
});
