import { CommandValidator } from "../../src/cmd-validator.js";

describe("free command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display memory usage in default format", () => {
    expect(validator.validateCommand('free')).toBe(true);
  });

  test("Display memory usage in human-readable format", () => {
    expect(validator.validateCommand('free -h')).toBe(true);
  });

  test("Invalid: Combining option with invalid argument ", () => {
    expect(validator.validateCommand('free -h --shared')).toBe(false);
  });

  test("Invalid: With multiple unit option ", () => {
    expect(validator.validateCommand('free -bb')).toBe(false);
  });

  test("Display memory usage in bytes", () => {
    expect(validator.validateCommand('free -b')).toBe(true);
  });

  test("Display memory usage in kibibytes", () => {
    expect(validator.validateCommand('free -k')).toBe(true);
  });

  test("Display memory usage in mebibytes", () => {
    expect(validator.validateCommand('free -m')).toBe(true);
  });

  test("Invalid: Incorrect time argument ", () => {
    expect(validator.validateCommand('free -s -2x')).toBe(false);
  });

  test("With invalid option declarator ", () => {
    expect(validator.validateCommand('free --v')).toBe(false);
  });

  test("Display memory usage in gibibytes", () => {
    expect(validator.validateCommand('free -g')).toBe(true);
  });

  test("Display memory usage in tebibytes", () => {
    expect(validator.validateCommand('free --tebi')).toBe(true);
  });

  test("Display memory usage in wide mode", () => {
    expect(validator.validateCommand('free -w')).toBe(true);
  });

  test("Display memory usage continuously every 2 seconds", () => {
    expect(validator.validateCommand('free -s 2')).toBe(true);
  });

  test("Display total memory usage", () => {
    expect(validator.validateCommand('free -t')).toBe(true);
  });

  test("Show detailed low and high memory statistics", () => {
    expect(validator.validateCommand('free -l')).toBe(true);
  });

  test("Display version information", () => {
    expect(validator.validateCommand('free -V')).toBe(true);
  });

  test("Print help message", () => {
    expect(validator.validateCommand('free --help')).toBe(true);
  });

  test("Invalid option handling", () => {
    expect(validator.validateCommand('free --invalid-option')).toBe(false);
  });
});
