import { CommandValidator } from "../../src/cmd-validator.js";

describe("ps command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic ps", () => {
    expect(validator.validateCommand("ps")).toBe(true);
  });

  test("ps with all option", () => {
    expect(validator.validateCommand("ps -A")).toBe(true);
  });

  test("ps with all processes option", () => {
    expect(validator.validateCommand("ps -e")).toBe(true);
  });

  test("ps with full format option", () => {
    expect(validator.validateCommand("ps -f")).toBe(true);
  });

  test("ps with long format option", () => {
    expect(validator.validateCommand("ps -l")).toBe(true);
  });

  test("ps with user option", () => {
    expect(validator.validateCommand("ps -u username")).toBe(true);
  });

  test("ps with process ID option", () => {
    expect(validator.validateCommand("ps -p 1234")).toBe(true);
  });

  test("ps with processes not attached to terminal option", () => {
    expect(validator.validateCommand("ps -x")).toBe(true);
  });

  test("ps with custom output format", () => {
    expect(validator.validateCommand("ps -o pid,comm,%mem")).toBe(true);
  });

  test("ps with help option", () => {
    expect(validator.validateCommand("ps --help")).toBe(true);
  });

  test("ps with version option", () => {
    expect(validator.validateCommand("ps --version")).toBe(true);
  });

  test("ps with sort option", () => {
    expect(validator.validateCommand("ps --sort %mem")).toBe(true);
  });

  test("ps with forest option", () => {
    expect(validator.validateCommand("ps --forest")).toBe(true);
  });

  test("Invalid: ps with invalid option", () => {
    expect(validator.validateCommand("ps --invalid-option")).toBe(false);
  });

  test("ps with space before option", () => {
    expect(validator.validateCommand("ps  -A")).toBe(true);
  });

  test("Invalid: ps with unmatched quote", () => {
    expect(validator.validateCommand("ps 'unmatched")).toBe(false);
  });

  test("ps with multiple options", () => {
    expect(validator.validateCommand("ps -ef")).toBe(true);
  });

  test("ps with combination of options", () => {
    expect(validator.validateCommand("ps -e -f")).toBe(true);
  });
});
