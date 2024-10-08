import { CommandValidator } from "../../src/cmd-validator.js";

describe("cp command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic cp", () => {
    expect(validator.validateCommand("cp file1.txt file2.txt")).toBe(true);
    expect(validator.validateCommand("cp file1.txt dir")).toBe(true);
  });

  test("cp with option -a", () => {
    expect(validator.validateCommand("cp -a file1.txt /home/user/")).toBe(true);
  });

  test("cp with option -r", () => {
    expect(validator.validateCommand("cp -r dir1/ dir2/")).toBe(true);
  });

  test("cp with option -i", () => {
    expect(validator.validateCommand("cp -i file1.txt file2.txt")).toBe(true);
  });

  test("cp with option -f", () => {
    expect(validator.validateCommand("cp -f file1.txt file2.txt")).toBe(true);
  });

  test("cp with option -u", () => {
    expect(validator.validateCommand("cp -u file1.txt file2.txt")).toBe(true);
  });

  test("cp with multiple source files", () => {
    expect(validator.validateCommand("cp file1.txt file2.txt /home/user/documents/")).toBe(true);
  });

  test("cp with no source files", () => {
    expect(validator.validateCommand("cp /home/user/documents/")).toBe(false);
    expect(validator.validateCommand("cp ' ' /home/user/documents/")).toBe(false);
  });

  test("cp with symbolic link option", () => {
    expect(validator.validateCommand("cp -s file1.txt link_to_file")).toBe(true);
  });

  test("cp with backup option", () => {
    expect(validator.validateCommand("cp -b file1.txt file2.txt")).toBe(true);
  });

  test("cp with verbose option", () => {
    expect(validator.validateCommand("cp -v file1.txt file2.txt")).toBe(true);
  });

  test("cp with destination directory", () => {
    expect(validator.validateCommand("cp file1.txt /home/user/documents/")).toBe(true);
  });

  test("cp with input file wildcard", () => {
    expect(validator.validateCommand("cp *.txt /home/user/documents/")).toBe(true);
  });

  test("Invalid: cp with unmatched quote", () => {
    expect(validator.validateCommand("cp 'file1.txt")).toBe(false);
  });

  test("cp with space before option", () => {
    expect(validator.validateCommand(" cp -i file1.txt file2.txt")).toBe(true);
    expect(validator.validateCommand("cp   -i file1.txt file2.txt")).toBe(true);
  });

  test("cp with invalid option", () => {
    expect(validator.validateCommand("cp --invalid-option file1.txt file2.txt")).toBe(false);
    expect(validator.validateCommand("cp -invalid-option file1.txt file2.txt")).toBe(false);
  });

  test("cp with no source files", () => {
    expect(validator.validateCommand("cp")).toBe(false);
  });

  test("cp with parent directories option", () => {
    expect(validator.validateCommand("cp -P file1.txt /home/user/documents/")).toBe(true);
  });

  test("cp with mixed options", () => {
    expect(validator.validateCommand("cp -r -u file1.txt dir1/")).toBe(true);
  });

  test("cp with specific suffix for backup", () => {
    expect(validator.validateCommand("cp -b -S '~' file1.txt file2.txt")).toBe(true);
  });

  test("Invalid: cp without source and destination", () => {
    expect(validator.validateCommand("cp")).toBe(false);
  });

  test("Invalid: cp without destination", () => {
    expect(validator.validateCommand("cp file1.txt")).toBe(false);
  });

  test("Invalid: cp with multiple source files and invalid destination", () => {
    expect(validator.validateCommand("cp file1.txt file2.txt file3.txt")).toBe(false);
  });

  test("Invalid: cp with multiple non-existent source files and destination", () => {
    expect(validator.validateCommand("cp non_existent_file1.txt non_existent_file2.txt dir1")).toBe(false);
  });

  test("INvalid: cp overwriting a file with itself", () => {
    expect(validator.validateCommand("cp file1.txt file1.txt")).toBe(false);
  });

  test("Invalid: cp overwriting non-directory with directory ", () => {
    expect(validator.validateCommand("cp dir1 file1.txt")).toBe(false);
  });

  test("Invalid: cp with unauthorized file", () => {
    expect(validator.validateCommand("cp protected_file.txt /home/user/documents/newfile.txt")).toBe(false);
  });
});
