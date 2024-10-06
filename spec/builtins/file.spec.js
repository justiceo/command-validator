import { CommandValidator } from "../../src/cmd-validator.js";

describe("file command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic file type detection", () => {
    expect(validator.validateCommand('file file1.txt')).toBe(true);
  });
  
  test("Invalid: file without argument", () => {
    expect(validator.validateCommand('file ')).toBe(false);
  });

  test("Invalid: file with wrong option", () => {
    expect(validator.validateCommand('file -5 file1.txt')).toBe(false);
     expect(validator.validateCommand('file --i file1.txt')).toBe(false);
  });

  test("Brief mode output", () => {
    expect(validator.validateCommand('file -b file1.txt')).toBe(true);
  });

  test("Invalid: Check extension of directory", () => {
    expect(validator.validateCommand('file --extension dir')).toBe(true);
  });

  test("MIME type output", () => {
    expect(validator.validateCommand('file -i file1.txt')).toBe(true);
  });

  test("Invalid: file with incorrect path to magic file", () => {
    expect(validator.validateCommand('file -m /incorrect/path/to/magic/file')).toBe(false);
  });

  test("Follow symbolic links", () => {
    expect(validator.validateCommand('file -L symlink.txt')).toBe(true);
  });

  test("Do not follow symbolic links", () => {
    expect(validator.validateCommand('file -h symlink.txt')).toBe(true);
  });

  test("Check for special files", () => {
    expect(validator.validateCommand('file -s /dev/sda')).toBe(true);
  });

  test("Check inside compressed files", () => {
    expect(validator.validateCommand('file -z compressed.zip')).toBe(true);
  });

  test("Use custom magic file", () => {
    expect(validator.validateCommand('file -m custom_magic_file file1.txt')).toBe(true);
  });

  test("Invalid: file with invalid magic file type", () => {
    expect(validator.validateCommand('file -m file1.png')).toBe(false);
  });

  test("Invalid: file with multiple option", () => {
    expect(validator.validateCommand('file -f -p file1.txt')).toBe(true);
  });

  test("Output null character after filename", () => {
    expect(validator.validateCommand('file -0 file1.txt')).toBe(true);
  });

  test("Preserve file access date", () => {
    expect(validator.validateCommand('file -p file1.txt')).toBe(true);
  });

  test("Version information", () => {
    expect(validator.validateCommand('file -v')).toBe(true);
  });

  test("Invalid command handling", () => {
    expect(validator.validateCommand('file --invalid-option')).toBe(false);
  });
});