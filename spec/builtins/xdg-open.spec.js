import { CommandValidator } from "../../src/cmd-validator.js";

describe("xdg-open command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic xdg-open with file", () => {
    expect(validator.validateCommand("xdg-open file.pdf")).toBe(true);
  });

  test("xdg-open with URL", () => {
    expect(validator.validateCommand("xdg-open https://example.com")).toBe(true);
  });

  test("xdg-open with help option", () => {
    expect(validator.validateCommand("xdg-open --help")).toBe(true);
  });

  test("xdg-open with manual option", () => {
    expect(validator.validateCommand("xdg-open --manual")).toBe(true);
  });

  test("xdg-open with version option", () => {
    expect(validator.validateCommand("xdg-open --version")).toBe(true);
  });

  test("Invalid: xdg-open with unmatched quote", () => {
    expect(validator.validateCommand("xdg-open 'unmatched")).toBe(false);
  });
  
  test("Invalid: xdg-open with typo", () => {
    expect(validator.validateCommand("xdg-openn file.pdf")).toBe(false);
  });

  test("xdg-open with space before option", () => {
    expect(validator.validateCommand(" xdg-open file.pdf")).toBe(true);
  });

  test("xdg-open with multiple file types", () => {
    expect(validator.validateCommand("xdg-open file.pdf file.txt")).toBe(true);
  });

  test("xdg-open with special characters in filename", () => {
    expect(validator.validateCommand("xdg-open 'my file@2024.pdf'")).toBe(true);
  });

  test("Invalid: xdg-open with empty filename", () => {
    expect(validator.validateCommand("xdg-open ''")).toBe(false);
  });

  test("xdg-open with no arguments", () => {
    expect(validator.validateCommand("xdg-open")).toBe(false);
  });
});