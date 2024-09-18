import { CommandValidator } from "../../src/cmd-validator.js";

describe("unzip command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic unzip", () => {
    expect(validator.validateCommand("unzip archive.zip")).toBe(true);
  });

  test("unzip with output directory", () => {
    expect(validator.validateCommand("unzip -d /path/to/directory archive.zip")).toBe(true);
  });

  test("unzip with multiple files", () => {
    expect(validator.validateCommand("unzip archive.zip file1.txt file2.txt")).toBe(true);
  });

  test("unzip with option -c", () => {
    expect(validator.validateCommand("unzip -c archive.zip")).toBe(true);
  });

  test("unzip with option -l", () => {
    expect(validator.validateCommand("unzip -l archive.zip")).toBe(true);
  });

  test("unzip with option -o", () => {
    expect(validator.validateCommand("unzip -o archive.zip")).toBe(true);
  });

  test("unzip with option -P", () => {
    expect(validator.validateCommand("unzip -P password archive.zip")).toBe(true);
  });

  test("unzip with wildcard", () => {
    expect(validator.validateCommand("unzip '*.zip'")).toBe(true);
  });

  test("unzip with quoted paths", () => {
    expect(validator.validateCommand("unzip 'my archive.zip'")).toBe(true);
  });

  test("unzip with option and multiple files", () => {
    expect(validator.validateCommand("unzip -o archive.zip file1.txt file2.txt")).toBe(true);
  });

  test("unzip with option and output directory", () => {
    expect(validator.validateCommand("unzip -d /destination archive.zip")).toBe(true);
  });

  test("Invalid: unzip with unmatched quote", () => {
    expect(validator.validateCommand("unzip 'unmatched")).toBe(false);
  });

  test("Invalid: unzip with space before command", () => {
    expect(validator.validateCommand(" unzip archive.zip")).toBe(false);
  });

  test("unzip with invalid option", () => {
    expect(validator.validateCommand("unzip --invalid-option archive.zip")).toBe(false);
  });

  test("unzip with option -n", () => {
    expect(validator.validateCommand("unzip -n archive.zip")).toBe(true);
  });

  test("unzip with option -q", () => {
    expect(validator.validateCommand("unzip -q archive.zip")).toBe(true);
  });

  test("unzip with combination of options", () => {
    expect(validator.validateCommand("unzip -o -d /path/to/directory archive.zip")).toBe(true);
  });

  test("unzip with multiple options", () => {
    expect(validator.validateCommand("unzip -l -v archive.zip")).toBe(true);
  });
});
