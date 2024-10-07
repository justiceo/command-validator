import { CommandValidator } from "../../src/cmd-validator.js";

describe("uptime command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    validator = null; // Clear the validator instance
  });

  test("Basic uptime command", () => {
    expect(validator.validateCommand("uptime")).toBe(true);
  });

  test("uptime with pretty option", () => {
    expect(validator.validateCommand("uptime -p")).toBe(true);
  });

  test("uptime with container option", () => {
    expect(validator.validateCommand("uptime -c")).toBe(true);
  });

  test("uptime with raw option", () => {
    expect(validator.validateCommand("uptime -r")).toBe(true);
  });

  test("uptime with since option", () => {
    expect(validator.validateCommand("uptime -s")).toBe(true);
  });

  test("uptime with help option", () => {
    expect(validator.validateCommand("uptime -h")).toBe(true);
  });

  test("uptime with version option", () => {
    expect(validator.validateCommand("uptime -V")).toBe(true);
  });

  test("Invalid: uptime with extra arguments", () => {
    expect(validator.validateCommand("uptime extra")).toBe(false);
  });

  test("Invalid: uptime with invalid option", () => {
    expect(validator.validateCommand("uptime --invalid-option")).toBe(false);
  });

   test("Invalid: uptime with invalid argument", () => {
    expect(validator.validateCommand("uptime file.txt")).toBe(false);
  });
   test("Invalid: uptime with typo", () => {
    expect(validator.validateCommand("uptimee -s")).toBe(false);
  });
  test("Invalid: uptime option without declarator", () => {
    expect(validator.validateCommand("uptimee s")).toBe(false);
  });
});