import { CommandValidator } from "../../src/cmd-validator.js";

describe("ping command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic ping", () => {
    expect(validator.validateCommand("ping google.com")).toBe(true);
  });

  test("ping with count option", () => {
    expect(validator.validateCommand("ping -c 4 192.168.1.1")).toBe(true);
  });

  test("ping with audible option", () => {
    expect(validator.validateCommand("ping -a google.com")).toBe(true);
  });

  test("ping with adaptive option", () => {
    expect(validator.validateCommand("ping -A google.com")).toBe(true);
  });

  test("ping with broadcast option", () => {
    expect(validator.validateCommand("ping -b 192.168.1.255")).toBe(true);
  });

  test("ping with flood option", () => {
    expect(validator.validateCommand("ping -f google.com")).toBe(true);
  });

  test("ping with numeric output option", () => {
    expect(validator.validateCommand("ping -n google.com")).toBe(true);
  });

  test("ping with verbose option", () => {
    expect(validator.validateCommand("ping -v google.com")).toBe(true);
  });

  test("ping with timeout option", () => {
    expect(validator.validateCommand("ping -W 2 google.com")).toBe(true);
  });

  test("ping with interface option", () => {
    expect(validator.validateCommand("ping -I eth0 google.com")).toBe(true);
  });

  test("ping with data size option", () => {
    expect(validator.validateCommand("ping -s 100 google.com")).toBe(true);
  });

  test("ping with TTL option", () => {
    expect(validator.validateCommand("ping -t 64 google.com")).toBe(true);
  });

  test("ping with help option", () => {
    expect(validator.validateCommand("ping --help")).toBe(true);
  });

  test("ping with version option", () => {
    expect(validator.validateCommand("ping --version")).toBe(true);
  });

  test("Invalid: ping with invalid option", () => {
    expect(validator.validateCommand("ping --invalid-option google.com")).toBe(false);
  });

  test("Invalid: ping with space before option", () => {
    expect(validator.validateCommand(" ping -c 4 google.com")).toBe(false);
  });

  test("Invalid: ping with unmatched quote", () => {
    expect(validator.validateCommand("ping 'unmatched")).toBe(false);
  });

  test("ping with multiple options", () => {
    expect(validator.validateCommand("ping -c 4 -n google.com")).toBe(true);
  });

  test("ping with combination of options", () => {
    expect(validator.validateCommand("ping -A -f google.com")).toBe(true);
  });
});
