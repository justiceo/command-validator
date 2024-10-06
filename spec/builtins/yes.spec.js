import { CommandValidator } from "../../src/cmd-validator.js";

describe("yes command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic yes command without arguments", () => {
    expect(validator.validateCommand("yes")).toBe(true);
  });

  test("yes command with specific text", () => {
    expect(validator.validateCommand('yes "y"')).toBe(true);
  });

  test("yes command with single word text", () => {
    expect(validator.validateCommand("yes hello")).toBe(true);
  });

  test("Invalid: yes command with invalid option", () => {
    expect(validator.validateCommand("yes --invalid-option")).toBe(false);
  });

  test("yes command with space before command", () => {
    expect(validator.validateCommand(" yes")).toBe(true);
  });

  test("Invalid: yes command with typo", () => {
    expect(validator.validateCommand(" yess hello")).toBe(false);
  });

  test("Invalid: yes command with multiple strings", () => {
    expect(validator.validateCommand('yes "y" "n"')).toBe(false);
  });
});
