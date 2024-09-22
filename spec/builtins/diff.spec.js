import { CommandValidator } from "../../src/cmd-validator.js";

describe("diff command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic diff", () => {
    expect(validator.validateCommand("diff file1.txt file2.txt")).toBe(true);
  });

  test("diff with unified format", () => {
    expect(validator.validateCommand("diff -u file1.txt file2.txt")).toBe(true);
  });

  test("diff with recursive option", () => {
    expect(validator.validateCommand("diff -r dir1 dir2")).toBe(true);
  });

  test("diff with ignore space change", () => {
    expect(validator.validateCommand("diff -b file1.txt file2.txt")).toBe(true);
  });

  test("diff with ignore all space", () => {
    expect(validator.validateCommand("diff -w file1.txt file2.txt")).toBe(true);
  });

  test("diff with context option", () => {
    expect(validator.validateCommand("diff -c 5 file1.txt file2.txt")).toBe(true);
  });

  test("diff with side-by-side option", () => {
    expect(validator.validateCommand("diff -y file1.txt file2.txt")).toBe(true);
  });

  test("diff with suppress common lines", () => {
    expect(validator.validateCommand("diff --suppress-common-lines file1.txt file2.txt")).toBe(true);
  });

  test("Invalid: diff with unmatched quote", () => {
    expect(validator.validateCommand("diff 'file1.txt")).toBe(false);
  });

  test("Invalid: diff with space before option", () => {
    expect(validator.validateCommand(" diff file1.txt file2.txt")).toBe(false);
  });

  test("Invalid: diff with invalid option", () => {
    expect(validator.validateCommand("diff --invalid-option file1.txt file2.txt")).toBe(false);
  });

  test("diff with multiple files", () => {
    expect(validator.validateCommand("diff file1.txt file2.txt file3.txt")).toBe(true);
  });

  test("diff with file from standard input", () => {
    expect(validator.validateCommand("diff - file2.txt")).toBe(true);
  });

  test("diff with ignore case option", () => {
    expect(validator.validateCommand("diff -i file1.txt file2.txt")).toBe(true);
  });

  test("diff with starting file option", () => {
    expect(validator.validateCommand("diff -S file1.txt dir1")).toBe(true);
  });

  test("Invalid: diff with non-existent file", () => {
    expect(validator.validateCommand("diff nonexistent.txt file2.txt")).toBe(false);
  });

  test("diff with label option", () => {
    expect(validator.validateCommand("diff --label label1 --label label2 file1.txt file2.txt")).toBe(true);
  });

  test("diff with pagination option", () => {
    expect(validator.validateCommand("diff -l file1.txt file2.txt")).toBe(true);
  });
});
