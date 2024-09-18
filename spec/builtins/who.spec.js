import { CommandValidator } from "../../src/cmd-validator.js";

describe("who command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic who", () => {
    expect(validator.validateCommand("who")).toBe(true);
  });

  test("who with boot option", () => {
    expect(validator.validateCommand("who -b")).toBe(true);
  });

  test("who with all options", () => {
    expect(validator.validateCommand("who -a")).toBe(true);
  });

  test("who with dead processes option", () => {
    expect(validator.validateCommand("who -d")).toBe(true);
  });

  test("who with login option", () => {
    expect(validator.validateCommand("who --login")).toBe(true);
  });

  test("who with heading option", () => {
    expect(validator.validateCommand("who -H")).toBe(true);
  });

  test("who with users option", () => {
    expect(validator.validateCommand("who --users")).toBe(true);
  });

  test("who with count option", () => {
    expect(validator.validateCommand("who -q")).toBe(true);
  });

  test("who with runlevel option", () => {
    expect(validator.validateCommand("who -r")).toBe(true);
  });

  test("who with time option", () => {
    expect(validator.validateCommand("who -t")).toBe(true);
  });

  test("Invalid: who with extra arguments", () => {
    expect(validator.validateCommand("who extra")).toBe(false);
  });

  test("Invalid: who with space before command", () => {
    expect(validator.validateCommand(" who")).toBe(false);
  });

  test("who with version option", () => {
    expect(validator.validateCommand("who --version")).toBe(true);
  });

  test("who with help option", () => {
    expect(validator.validateCommand("who --help")).toBe(true);
  });
});
