import { CommandValidator } from "../../src/cmd-validator.js";

describe("ln command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Create a hard link", () => {
    expect(validator.validateCommand("ln file1.txt link_to_file1.txt")).toBe(true);
  });

  test("Create a symbolic link", () => {
    expect(validator.validateCommand("ln -s file1.txt symbolic_link_to_file1.txt")).toBe(true);
  });

  test("Create links in a specified directory", () => {
    expect(validator.validateCommand("ln file1.txt -t /some/directory")).toBe(true);
  });

  test("Force link creation, overwriting existing files", () => {
    expect(validator.validateCommand("ln -f file1.txt link_to_file1.txt")).toBe(true);
  });

  test("Interactive mode, prompting before overwriting", () => {
    expect(validator.validateCommand("ln -i file1.txt link_to_file1.txt")).toBe(true);
  });

  test("Backup existing destination file", () => {
    expect(validator.validateCommand("ln --backup link_to_file1.txt")).toBe(true);
  });

  test("Invalid: Link to a non-existent file", () => {
    expect(validator.validateCommand("ln nonexistent.txt link_to_nonexistent.txt")).toBe(false);
  });

  test("Invalid: Attempt to hard link a directory without superuser", () => {
    expect(validator.validateCommand("ln dir1 dir2")).toBe(false);
  });

  test("Create hard link to a symbolic link reference", () => {
    expect(validator.validateCommand("ln -L symlink_to_file.txt link_to_symlink.txt")).toBe(true);
  });

  test("Invalid: Without argument", () => {
    expect(validator.validateCommand("ln")).toBe(false);
  });

  test("Invalid: Missing target file", () => {
    expect(validator.validateCommand("ln -s ")).toBe(false);
  });

  test("Verbose output while creating links", () => {
    expect(validator.validateCommand("ln -v file1.txt link_to_file1.txt")).toBe(true);
  });
});