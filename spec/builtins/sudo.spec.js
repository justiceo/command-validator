import { CommandValidator } from "../../src/cmd-validator.js";

describe("sudo command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic sudo command", () => {
    expect(validator.validateCommand("sudo command")).toBe(true);
  });

  test("Run command as specific user", () => {
    expect(validator.validateCommand("sudo -u user command")).toBe(true);
  });

  test("Simulate initial login", () => {
    expect(validator.validateCommand("sudo -i command")).toBe(true);
  });

  test("Edit files with sudoedit", () => {
    expect(validator.validateCommand("sudoedit file.txt")).toBe(true);
  });

  test("List allowed commands", () => {
    expect(validator.validateCommand("sudo -l")).toBe(true);
  });

  test("Display version information", () => {
    expect(validator.validateCommand("sudo -V")).toBe(true);
  });

  test("Custom password prompt", () => {
    expect(validator.validateCommand("sudo -p 'Custom prompt' command")).toBe(true);
  });

  test("Background execution", () => {
    expect(validator.validateCommand("sudo -b command")).toBe(true);
  });

  test("Help command", () => {
    expect(validator.validateCommand("sudo -h")).toBe(true);
  });

  test("Kill user timestamp", () => {
    expect(validator.validateCommand("sudo -k")).toBe(true);
  });

  test("Invalid: sudo without command", () => {
    expect(validator.validateCommand("sudo")).toBe(false);
  });

  test("Invalid: sudo with unknown option", () => {
    expect(validator.validateCommand("sudo --unknown-option")).toBe(false);
  });

  test("Invalid: sudo with unmatched quotes", () => {
    expect(validator.validateCommand("sudo -p 'Custom prompt")).toBe(false);
  });

  test("Invalid: sudo with no user or command", () => {
    expect(validator.validateCommand("sudo -u")).toBe(false);
  });
});
