import { CommandValidator } from "../../src/cmd-validator.js";

describe("less command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("View a file", () => {
    expect(validator.validateCommand("less file.txt")).toBe(true);
  });

  test("INvalid: less without option and filename", () => {
    expect(validator.validateCommand("less ")).toBe(false);
  });

  test("Start at end of file", () => {
    expect(validator.validateCommand("less +G file.txt")).toBe(true);
  });

  test("Display line numbers", () => {
    expect(validator.validateCommand("less -N file.txt")).toBe(true);
  });

  test("Ignore case in searches", () => {
    expect(validator.validateCommand("less -i file.txt")).toBe(true);
  });

  test("Highlight only last match for searches", () => {
    expect(validator.validateCommand("less -g file.txt")).toBe(true);
  });

  test("Quit at end of file", () => {
    expect(validator.validateCommand("less -e file.txt")).toBe(true);
  });

  test("Force open non-regular files", () => {
    expect(validator.validateCommand("less -f specialfile")).toBe(true);
  });

  test("Invalid: View a non-existent file", () => {
    expect(validator.validateCommand("less nonexistent.txt")).toBe(false);
  });

  test("Display help message", () => {
    expect(validator.validateCommand("less -?")).toBe(true);
  });

  test("Invalid: Missing file argument", () => {
    expect(validator.validateCommand("less")).toBe(false);
  });

  test("Suppress terminal bell", () => {
    expect(validator.validateCommand("less -q file.txt")).toBe(true);
  });
});

