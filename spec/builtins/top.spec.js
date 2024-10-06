  import { CommandValidator } from "../../src/cmd-validator.js";

describe("top command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic top command", () => {
    expect(validator.validateCommand("top")).toBe(true);
  });

  test("top with batch mode option", () => {
    expect(validator.validateCommand("top -b")).toBe(true);
  });

  test("top with command line display option", () => {
    expect(validator.validateCommand("top -c")).toBe(true);
  });

  test("top with delay option", () => {
    expect(validator.validateCommand("top -d 5")).toBe(true);
  });

  test("top with suppress idle processes option", () => {
    expect(validator.validateCommand("top -i")).toBe(true);
  });

  test("top with update count option", () => {
    expect(validator.validateCommand("top -n 10")).toBe(true);
  });

  test("top with specific PID option", () => {
    expect(validator.validateCommand("top -p 1234")).toBe(true);
  });

  test("top with refresh without delay option", () => {
    expect(validator.validateCommand("top -q")).toBe(true);
  });

  test("top with secure mode option", () => {
    expect(validator.validateCommand("top -s")).toBe(true);
  });

  test("top with cumulative mode option", () => {
    expect(validator.validateCommand("top -S")).toBe(true);
  });

  test("Invalid: top with unknown option", () => {
    expect(validator.validateCommand("top --unknown-option")).toBe(false);
  });

  test("top with space before command", () => {
    expect(validator.validateCommand("top  -d 5")).toBe(true);
  });

  test("top with multiple options", () => {
    expect(validator.validateCommand("top -b -d 1 -n 5")).toBe(true);
  });

  test("Invalid: top with unmatched quotes", () => {
    expect(validator.validateCommand("top -c 'some command")).toBe(false);
  });

  test("top with username filter option", () => {
    expect(validator.validateCommand("top -u username")).toBe(true);
  });

  test("Invalid: top with negative delay", () => {
    expect(validator.validateCommand("top -d -5")).toBe(false);
  });

  test("top with interactive command 'k'", () => {
    expect(validator.validateCommand("top k")).toBe(true);
  });

  test("Invalid: top with interactive command 'r' in secure mode", () => {
    expect(validator.validateCommand("top -s r")).toBe(false);
  });

   test("Invalid: top with comma in arguments", () => {
    expect(validator.validateCommand("top -p PID1,PID2,PID3")).toBe(false);
  });

   test("Invalid: top with typo", () => {
    expect(validator.validateCommand("topp")).toBe(false);
  });

  test("top with interactive command 'm'", () => {
    expect(validator.validateCommand("top m")).toBe(true);
  });
});
