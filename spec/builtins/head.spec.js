import { CommandValidator } from "../../src/cmd-validator.js";

describe("head command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display default first lines of a file", () => {
    expect(validator.validateCommand("head file.txt")).toBe(true);
  });

  test("Without input file", () => {
    expect(validator.validateCommand("head")).toBe(false);
  });

  test("Display first n lines of a file", () => {
    expect(validator.validateCommand("head -n 20 file.txt")).toBe(true);
  });

  test("Display first n bytes of a file", () => {
    expect(validator.validateCommand("head -c 100 file.txt")).toBe(true);
  });

  test("Suppress headers when multiple files are given", () => {
    expect(validator.validateCommand("head -q file1.txt file2.txt")).toBe(true);
  });

  test("Verbose output with headers for multiple files", () => {
    expect(validator.validateCommand("head -v file1.txt file2.txt")).toBe(true);
  });

  test("Invalid option usage", () => {
    expect(validator.validateCommand("head --invalid-option")).toBe(false);
  });

  test("Default behavior with no count specified", () => {
    expect(validator.validateCommand("head")).toBe(true); // assuming it reads from stdin
  });

  test("Display help message", () => {
    expect(validator.validateCommand("head --help")).toBe(true);
  });

  test("Typo in command", () => {
    expect(validator.validateCommand("heaad --help")).toBe(false);
  });

  test("Display version information", () => {
    expect(validator.validateCommand("head --version")).toBe(true);
  });
});