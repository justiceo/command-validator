import { CommandValidator } from "../../src/cmd-validator.js";

describe("wc command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic wc with file", () => {
    expect(validator.validateCommand("wc file.txt")).toBe(true);
  });

  test("wc with lines option", () => {
    expect(validator.validateCommand("wc -l file.txt")).toBe(true);
  });

  test("wc with words option", () => {
    expect(validator.validateCommand("wc -w file.txt")).toBe(true);
  });

  test("wc with bytes option", () => {
    expect(validator.validateCommand("wc -c file.txt")).toBe(true);
  });

  test("wc with character counts option", () => {
    expect(validator.validateCommand("wc -m file.txt")).toBe(true);
  });

  test("wc with max line length option", () => {
    expect(validator.validateCommand("wc -L file.txt")).toBe(true);
  });

  test("wc with multiple options", () => {
    expect(validator.validateCommand("wc -l -w file.txt")).toBe(true);
  });

  test("wc with multiple files", () => {
    expect(validator.validateCommand("wc file1.txt file2.txt")).toBe(true);
  });

  test("wc with files0-from option", () => {
    expect(validator.validateCommand("wc --files0-from=file.txt")).toBe(true);
  });

  test("Invalid: wc with unmatched quotes", () => {
    expect(validator.validateCommand("wc 'file.txt")).toBe(false);
  });

  test("Invalid: wc with invalid option", () => {
    expect(validator.validateCommand("wc --invalid-option")).toBe(false);
  });

  test("wc with total counts option", () => {
    expect(validator.validateCommand("wc --total=auto file.txt")).toBe(true);
  });

  test("wc with help option", () => {
    expect(validator.validateCommand("wc --help")).toBe(true);
  });

  test("wc with version option", () => {
    expect(validator.validateCommand("wc --version")).toBe(true);
  });
});
