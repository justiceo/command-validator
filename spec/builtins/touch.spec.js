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

  test("touch command with space before command", () => {
    expect(validator.validateCommand(" touch file.txt")).toBe(true);
  });
  
  test("Invalid: touch command with typo", () => {
    expect(validator.validateCommand(" toucch file.txt")).toBe(false);
  });

  test("Invalid: touch command without permission", () => {
    expect(validator.validateCommand(" touch /directory")).toBe(false);
  });

  test("Invalid: touch command with non existent directory", () => {
    expect(validator.validateCommand(" touch path/to/non/existent/directory/file.txt")).toBe(false);
  });

  test("Invalid: touch without target file", () => {
    expect(validator.validateCommand(" touch --reference_file")).toBe(false);
  });

  test("Invalid: touch command with comma seperated arguments", () => {
    expect(validator.validateCommand(" touch file1.txt,file2.txt")).toBe(false);
  });

  test("Invalid: touch command with missing file argument", () => {
    expect(validator.validateCommand("touch")).toBe(false);
  });
});