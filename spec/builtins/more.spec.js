import { CommandValidator } from "../../src/cmd-validator.js";

describe("more command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic file display", () => {
    expect(validator.validateCommand("more file.txt")).toBe(true);
  });

  test("Display file with line number start", () => {
    expect(validator.validateCommand("more +10 file.txt")).toBe(true);
  });

  test("Search for a string in the file", () => {
    expect(validator.validateCommand("more +/searchterm file.txt")).toBe(true);
  });

  test("Specify lines per screen", () => {
    expect(validator.validateCommand("more -n 20 file.txt")).toBe(true);
  });

  test("Suppress underlining", () => {
    expect(validator.validateCommand("more -u file.txt")).toBe(true);
  });

  test("Squeeze multiple blank lines", () => {
    expect(validator.validateCommand("more -s file.txt")).toBe(true);
  });

  test("Exit on End-Of-File", () => {
    expect(validator.validateCommand("more -e file.txt")).toBe(true);
  });

  test("Print over without scrolling", () => {
    expect(validator.validateCommand("more -p file.txt")).toBe(true);
  });

  test("Clear screen and display", () => {
    expect(validator.validateCommand("more -c file.txt")).toBe(true);
  });

  test("Logical lines without pause", () => {
    expect(validator.validateCommand("more -f file.txt")).toBe(true);
  });

  test("Display help message", () => {
    expect(validator.validateCommand("more -h")).toBe(true);
  });

  test("Display version information", () => {
    expect(validator.validateCommand("more -V")).toBe(true);
  });

  test("Invalid: Display non-existent file", () => {
    expect(validator.validateCommand("more nonexistent.txt")).toBe(false);
  });

  test("Invalid: Line number argument without file", () => {
    expect(validator.validateCommand("more +10")).toBe(false);
  });

  test("Invalid: Unsupported option", () => {
    expect(validator.validateCommand("more --invalid-option file.txt")).toBe(false);
  });

  test("Invalid: Missing file argument", () => {
    expect(validator.validateCommand("more")).toBe(false);
  });

  test("Invalid: typo in command", () => {
    expect(validator.validateCommand("morre -f file.txt")).toBe(false);
  });

  test("Invalid: Line number must be positive", () => {
    expect(validator.validateCommand("more -n -5 file.txt")).toBe(false);
  });
});
