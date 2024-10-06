import { CommandValidator } from "../../src/cmd-validator.js";

describe("tail command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic tail command", () => {
    expect(validator.validateCommand("tail file.txt")).toBe(true);
  });

  test("Tail with default options", () => {
    expect(validator.validateCommand("tail -n 10 file.txt")).toBe(true);
  });

  test("Tail specific number of lines", () => {
    expect(validator.validateCommand("tail -n 5 file.txt")).toBe(true);
  });

  test("Tail from the Kth line", () => {
    expect(validator.validateCommand("tail -n +5 file.txt")).toBe(true);
  });

  test("Tail with byte output", () => {
    expect(validator.validateCommand("tail -c 100 file.txt")).toBe(true);
  });

  test("Follow file growth", () => {
    expect(validator.validateCommand("tail -f log.txt")).toBe(true);
  });

  test("Follow file with a specific process ID", () => {
    expect(validator.validateCommand("tail -f --pid=1234 log.txt")).toBe(true);
  });

  test("Output without headers", () => {
    expect(validator.validateCommand("tail -q file.txt")).toBe(true);
  });

  test("Verbose output with headers", () => {
    expect(validator.validateCommand("tail -v file.txt")).toBe(true);
  });

  test("Invalid: tail with multiple file input", () => {
    expect(validator.validateCommand("tail file1.txt file2.txt file3.txt")).toBe(true);
  });

  test("Invalid: tail with directory", () => {
    expect(validator.validateCommand("tail directory")).toBe(false);
  });

  test("Retry opening a file", () => {
    expect(validator.validateCommand("tail --retry log.txt")).toBe(true);
  });

  test("Specify sleep interval", () => {
    expect(validator.validateCommand("tail -s 2 -f log.txt")).toBe(true);
  });

  test("Help command", () => {
    expect(validator.validateCommand("tail --help")).toBe(true);
  });

  test("Version command", () => {
    expect(validator.validateCommand("tail --version")).toBe(true);
  });

  test("Invalid: tail with no file specified", () => {
    expect(validator.validateCommand("tail")).toBe(false);
  });

  test("Invalid: tail with typo", () => {
    expect(validator.validateCommand("taiil file.txt")).toBe(false);
  });

  test("Invalid: tail with unknown option", () => {
    expect(validator.validateCommand("tail --unknown-option")).toBe(false);
  });

  test("Invalid: tail with unmatched quotes", () => {
    expect(validator.validateCommand("tail 'file.txt")).toBe(false);
  });

  test("Invalid: tail with negative line number", () => {
    expect(validator.validateCommand("tail -n -5 file.txt")).toBe(false);
  });
});
