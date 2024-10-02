import { CommandValidator } from "../../src/cmd-validator.js";

describe("export command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Set an environment variable", () => {
    expect(validator.validateCommand('export VAR=value')).toBe(true);
  });

  test("Print exported variables", () => {
    expect(validator.validateCommand('export -p')).toBe(true);
  });

   test("Invalid identifier", () => {
    expect(validator.validateCommand('export VARIABLE_NAME = VALUE')).toBe(false);
  });

   test("Invalid variable name with special character", () => {
    expect(validator.validateCommand('export VARIABLE-NAME=VALUE')).toBe(false);
  });

  test("Export a shell function", () => {
    expect(validator.validateCommand('function myFunc { echo "Hello"; } export -f myFunc')).toBe(true);
  });

  test("Unmark a variable for export", () => {
    expect(validator.validateCommand('export -n VAR')).toBe(true);
  });

  test("Set multiple environment variables", () => {
    expect(validator.validateCommand('export VAR1=value1 VAR2=value2')).toBe(true);
  });

  test("Invalid variable name handling", () => {
    expect(validator.validateCommand('export 123INVALID=value')).toBe(false);
  });

  test("Export without arguments", () => {
    expect(validator.validateCommand('export')).toBe(true);
  });

  test("Export with special characters", () => {
    expect(validator.validateCommand('export VAR_with_special_chars@=value')).toBe(true);
  });

  test("Export without value", () => {
    expect(validator.validateCommand('export VAR')).toBe(true);
  });
});
