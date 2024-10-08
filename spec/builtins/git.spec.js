import { CommandValidator } from "../../src/cmd-validator.js";

describe("git command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic git command without arguments", () => {
    expect(validator.validateCommand("git")).toBe(false);
  });

  test("git command with version option", () => {
    expect(validator.validateCommand("git --version")).toBe(true);
  });

  test("Invalid: git with typo in command", () => {
    expect(validator.validateCommand("git commmit -m 'message'")).toBe(false);
  });

  test("Invalid: git checkout non existent branch", () => {
    expect(validator.validateCommand("git checkout non-existent-branch")).toBe(false);
  });

  test("Invalid: git clone invalid path", () => {
    expect(validator.validateCommand("git clone https://github.com/user/repo.git/invalid-path")).toBe(false);
  });

  test("git command with help option", () => {
    expect(validator.validateCommand("git -h")).toBe(true);
  });

  test("git command with configuration parameter", () => {
    expect(validator.validateCommand("git -c user.name='John Doe' commit -m 'Initial commit'")).toBe(true);
  });

  test("git command with directory option", () => {
    expect(validator.validateCommand("git -C /path/to/repo status")).toBe(true);
  });

  test("Invalid: git command with invalid option", () => {
    expect(validator.validateCommand("git --invalid-option")).toBe(false);
  });

  test("Invalid: git command with space before command", () => {
    expect(validator.validateCommand(" git commit -m 'message'")).toBe(false);
  });

  test("Invalid: git command with multiple options", () => {
    expect(validator.validateCommand("git -C /path/to/repo -c user.name='John Doe' commit -m 'message'")).toBe(true);
  });
});
