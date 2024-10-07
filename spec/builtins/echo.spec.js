import { CommandValidator } from "../../src/cmd-validator.js";

describe("echo command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display a simple string", () => {
    expect(validator.validateCommand('echo "Hello, World!"')).toBe(true);
  });

  test("No trailing newline", () => {
    expect(validator.validateCommand('echo -n "No newline"')).toBe(true);
  });

  test("Enable escape characters", () => {
    expect(validator.validateCommand('echo -e "Line1\\nLine2"')).toBe(true);
  });

  test("Alert (bell) character", () => {
    expect(validator.validateCommand('echo -e "Alert: \\a"')).toBe(true);
  });

  test("Backspace character", () => {
    expect(validator.validateCommand('echo -e "Hello\\bWorld"')).toBe(true);
  });

  test("Carriage return character", () => {
    expect(validator.validateCommand('echo -e "Hello\\rWorld"')).toBe(true);
  });

  test("Hexadecimal character", () => {
    expect(validator.validateCommand('echo -e "Hex: \\x41"')).toBe(true);
  });

  test("Unicode character", () => {
    expect(validator.validateCommand('echo -e "Unicode: \\u2602"')).toBe(true);
  });

  test("Multiple strings with default space", () => {
    expect(validator.validateCommand('echo "String1" "String2" "String3"')).toBe(true);
  });

  test("Interpret backslashes disabled", () => {
    expect(validator.validateCommand('echo -E "Line1\\nLine2"')).toBe(true);
  });

  test("Invalid octal value handling", () => {
    expect(validator.validateCommand('echo -e "Invalid: \\0123"')).toBe(true);
  });

  test("Empty string", () => {
    expect(validator.validateCommand('echo')).toBe(true);
  });

   test("Using pipe character", () => {
    expect(validator.validateCommand('echo | cat file.txt')).toBe(true);
  });

   test("Empty string", () => {
    expect(validator.validateCommand('echo')).toBe(true);
  });

   test("With unmatched quoute", () => {
    expect(validator.validateCommand('echo 'Hello world"')).toBe(false);
  });
});