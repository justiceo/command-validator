import { CommandValidator } from "../../src/cmd-validator.js";

describe("cd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic cd", () => {
    expect(validator.validateCommand("cd")).toBe(true);
  });

  test("cd with directory", () => {
    expect(validator.validateCommand("cd /home/user")).toBe(true);
  });

  test("cd with relative path", () => {
    expect(validator.validateCommand("cd ../..")).toBe(true);
  });

  test("cd with symbolic link", () => {
    expect(validator.validateCommand("cd /path/to/symlink")).toBe(true);
  });

  test("cd with option -L", () => {
    expect(validator.validateCommand("cd -L /home/user")).toBe(true);
  });

  test("cd with option -P", () => {
    expect(validator.validateCommand("cd -P /home/user")).toBe(true);
  });

  test("Invalid: cd with unmatched quote", () => {
    expect(validator.validateCommand("cd 'unmatched")).toBe(false);
  });

  test("Invalid: cd with space before option", () => {
    expect(validator.validateCommand(" cd -L")).toBe(false);
  });

  test("cd with invalid directory", () => {
    expect(validator.validateCommand("cd /non/existent/directory")).toBe(false);
  });

  test("cd with quoted path", () => {
    expect(validator.validateCommand("cd 'My Documents'")).toBe(true);
  });

  test("cd with double quoted path", () => {
    expect(validator.validateCommand('cd "My Documents"')).toBe(true);
  });

  test("cd with escaped space in path", () => {
    expect(validator.validateCommand("cd My\\ Documents")).toBe(true);
  });

  test("cd with environment variable", () => {
    expect(validator.validateCommand("cd $HOME")).toBe(true);
  });

  test("cd with tilde expansion", () => {
    expect(validator.validateCommand("cd ~/Documents")).toBe(true);
  });

  test("cd with multiple options", () => {
    expect(validator.validateCommand("cd -L -P /home/user")).toBe(true);
  });

  test("cd with path containing wildcard", () => {
    expect(validator.validateCommand("cd /home/*")).toBe(true);
  });
});
