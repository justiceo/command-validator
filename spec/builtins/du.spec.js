import { CommandValidator } from "../../src/cmd-validator.js";

describe("du command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display disk usage of current directory", () => {
    expect(validator.validateCommand('du')).toBe(true);
  });

  test("Show disk usage in human-readable format", () => {
    expect(validator.validateCommand('du -h')).toBe(true);
  });

  test("Summarize usage of a specific directory", () => {
    expect(validator.validateCommand('du -sh directory/')).toBe(true);
  });

  test("Show all files and directories", () => {
    expect(validator.validateCommand('du -a')).toBe(true);
  });

  test("Display sizes in bytes", () => {
    expect(validator.validateCommand('du -b')).toBe(true);
  });

  test("Count links (including hard links)", () => {
    expect(validator.validateCommand('du -l')).toBe(true);
  });

  test("Dereference symbolic links", () => {
    expect(validator.validateCommand('du -L directory/')).toBe(true);
  });

   test("Invalid file/directory", () => {
    expect(validator.validateCommand('du -L ' '')).toBe(false);
  });

   test("Non existent file/directory", () => {
    expect(validator.validateCommand('du /path/to/non/existent/file')).toBe(true);
  });

  test("Exclude specific patterns", () => {
    expect(validator.validateCommand('du --exclude="*.o"')).toBe(true);
  });

  test("Exclude from a file", () => {
    expect(validator.validateCommand('du -X exclude_patterns.txt')).toBe(true);
  });

  test("Show usage with max depth", () => {
    expect(validator.validateCommand('du --max-depth=2')).toBe(true);
  });

  test("Display total for all arguments", () => {
    expect(validator.validateCommand('du -c directory1/ directory2/')).toBe(true);
  });

  test("Show sizes in kilobytes", () => {
    expect(validator.validateCommand('du -k')).toBe(true);
  });

  test("Show sizes in megabytes", () => {
    expect(validator.validateCommand('du -m')).toBe(true);
  });

  test("Show only sizes of the specified directories, excluding subdirectories", () => {
    expect(validator.validateCommand('du -S directory/')).toBe(true);
  });

  test("Skip directories on different filesystems", () => {
    expect(validator.validateCommand('du -x')).toBe(true);
  });
});