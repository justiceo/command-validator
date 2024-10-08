import { CommandValidator } from "../../src/cmd-validator.js";

describe("umask command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic umask without arguments", () => {
    expect(validator.validateCommand("umask")).toBe(true);
  });

  test("umask with numeric mask", () => {
    expect(validator.validateCommand("umask 022")).toBe(true);
  });

  test("umask with symbolic option", () => {
    expect(validator.validateCommand("umask -S")).toBe(true);
  });

  test("umask with print option", () => {
    expect(validator.validateCommand("umask -p")).toBe(true);
  });

  test("Invalid: umask with non-numeric mask", () => {
    expect(validator.validateCommand("umask abc")).toBe(false);
  });

  test("Invalid: umask with space before command", () => {
    expect(validator.validateCommand(" umask 022")).toBe(false);
  });

  test("Invalid: umask with symbolic notation", () => {
    expect(validator.validateCommand(" umask +rw")).toBe(false);
  });

  test("Invalid: umask with typo", () => {
    expect(validator.validateCommand(" umassk 0022")).toBe(false);
  });

  test("Invalid: umask with invalid option", () => {
    expect(validator.validateCommand("umask --invalid-option")).toBe(false);
  });
});
