import { CommandValidator } from "../../src/cmd-validator.js";

describe("mv command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic move to directory", () => {
    expect(validator.validateCommand("mv file1.txt /home/user/documents/")).toBe(true);
  });

  test("Basic rename file", () => {
    expect(validator.validateCommand("mv file1.txt file2.txt")).toBe(true);
  });

  test("mv with backup option", () => {
    expect(validator.validateCommand("mv -b file1.txt file2.txt")).toBe(true);
  });

  test("mv with force option", () => {
    expect(validator.validateCommand("mv -f file1.txt file2.txt")).toBe(true);
  });

  test("mv with interactive option", () => {
    expect(validator.validateCommand("mv -i file1.txt file2.txt")).toBe(true);
  });

  test("mv with update option", () => {
    expect(validator.validateCommand("mv -u file1.txt file2.txt")).toBe(true);
  });

  test("mv with verbose option", () => {
    expect(validator.validateCommand("mv -v file1.txt file2.txt")).toBe(true);
  });

  test("mv with version control option", () => {
    expect(validator.validateCommand("mv -V t file1.txt file2.txt")).toBe(true);
  });

  test("Invalid: mv with no source specified", () => {
    expect(validator.validateCommand("mv /home/user/documents/")).toBe(false);
  });

  test("Invalid: mv with multiple sources and no directory", () => {
    expect(validator.validateCommand("mv file1.txt file2.txt file3.txt")).toBe(false);
  });

  test("Invalid: mv with space before option", () => {
    expect(validator.validateCommand(" mv -f file1.txt file2.txt")).toBe(false);
  });

  test("Invalid: mv with unmatched quote", () => {
    expect(validator.validateCommand("mv 'file1.txt")).toBe(false);
  });

  test("mv with multiple options", () => {
    expect(validator.validateCommand("mv -f -v file1.txt file2.txt")).toBe(true);
  });

  test("mv with backup and suffix option", () => {
    expect(validator.validateCommand("mv -b -S ~ file1.txt file2.txt")).toBe(true);
  });
});
