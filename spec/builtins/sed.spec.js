import { CommandValidator } from "../../src/cmd-validator.js";

describe("sed command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic substitution", () => {
    expect(validator.validateCommand("sed 's/old/new/g' file.txt")).toBe(true);
  });

  test("In-place substitution with backup", () => {
    expect(validator.validateCommand("sed -i.bak 's/old/new/g' file.txt")).toBe(true);
  });

  test("Suppress automatic printing", () => {
    expect(validator.validateCommand("sed -n 's/old/new/p' file.txt")).toBe(true);
  });

  test("Using script file", () => {
    expect(validator.validateCommand("sed -f script.sed file.txt")).toBe(true);
  });

  test("Using extended regular expressions", () => {
    expect(validator.validateCommand("sed -r 's/(old|new)/replacement/' file.txt")).toBe(true);
  });

  test("Invalid: Missing script for operation", () => {
    expect(validator.validateCommand("sed file.txt")).toBe(false);
  });

  test("Invalid: Incorrect option usage", () => {
    expect(validator.validateCommand("sed -x 's/old/new/' file.txt")).toBe(false);
  });

  test("Invalid: In-place editing without script", () => {
    expect(validator.validateCommand("sed -i file.txt")).toBe(false);
  });

  test("Invalid: Nonexistent file", () => {
    expect(validator.validateCommand("sed 's/old/new/' non_existent_file.txt")).toBe(false);
  });

  test("Invalid: Incorrect regex syntax", () => {
    expect(validator.validateCommand("sed 's/old/new/' file.txt 'extra'")).toBe(false);
  });
});
