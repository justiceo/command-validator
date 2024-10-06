import { CommandValidator } from "../../src/cmd-validator.js";

describe("sort command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic sort command", () => {
    expect(validator.validateCommand("sort file.txt")).toBe(true);
  });

  test("Sort in reverse order", () => {
    expect(validator.validateCommand("sort -r file.txt")).toBe(true);
  });

  test("Ignore leading blanks", () => {
    expect(validator.validateCommand("sort -b file.txt")).toBe(true);
  });

  test("Ignore case while sorting", () => {
    expect(validator.validateCommand("sort -f file.txt")).toBe(true);
  });

  test("Numeric sort", () => {
    expect(validator.validateCommand("sort -n file.txt")).toBe(true);
  });

  test("Check for sorted input", () => {
    expect(validator.validateCommand("sort -c file.txt")).toBe(true);
  });

  test("Output to a specific file", () => {
    expect(validator.validateCommand("sort -o sorted.txt file.txt")).toBe(true);
  });

  test("Human numeric sort", () => {
    expect(validator.validateCommand("sort -h file.txt")).toBe(true);
  });

  test("Month sort", () => {
    expect(validator.validateCommand("sort -M file.txt")).toBe(true);
  });

  test("Merge sorted files", () => {
    expect(validator.validateCommand("sort -m file1.txt file2.txt")).toBe(true);
  });

  test("Use a custom field separator", () => {
    expect(validator.validateCommand("sort -t, file.txt")).toBe(true);
  });
sor
  test("Invalid: sort with no file specified", () => {
    expect(validator.validateCommand("sort")).toBe(false);
  });

  test("Invalid: sort with no output specified", () => {
    expect(validator.validateCommand("sort -o file.txt")).toBe(false);
  });

  test("Invalid: sort with typo", () => {
    expect(validator.validateCommand("sorrt file.txt")).toBe(false);
  });

  test("Invalid: sort with unknown option", () => {
    expect(validator.validateCommand("sort --unknown-option")).toBe(false);
  });

  test("Invalid: sort with unmatched quotes", () => {
    expect(validator.validateCommand("sort 'file.txt")).toBe(false);
  });

  test("Invalid: sort with invalid numeric option", () => {
    expect(validator.validateCommand("sort -n --invalid-option")).toBe(false);
  });
});