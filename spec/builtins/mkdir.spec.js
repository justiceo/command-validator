import { CommandValidator } from "../../src/cmd-validator.js";

describe("mkdir command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Create a new directory", () => {
    expect(validator.validateCommand("mkdir new_directory")).toBe(true);
  });

  test("Create a directory with spaces in the name", () => {
    expect(validator.validateCommand('mkdir "Name with spaces"')).toBe(true);
  });

  test("Create parent directories", () => {
    expect(validator.validateCommand("mkdir -p parent_directory/child_directory")).toBe(true);
  });

  test("Set permission mode while creating a directory", () => {
    expect(validator.validateCommand("mkdir -m 755 new_directory")).toBe(true);
  });

  test("Verbose output when creating a directory", () => {
    expect(validator.validateCommand("mkdir -v new_directory")).toBe(true);
  });

  test("Invalid: Create an existing directory without -p", () => {
    expect(validator.validateCommand("mkdir existing_directory")).toBe(false);
  });

  test("Invalid: Permission mode should be valid", () => {
    expect(validator.validateCommand("mkdir -m invalid_mode new_directory")).toBe(false);
  });

  test("Invalid: Missing directory argument", () => {
    expect(validator.validateCommand("mkdir")).toBe(false);
  });

  test("Invalid: With typo in command", () => {
    expect(validator.validateCommand("mkdiir directory")).toBe(false);
  });

   test("Invalid: options combination", () => {
    expect(validator.validateCommand("mkdiir -v-p directory")).toBe(false);
  });

  test("Invalid: Path with invalid characters", () => {
    expect(validator.validateCommand("mkdir /invalid*path")).toBe(false);
  });
});
