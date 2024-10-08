import { CommandValidator } from "../../src/cmd-validator.js";

describe("watch command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic watch command", () => {
    expect(validator.validateCommand("watch ls")).toBe(true);
  });

  test("watch with interval option", () => {
    expect(validator.validateCommand("watch -n 5 df -h")).toBe(true);
  });

  test("watch with beep option", () => {
    expect(validator.validateCommand("watch -b ls")).toBe(true);
  });

  test("watch with color option", () => {
    expect(validator.validateCommand("watch --color ls")).toBe(true);
  });

  test("watch with no color option", () => {
    expect(validator.validateCommand("watch --no-color ls")).toBe(true);
  });

  test("watch with differences option", () => {
    expect(validator.validateCommand("watch -d ls")).toBe(true);
  });

  test("watch with errexit option", () => {
    expect(validator.validateCommand("watch -e ls")).toBe(true);
  });

  test("watch with chgexit option", () => {
    expect(validator.validateCommand("watch -g ls")).toBe(true);
  });

  test("watch with no rerun option", () => {
    expect(validator.validateCommand("watch -r ls")).toBe(true);
  });

  test("watch with no wrap option", () => {
    expect(validator.validateCommand("watch -w ls")).toBe(true);
  });

  test("watch with exec option", () => {
    expect(validator.validateCommand("watch -x ls")).toBe(true);
  });

  test("Invalid: watch with unmatched quotes", () => {
    expect(validator.validateCommand("watch 'ls")).toBe(false);
  });

  test("Invalid: watch with invalid option", () => {
    expect(validator.validateCommand("watch --invalid-option ls")).toBe(false);
  });

  test("Invalid: watch with ininterative command", () => {
    expect(validator.validateCommand("watch vim file.txt")).toBe(false);
  });

  test("Invalid: watch with typo", () => {
    expect(validator.validateCommand("wattch date")).toBe(false);
  });

  test("watch with help option", () => {
    expect(validator.validateCommand("watch --help")).toBe(true);
  });

  test("watch with version option", () => {
    expect(validator.validateCommand("watch --version")).toBe(true);
  });

  test("watch with multiple options", () => {
    expect(validator.validateCommand("watch -d -n 2 ls")).toBe(true);
  });

  test("watch with no title option", () => {
    expect(validator.validateCommand("watch -t ls")).toBe(true);
  });

  test("watch with shotsdir option", () => {
    expect(validator.validateCommand("watch -s /path/to/dir ls")).toBe(true);
  });
});