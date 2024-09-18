import { CommandValidator } from "../../src/cmd-validator.js";

describe("touch command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic touch command with a file", () => {
    expect(validator.validateCommand("touch file.txt")).toBe(true);
  });

  test("touch command with specific timestamp", () => {
    expect(validator.validateCommand("touch -t 202408091230.00 file.txt")).toBe(true);
  });

  test("touch command with access time only", () => {
    expect(validator.validateCommand("touch -a file.txt")).toBe(true);
  });

  test("touch command with no create option", () => {
    expect(validator.validateCommand("touch -c file.txt")).toBe(true);
  });

  test("touch command with reference file", () => {
    expect(validator.validateCommand("touch -r reference.txt file.txt")).toBe(true);
  });

  test("Invalid: touch command with multiple files", () => {
    expect(validator.validateCommand("touch file1.txt file2.txt")).toBe(true);
  });

  test("Invalid: touch command with invalid option", () => {
    expect(validator.validateCommand("touch --invalid-option file.txt")).toBe(false);
  });

  test("Invalid: touch command with space before command", () => {
    expect(validator.validateCommand(" touch file.txt")).toBe(false);
  });

  test("Invalid: touch command with missing file argument", () => {
    expect(validator.validateCommand("touch")).toBe(false);
  });
});
