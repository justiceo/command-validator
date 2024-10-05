import { CommandValidator } from "../../src/cmd-validator.js";

describe("rm command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic rm", () => {
    expect(validator.validateCommand("rm file1.txt")).toBe(true);
  });

  test("rm with force option", () => {
    expect(validator.validateCommand("rm -f file1.txt")).toBe(true);
  });

  test("rm with interactive option", () => {
    expect(validator.validateCommand("rm -i file1.txt")).toBe(true);
  });

  test("rm with multiple files", () => {
    expect(validator.validateCommand("rm file1.txt file2.txt")).toBe(true);
  });

  test("rm with recursive option", () => {
    expect(validator.validateCommand("rm -r directory/")).toBe(true);
  });

  test("rm with verbose option", () => {
    expect(validator.validateCommand("rm -v file1.txt")).toBe(true);
  });

  test("rm with multiple options", () => {
    expect(validator.validateCommand("rm -rf directory/")).toBe(true);
  });

  test("rm with one-file-system option", () => {
    expect(validator.validateCommand("rm --one-file-system -r directory/")).toBe(true);
  });

  test("Invalid: rm with invalid option", () => {
    expect(validator.validateCommand("rm --invalid-option")).toBe(false);
  });

  test("Invalid: rm with unmatched quote", () => {
    expect(validator.validateCommand("rm 'file1.txt")).toBe(false);
  });

  test("Invalid: rm without operand", () => {
    expect(validator.validateCommand("rm")).toBe(false);
  });

  test("Invalid: rm with non existent file", () => {
    expect(validator.validateCommand("rm non_existent_file")).toBe(false);
  });

  test("Invalid: rm without target", () => {
    expect(validator.validateCommand("rm -f")).toBe(false);
  });

  test("Invalid: rm with improper option placement", () => {
    expect(validator.validateCommand("rm file.txt -i")).toBe(false);
  });

  test("Invalid: rm directory without -r option", () => {
    expect(validator.validateCommand("rm directory")).toBe(false);
  });

  test("rm with help option", () => {
    expect(validator.validateCommand("rm --help")).toBe(true);
  });

  test("rm with version option", () => {
    expect(validator.validateCommand("rm --version")).toBe(true);
  });

  test("rm with space before option", () => {
    expect(validator.validateCommand("rm -f file1.txt")).toBe(true);
  });

  test("rm with multiple directories", () => {
    expect(validator.validateCommand("rm -r dir1/ dir2/")).toBe(true);
  });

  test("rm with combination of options", () => {
    expect(validator.validateCommand("rm -v -i file1.txt")).toBe(true);
  });

  test("rm with no-preserve-root option", () => {
    expect(validator.validateCommand("rm --no-preserve-root /")).toBe(true);
  });

  test("rm with preserve-root option", () => {
    expect(validator.validateCommand("rm --preserve-root /")).toBe(false);
  });

  test("Invalid: rm with path containing special character", () => {
    expect(validator.validateCommand("rm file|name")).toBe(true);
  });

  test("rm with option and complex path", () => {
    expect(validator.validateCommand("rm -rf ~/Documents/*")).toBe(true);
  });
});
