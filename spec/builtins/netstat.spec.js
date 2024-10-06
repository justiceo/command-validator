import { CommandValidator } from "../../src/cmd-validator.js";

describe("netstat command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic netstat", () => {
    expect(validator.validateCommand("netstat")).toBe(true);
  });

  test("netstat with route option", () => {
    expect(validator.validateCommand("netstat -r")).toBe(true);
  });

  test("netstat with all option", () => {
    expect(validator.validateCommand("netstat -a")).toBe(true);
  });

  test("netstat with listening option", () => {
    expect(validator.validateCommand("netstat -l")).toBe(true);
  });

  test("netstat with numeric addresses option", () => {
    expect(validator.validateCommand("netstat -n")).toBe(true);
  });

  test("netstat with verbose option", () => {
    expect(validator.validateCommand("netstat -v")).toBe(true);
  });

  test("netstat with program option", () => {
    expect(validator.validateCommand("netstat -p")).toBe(true);
  });

  test("netstat with continuous output option", () => {
    expect(validator.validateCommand("netstat -c")).toBe(true);
  });

  test("netstat with extended output option", () => {
    expect(validator.validateCommand("netstat -e")).toBe(true);
  });

  test("netstat with timers option", () => {
    expect(validator.validateCommand("netstat -o")).toBe(true);
  });

  test("netstat with protocol family option", () => {
    expect(validator.validateCommand("netstat --protocol=inet")).toBe(true);
  });

  test("netstat with address family option", () => {
    expect(validator.validateCommand("netstat --unix")).toBe(true);
  });

  test("Invalid: netstat with invalid option", () => {
    expect(validator.validateCommand("netstat --invalid-option")).toBe(false);
  });

  test("Invalid: netstat with typo", () => {
    expect(validator.validateCommand("nettstat -o")).toBe(false);
  });

  test("Invalid: netstat with incorrect TCP protocol", () => {
    expect(validator.validateCommand("netstat --tcp")).toBe(false);
  });

  test("Invalid: netstat with incorrect UPP protocol", () => {
    expect(validator.validateCommand("netstat --udp")).toBe(false);
  });


  test("Invalid: netstat with space before option", () => {
    expect(validator.validateCommand(" netstat -a")).toBe(false);
  });

  test("Invalid: netstat with unmatched quote", () => {
    expect(validator.validateCommand("netstat 'unmatched")).toBe(false);
  });

  test("netstat with multiple options", () => {
    expect(validator.validateCommand("netstat -t -u -l")).toBe(true);
  });

  test("netstat with continuous option and delay", () => {
    expect(validator.validateCommand("netstat -c 5")).toBe(true);
  });
});