import { CommandValidator } from "../../src/cmd-validator.js";

describe("find command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic find command with path", () => {
    expect(validator.validateCommand('find /home/user')).toBe(true);
  });

  test("Find files by name", () => {
    expect(validator.validateCommand('find /home/user -name "*.txt"')).toBe(true);
  });

  test("Find directories by name", () => {
    expect(validator.validateCommand('find . -type d -name "backup"')).toBe(true);
  });

   test("Invalid: find with invalid predicate", () => {
    expect(validator.validateCommand('find --name "*.txt"')).toBe(false);
  });

   test("Invalid: incorrect argument for 'type' option", () => {
    expect(validator.validateCommand('find . -type -d name dir')).toBe(false);
  });

   test("Invalid: find with extended regex", () => {
    expect(validator.validateCommand('find -E -dir -regex ".*\\.txt')).toBe(false);
  });

   test("Invalid: declaring symbolic link before option", () => {
    expect(validator.validateCommand('find symlink -L')).toBe(false);
  });

   test("Invalid: find with option and wrong argument combination", () => {
    expect(validator.validateCommand('find -d file.txt')).toBe(false);
  });

  test("Use extended regex", () => {
    expect(validator.validateCommand('find /home/user -E -regex ".*\\.txt"')).toBe(true);
  });

  test("Follow symbolic links", () => {
    expect(validator.validateCommand('find -L /path/to/dir')).toBe(true);
  });

  test("Do not follow symbolic links", () => {
    expect(validator.validateCommand('find -P /path/to/dir')).toBe(true);
  });

   test("Invalid: find combined with incorrect logical operator declarator", () => {
    expect(validator.validateCommand('find . -type f -name "*.png" or -name "*.txt"')).toBe(false);
  });

  test("Use depth-first traversal", () => {
    expect(validator.validateCommand('find -d /home/user')).toBe(true);
  });

  test("Find empty files or directories", () => {
    expect(validator.validateCommand('find . -empty')).toBe(true);
  });

  test("Execute a command on found files", () => {
    expect(validator.validateCommand('find . -exec ls {} \\;')).toBe(true);
  });

   test("Invalid: missing execution escape sequence", () => {
    expect(validator.validateCommand('find  -name "*.txt" -exec ls {} ')).toBe(false);
  });

  test("Delete found files", () => {
    expect(validator.validateCommand('find . -name "*.tmp" -delete')).toBe(true);
  });

  test("Combine conditions with logical operators", () => {
    expect(validator.validateCommand('find . -type f -name "*.log" -or -name "*.txt"')).toBe(true);
  });

  test("Invalid command handling", () => {
    expect(validator.validateCommand('find /home/user --invalid-option')).toBe(false);
  });
  test("Invalid: find non existent file", () => {
    expect(validator.validateCommand('find /non/existent/file')).toBe(false);
  });

  test("Invalid: find with typo", () => {
    expect(validator.validateCommand('findd filename.txt')).toBe(false);
  });
});