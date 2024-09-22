import { CommandValidator } from "../../src/cmd-validator.js";

describe("nvim command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic nvim command", () => {
    expect(validator.validateCommand("nvim")).toBe(true);
  });

  test("Open a file", () => {
    expect(validator.validateCommand("nvim file.txt")).toBe(true);
  });

  test("Open multiple files", () => {
    expect(validator.validateCommand("nvim file1.txt file2.txt")).toBe(true);
  });

  test("Open in read-only mode", () => {
    expect(validator.validateCommand("nvim -R file.txt")).toBe(true);
  });

  test("Open in binary mode", () => {
    expect(validator.validateCommand("nvim -b file.bin")).toBe(true);
  });

  test("Use a specific vimrc file", () => {
    expect(validator.validateCommand("nvim -u custom.vimrc file.txt")).toBe(true);
  });

  test("QuickFix mode", () => {
    expect(validator.validateCommand("nvim -q errors.log")).toBe(true);
  });

  test("Recovery mode", () => {
    expect(validator.validateCommand("nvim -r swapfile.swp")).toBe(true);
  });

  test("Open in diff mode", () => {
    expect(validator.validateCommand("nvim -d file1.txt file2.txt")).toBe(true);
  });

  test("Use silent Ex mode", () => {
    expect(validator.validateCommand("nvim -es commands.txt")).toBe(true);
  });

  test("Verbose mode with output file", () => {
    expect(validator.validateCommand("nvim -V3 debug.log file.txt")).toBe(true);
  });

  test("Invalid: nvim with unknown option", () => {
    expect(validator.validateCommand("nvim --unknown-option")).toBe(false);
  });

  test("Invalid: nvim with unmatched quotes", () => {
    expect(validator.validateCommand("nvim 'file.txt")).toBe(false);
  });

  test("nvim with tag", () => {
    expect(validator.validateCommand("nvim -t mytag")).toBe(true);
  });

  test("Open with line number", () => {
    expect(validator.validateCommand("nvim +10 file.txt")).toBe(true);
  });

  test("Execute command after file", () => {
    expect(validator.validateCommand("nvim -c 'echo Hello' file.txt")).toBe(true);
  });

  test("Headless mode", () => {
    expect(validator.validateCommand("nvim --headless -u NONE")).toBe(true);
  });

  test("Invalid: nvim without file or command", () => {
    expect(validator.validateCommand("nvim -c")).toBe(false);
  });

  test("Invalid: nvim with no command after -c", () => {
    expect(validator.validateCommand("nvim -c")).toBe(false);
  });

  test("Open in split window horizontally", () => {
    expect(validator.validateCommand("nvim -o2 file1.txt file2.txt")).toBe(true);
  });

  test("Open in split window vertically", () => {
    expect(validator.validateCommand("nvim -O2 file1.txt file2.txt")).toBe(true);
  });
});
