import { CommandValidator } from "../../src/cmd-validator.js";

describe("pwd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic pwd", () => {
    expect(validator.validateCommand("pwd")).toBe(true);
  });

  test("pwd with logical option", () => {
    expect(validator.validateCommand("pwd -L")).toBe(true);
  });

  test("pwd with physical option", () => {
    expect(validator.validateCommand("pwd -P")).toBe(true);
  });

  test("pwd with help option", () => {
    expect(validator.validateCommand("pwd --help")).toBe(true);
  });

  test("pwd with version option", () => {
    expect(validator.validateCommand("pwd --version")).toBe(true);
  });

  test("Invalid: pwd with invalid option", () => {
    expect(validator.validateCommand("pwd --invalid-option")).toBe(false);
  });

  test("Invalid: pwd with space before option", () => {
    expect(validator.validateCommand(" pwd -L")).toBe(false);
  });

  test("Invalid: pwd with unmatched quote", () => {
    expect(validator.validateCommand("pwd 'unmatched")).toBe(false);
  });

   test("Invalid: pwd with improper option combination", () => {
    expect(validator.validateCommand("pwd -L -P")).toBe(false);
  });

   test("Invalid: pwd with typo", () => {
    expect(validator.validateCommand("pwdd -L")).toBe(false);
  });

  test("pwd with combination of options", () => {
    expect(validator.validateCommand("pwd -L -P")).toBe(true);
  });

  test("pwd with no options", () => {
    expect(validator.validateCommand("pwd")).toBe(true);
  });
});