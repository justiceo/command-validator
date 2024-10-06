import { CommandValidator } from "../../src/cmd-validator.js";

describe("kill command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic kill", () => {
    expect(validator.validateCommand("kill 1234")).toBe(true);
  });

  test("Invalid: kill without option or argument", () => {
    expect(validator.validateCommand("kill")).toBe(false);
  });

  test("Invalid: kill with negative pid", () => {
    expect(validator.validateCommand("kill  -1234")).toBe(false);
  });

  test("kill with signal number", () => {
    expect(validator.validateCommand("kill -9 1234")).toBe(true);
  });

  test("kill with signal name", () => {
    expect(validator.validateCommand("kill -TERM 1234")).toBe(true);
  });

  test("kill with symbolic signal name", () => {
    expect(validator.validateCommand("kill -s HUP 1234")).toBe(true);
  });

  test("kill with list option", () => {
    expect(validator.validateCommand("kill -l")).toBe(true);
  });

  test("kill with exit status", () => {
    expect(validator.validateCommand("kill -l 1")).toBe(true);
  });

  test("Invalid: kill with unmatched quote", () => {
    expect(validator.validateCommand("kill '1234")).toBe(false);
  });

  test("Invalid: kill with space before option", () => {
    expect(validator.validateCommand(" kill 1234")).toBe(true);
  });

  test("kill with invalid signal name", () => {
    expect(validator.validateCommand("kill -invalid_signal 1234")).toBe(false);
  });

  test("kill with multiple pids", () => {
    expect(validator.validateCommand("kill 1234 5678")).toBe(true);
  });

  test("kill with multiple signals", () => {
    expect(validator.validateCommand("kill -9 -HUP 1234")).toBe(true);
  });

  test("kill with non-numeric pid", () => {
    expect(validator.validateCommand("kill abc")).toBe(false);
  });
});