import { CommandValidator } from "../../src/cmd-validator.js";

describe("nl command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic nl", () => {
    expect(validator.validateCommand("nl file.txt")).toBe(true);
  });

  test("nl with no file (standard input)", () => {
    expect(validator.validateCommand("nl -")).toBe(true);
  });

  test("nl with body type option", () => {
    expect(validator.validateCommand("nl -b a file.txt")).toBe(true);
  });

  test("nl with delimiter option", () => {
    expect(validator.validateCommand("nl -d , file.txt")).toBe(true);
  });

  test("nl with increment option", () => {
    expect(validator.validateCommand("nl -i 5 file.txt")).toBe(true);
  });

  test("nl with left justified format", () => {
    expect(validator.validateCommand("nl -n ln file.txt")).toBe(true);
  });

  test("nl with right justified format, leading zeros suppressed", () => {
    expect(validator.validateCommand("nl -n rn file.txt")).toBe(true);
  });

  test("nl with right justified format, leading zeros kept", () => {
    expect(validator.validateCommand("nl -n rz file.txt")).toBe(true);
  });

  test("nl with separator option", () => {
    expect(validator.validateCommand("nl -s : file.txt")).toBe(true);
  });

  test("nl with starting number option", () => {
    expect(validator.validateCommand("nl -v 10 file.txt")).toBe(true);
  });

  test("nl with width option", () => {
    expect(validator.validateCommand("nl -w 8 file.txt")).toBe(true);
  });

  test("nl with multiple options", () => {
    expect(validator.validateCommand("nl -b t -n rn -s | file.txt")).toBe(true);
  });

  test("nl with keep numbering option", () => {
    expect(validator.validateCommand("nl -p file.txt")).toBe(true);
  });

  test("Invalid: nl with invalid option", () => {
    expect(validator.validateCommand("nl --invalid-option file.txt")).toBe(false);
  });

  test("Invalid: nl with space before option", () => {
    expect(validator.validateCommand(" nl -b a file.txt")).toBe(false);
  });

  test("Invalid: nl with unmatched quote", () => {
    expect(validator.validateCommand("nl 'unmatched")).toBe(false);
  });

  test("Invalid: nl with missing required argument", () => {
    expect(validator.validateCommand("nl -b")).toBe(false);
  });
});
