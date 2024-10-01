import { CommandValidator } from "../../src/cmd-validator.js";

describe("chmod command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Change permissions using numeric mode", () => {
    expect(validator.validateCommand("chmod 755 file.txt")).toBe(true);
  });

  test("Change permissions using symbolic mode", () => {
    expect(validator.validateCommand("chmod u+x file.txt")).toBe(true);
    expect(validator.validateCommand("chmod g-w file.txt")).toBe(true);
    expect(validator.validateCommand("chmod o+r file.txt")).toBe(true);
  });

  test("Change multiple modes at once", () => {
    expect(validator.validateCommand("chmod u+x,g-w file.txt")).toBe(true);
  });

   test("Invalid: Change with invalid octal value", () => {
    expect(validator.validateCommand("chmod 9 file.txt")).toBe(false);
  });

  test("Invalid: Change with invalid symbolic mode", () => {
    expect(validator.validateCommand("chmod u+xg file.txt")).toBe(false);
  });

  test("Change permissions using reference file", () => {
    expect(validator.validateCommand("chmod --reference=reffile.txt file.txt")).toBe(true);
  });

  test("Invalid: Wrong order of arguments", () => {
    expect(validator.validateCommand("chmod file.txt 755")).toBe(false);
  });

  test("Invalid: Spaces in permission", () => {
    expect(validator.validateCommand("chmod 7 5 5 file.txt")).toBe(false);
  });

  test("Recursive change of permissions", () => {
    expect(validator.validateCommand("chmod -R 755 directory/")).toBe(true);
  });

  test("Verbose output on changes", () => {
    expect(validator.validateCommand("chmod -v 755 file.txt")).toBe(true);
  });

  test("Changes reporting only when made", () => {
    expect(validator.validateCommand("chmod -c 755 file.txt")).toBe(true);
  });

  test("Suppress error messages", () => {
    expect(validator.validateCommand("chmod -f 755 file.txt")).toBe(true);
  });

  test("Invalid command: missing file argument", () => {
    expect(validator.validateCommand("chmod 755")).toBe(false);
  });

  test("Invalid command: incorrect option", () => {
    expect(validator.validateCommand("chmod --invalid-option 755 file.txt")).toBe(false);
  });

  test("Invalid command: unmatched quotes", () => {
    expect(validator.validateCommand("chmod 'u+x file.txt")).toBe(false);
  });

  test("Change permissions on multiple files", () => {
    expect(validator.validateCommand("chmod 644 file1.txt file2.txt")).toBe(true);
  });

  test("Change permissions on non-existent file", () => {
    expect(validator.validateCommand("chmod 755 non_existent_file.txt")).toBe(false);
  });
});
