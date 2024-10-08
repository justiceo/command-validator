import { CommandValidator } from "../../src/cmd-validator.js";

describe("cd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic cd", () => {
    expect(validator.validateCommand("cd")).toBe(true);
  });

  test("cd with absolute path", () => {
    expect(validator.validateCommand("cd /usr/local/bin")).toBe(true);
  });

  test("cd with relative path", () => {
    expect(validator.validateCommand("cd ..")).toBe(true);
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

  test("cd with option -e", () => {
    expect(validator.validateCommand("cd -P -e /home/user")).toBe(true);
  });

  test("cd with option -@", () => {
    expect(validator.validateCommand("cd -@ /home/user")).toBe(false);
  });

  test("cd with unmatched quote", () => {
    expect(validator.validateCommand("cd 'unmatched")).toBe(true);
  });

  test("cd with space before option", () => {
    expect(validator.validateCommand(" cd -L")).toBe(true);
  });

  test("cd with potentially invalid directory", () => {
    expect(validator.validateCommand("cd /non/existent/directory")).toBe(true);
  });

  test("cd with quoted path", () => {
    expect(validator.validateCommand("cd 'My Documents'")).toBe(false);
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

  test("cd with incorrect command name", () => {
    expect(validator.validateCommand("ccd /home/*")).toBe(false);
  });
  
  test("cd with CDPATH variable", () => {
    expect(validator.validateCommand("cd work")).toBe(true);
  });
});