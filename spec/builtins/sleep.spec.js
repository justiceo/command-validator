import { CommandValidator } from "../../src/cmd-validator.js";

describe("sleep command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Sleep for a specified number of seconds", () => {
    expect(validator.validateCommand("sleep 10")).toBe(true);
  });

  test("Sleep for a specified number of minutes", () => {
    expect(validator.validateCommand("sleep 5m")).toBe(true);
  });

  test("Sleep for a specified number of hours", () => {
    expect(validator.validateCommand("sleep 2h")).toBe(true);
  });

  test("Sleep for a specified number of days", () => {
    expect(validator.validateCommand("sleep 1d")).toBe(true);
  });

  test("Invalid: sleep with no time specified", () => {
    expect(validator.validateCommand("sleep")).toBe(false);
  });

  test("Invalid: sleep with invalid time format", () => {
    expect(validator.validateCommand("sleep 5x")).toBe(false);
  });
  
  test("Invalid: sleep with typo", () => {
    expect(validator.validateCommand("sleeep 5")).toBe(false);
  });

  test("Invalid: sleep with negative time", () => {
    expect(validator.validateCommand("sleep -10")).toBe(false);
  });

  test("Invalid: sleep with non-numeric value", () => {
    expect(validator.validateCommand("sleep abc")).toBe(false);
  });
});