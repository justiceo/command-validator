import { CommandValidator } from "../../src/cmd-validator.js";

describe("which command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic which", () => {
    expect(validator.validateCommand("which ls")).toBe(true);
  });

  test("which with all option", () => {
    expect(validator.validateCommand("which --all ls")).toBe(true);
  });

  test("which with read-alias option", () => {
    expect(validator.validateCommand("which --read-alias ls")).toBe(true);
  });

  test("which with skip-alias option", () => {
    expect(validator.validateCommand("which --skip-alias ls")).toBe(true);
  });

  test("which with skip-dot option", () => {
    expect(validator.validateCommand("which --skip-dot ls")).toBe(true);
  });

  test("which with skip-tilde option", () => {
    expect(validator.validateCommand("which --skip-tilde ls")).toBe(true);
  });

  test("which with show-dot option", () => {
    expect(validator.validateCommand("which --show-dot ls")).toBe(true);
  });

  test("which with show-tilde option", () => {
    expect(validator.validateCommand("which --show-tilde ls")).toBe(true);
  });

  test("which with tty-only option", () => {
    expect(validator.validateCommand("which --tty-only ls")).toBe(true);
  });

  test("which with version option", () => {
    expect(validator.validateCommand("which --version")).toBe(true);
  });

  test("which with help option", () => {
    expect(validator.validateCommand("which --help")).toBe(true);
  });

  test("Invalid: which with extra arguments", () => {
    expect(validator.validateCommand("which ls extra")).toBe(false);
  });

  test("Invalid: which with space before command", () => {
    expect(validator.validateCommand(" which ls")).toBe(false);
  });
});
