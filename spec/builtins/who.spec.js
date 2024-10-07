import { CommandValidator } from "../../src/cmd-validator.js";

describe("whoami command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic whoami", () => {
    expect(validator.validateCommand("whoami")).toBe(true);
  });

  test("whoami with help option", () => {
    expect(validator.validateCommand("whoami --help")).toBe(true);
  });

  test("whoami with version option", () => {
    expect(validator.validateCommand("whoami --version")).toBe(true);
  });

  test("Invalid: whoami with extra arguments", () => {
    expect(validator.validateCommand("whoami extra")).toBe(false);
  });

  test("whoami with space before command", () => {
    expect(validator.validateCommand(" whoami")).toBe(true);
  });

  test("Invalid: whoami with typo", () => {
    expect(validator.validateCommand("whoaami")).toBe(false);
  });

  test("whoami with command substitution", () => {
    expect(validator.validateCommand("echo $(whoami)")).toBe(true);
  });
});