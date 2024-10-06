import { CommandValidator } from "../../src/cmd-validator.js";

describe("w command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic w command", () => {
    expect(validator.validateCommand("w")).toBe(true);
  });

  test("w with user specified", () => {
    expect(validator.validateCommand("w username")).toBe(true);
  });

  test("w with header option", () => {
    expect(validator.validateCommand("w -h")).toBe(true);
  });

  test("w with user option", () => {
    expect(validator.validateCommand("w -u")).toBe(true);
  });

  test("w with short format option", () => {
    expect(validator.validateCommand("w -s")).toBe(true);
  });

  test("w with from option", () => {
    expect(validator.validateCommand("w -f")).toBe(true);
  });

  test("w with version option", () => {
    expect(validator.validateCommand("w -V")).toBe(true);
  });

  test("Invalid: w with invalid option", () => {
    expect(validator.validateCommand("w --invalid-option")).toBe(false);
  });

  test("Invalid: w with typo", () => {
    expect(validator.validateCommand("ww -f")).toBe(false);
  });

  test("Invalid: w with unmatched quotes", () => {
    expect(validator.validateCommand("w 'username")).toBe(false);
  });

  test("w with multiple options", () => {
    expect(validator.validateCommand("w -u -s")).toBe(true);
  });
});
