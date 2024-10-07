import { CommandValidator } from "../../src/cmd-validator.js";

describe("wait command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic wait", () => {
    expect(validator.validateCommand("wait")).toBe(true);
  });

  test("wait with process ID", () => {
    expect(validator.validateCommand("wait 1234")).toBe(true);
  });

  test("wait with multiple process IDs", () => {
    expect(validator.validateCommand("wait 1234 5678")).toBe(true);
  });

  test("wait with WNOHANG option", () => {
    expect(validator.validateCommand("wait -n")).toBe(true);
  });

  test("wait with WUNTRACED option", () => {
    expect(validator.validateCommand("wait -u")).toBe(true);
  });

  test("Invalid: wait with invalid option", () => {
    expect(validator.validateCommand("wait --invalid-option")).toBe(false);
  });

  test("Invalid: wait with unmatched quotes", () => {
    expect(validator.validateCommand("wait 'unmatched")).toBe(false);
  });

  test("wait with space before process ID", () => {
    expect(validator.validateCommand(" wait 1234")).toBe(true);
  });

  test("wait with combination of process IDs and options", () => {
    expect(validator.validateCommand("wait -n 1234 5678")).toBe(true);
  });

  test("Invalid: wait with no arguments after command", () => {
    expect(validator.validateCommand("wait ")).toBe(false);
  });

  test("Invalid: wait in subshell", () => {
    expect(validator.validateCommand(" some_command & wait ")).toBe(false);
  });

  test("Invalid: wait with typo", () => {
    expect(validator.validateCommand("waiit PID")).toBe(false);
  });

  test("wait with a negative process ID", () => {
    expect(validator.validateCommand("wait -1234")).toBe(true);
  });
});