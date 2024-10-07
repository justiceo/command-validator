import { CommandValidator } from "../../src/cmd-validator.js";

describe("cat command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Invalid: Basic cat", () => {
    expect(validator.validateCommand("cat")).toBe(false);
  });

  test("cat with file", () => {
    expect(validator.validateCommand("cat test.txt")).toBe(true);
  });

  test("cat with option", () => {
    expect(validator.validateCommand("cat -n test.txt")).toBe(true);
  });

  test("cat with multiple options", () => {
    expect(validator.validateCommand("cat -n -E test.txt")).toBe(true);
  });

  test("cat with multiple files", () => {
    expect(validator.validateCommand("cat file1.txt file2.txt")).toBe(true);
  });

  test("cat with help option", () => {
    expect(validator.validateCommand("cat --help")).toBe(true);
  });

  test("cat with version option", () => {
    expect(validator.validateCommand("cat --version")).toBe(true);
  });

  test("cat with quoted filename", () => {
    expect(validator.validateCommand("cat 'My File.txt'")).toBe(true);
  });

  test("cat with double quoted filename", () => {
    expect(validator.validateCommand('cat "My File.txt"')).toBe(true);
  });

  test("cat with pipe usage", () => {
    expect(validator.validateCommand("cat file.txt | grep "text"")).toBe(true);
  });
  
  test("cat with incorrect pipe usage", () => {
    expect(validator.validateCommand("cat file.txt || grep "text"")).toBe(false);
  });

  test("cat with escaped space in filename", () => {
    expect(validator.validateCommand("cat My\\ File.txt")).toBe(true);
  });

  test("cat with non-existing file", () => {
    expect(validator.validateCommand("cat nonexistent.txt")).toBe(false);
  });

  test("Invalid: cat with unmatched quote", () => {
    expect(validator.validateCommand("cat 'unmatched")).toBe(false);
  });

  test("Invalid: cat with empty file name", () => {
    expect(validator.validateCommand("cat " "")).toBe(false);
  });

  test("Invalid: cat with incorrect output redirect", () => {
    expect(validator.validateCommand("cat file.txt >"cat )).toBe(false);
  });

  test("Invalid: cat with space before option", () => {
    expect(validator.validateCommand(" cat -n")).toBe(false);
  });

  test("cat with option after file", () => {
    expect(validator.validateCommand("cat test.txt -n")).toBe(true);
  });

  test("cat with invalid option", () => {
    expect(validator.validateCommand("cat --invalid-option")).toBe(false);
  });

  test("cat with path", () => {
    expect(validator.validateCommand("cat /path/to/file.txt")).toBe(true);
  });

  test("cat with wildcard", () => {
    expect(validator.validateCommand("cat *.txt")).toBe(true);
  });

  test("cat with complex path", () => {
    expect(validator.validateCommand("cat /home/user/Documents/*.txt")).toBe(true);
  });

  test("cat with environment variable", () => {
    expect(validator.validateCommand("cat $HOME/test.txt")).toBe(true);
  });

  test("cat with tilde expansion", () => {
    expect(validator.validateCommand("cat ~/Documents/file.txt")).toBe(true);
  });

  test("cat with multiple options and file", () => {
    expect(validator.validateCommand("cat -n -E test.txt")).toBe(true);
  });

  test("cat with option and complex wildcard", () => {
    expect(validator.validateCommand("cat -n [a-z]*.txt")).toBe(true);
  });

  test("cat with multiple separated options", () => {
    expect(validator.validateCommand("cat -n -b")).toBe(true);
  });

  test("cat with option and hidden files", () => {
    expect(validator.validateCommand("cat -a .hidden_file")).toBe(true);
  });
});
