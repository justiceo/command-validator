import { CommandValidator } from "../../src/cmd-validator.js";

describe("jobs command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("List all jobs", () => {
    expect(validator.validateCommand("jobs")).toBe(true);
  });

  test("List jobs with command names", () => {
    expect(validator.validateCommand("jobs -c")).toBe(true);
  });

  test("List jobs with process IDs", () => {
    expect(validator.validateCommand("jobs -p")).toBe(true);
  });

  test("List last job started", () => {
    expect(validator.validateCommand("jobs -l")).toBe(true);
  });

  test("Print only group ID of jobs", () => {
    expect(validator.validateCommand("jobs -g")).toBe(true);
  });

  test("Display help message", () => {
    expect(validator.validateCommand("jobs -h")).toBe(true);
  });

  test("Invalid option usage", () => {
    expect(validator.validateCommand("jobs --invalid-option")).toBe(false);
  });

  test("Invalid: List jobs with PID argument", () => {
    expect(validator.validateCommand("jobs 1234")).toBe(false);
  });

  test("Invalid: List jobs with option after argument", () => {
    expect(validator.validateCommand("jobs 1234 -p")).toBe(false);
  });

  test("List jobs with additional valid options", () => {
    expect(validator.validateCommand("jobs -c -p")).toBe(true);
  });
});