import { CommandValidator } from "../../src/cmd-validator.js";

describe("vim command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic vim command", () => {
    expect(validator.validateCommand("vim filename")).toBe(true);
    expect(validator.validateCommand("vim")).toBe(true);
  });

  test("vim with line number option", () => {
    expect(validator.validateCommand("vim +10 filename")).toBe(true);
  });

  test("vim with search pattern option", () => {
    expect(validator.validateCommand("vim +/pattern filename")).toBe(true);
  });

  test("vim with command execution option", () => {
    expect(validator.validateCommand('vim -c "set si" filename')).toBe(true);
  });

  test("vim with binary mode", () => {
    expect(validator.validateCommand("vim -b filename")).toBe(true);
  });

  test("vim in diff mode", () => {
    expect(validator.validateCommand("vim -d file1 file2")).toBe(true);
  });

  test("vim in read-only mode", () => {
    expect(validator.validateCommand("vim -R filename")).toBe(true);
  });

  test("vim with version option", () => {
    expect(validator.validateCommand("vim --version")).toBe(true);
  });

  test("Invalid: vim with unmatched quotes", () => {
    expect(validator.validateCommand('vim "+set si')).toBe(false);
  });

  test("Invalid: vim with invalid option", () => {
    expect(validator.validateCommand("vim --invalid-option filename")).toBe(false);
  });

   test("Invalid: vim with typo", () => {
    expect(validator.validateCommand("vimm filename")).toBe(false);
  });

  test("vim with multiple options", () => {
    expect(validator.validateCommand("vim -b -d file1 file2")).toBe(true);
  });
});