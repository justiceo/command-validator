import { CommandValidator } from "../../src/cmd-validator.js";

describe("comm command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic comm", () => {
    expect(validator.validateCommand("comm file1.txt file2.txt")).toBe(true);
  });

  test("comm with option -1", () => {
    expect(validator.validateCommand("comm -1 file1.txt file2.txt")).toBe(true);
  });

  test("comm with option -2", () => {
    expect(validator.validateCommand("comm -2 file1.txt file2.txt")).toBe(true);
  });

  test("comm with option -3", () => {
    expect(validator.validateCommand("comm -3 file1.txt file2.txt")).toBe(true);
  });

  test("comm with check order option", () => {
    expect(validator.validateCommand("comm --check-order file1.txt file2.txt")).toBe(true);
  });

  test("comm with no check order option", () => {
    expect(validator.validateCommand("comm --nocheck-order file1.txt file2.txt")).toBe(true);
  });

  test("comm with output delimiter", () => {
    expect(validator.validateCommand("comm --output-delimiter='|' file1.txt file2.txt")).toBe(true);
  });

  test("Invalid: comm with unmatched quote", () => {
    expect(validator.validateCommand("comm 'file1.txt")).toBe(false);
  });

  test("Invalid: comm with space before option", () => {
    expect(validator.validateCommand(" comm file1.txt file2.txt")).toBe(false);
  });

  test("comm with invalid option", () => {
    expect(validator.validateCommand("comm --invalid-option file1.txt file2.txt")).toBe(false);
  });

  test("comm with missing files", () => {
    expect(validator.validateCommand("comm")).toBe(false);
  });

  test("comm with multiple options", () => {
    expect(validator.validateCommand("comm -1 -2 file1.txt file2.txt")).toBe(true);
  });

  test("comm with quoted file names", () => {
    expect(validator.validateCommand("comm 'file 1.txt' 'file 2.txt'")).toBe(true);
  });
});
