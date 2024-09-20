import { CommandValidator } from "../../src/cmd-validator.js";

describe("ip command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Show IP addresses", () => {
    expect(validator.validateCommand("ip addr")).toBe(true);
  });

  test("Show routing table", () => {
    expect(validator.validateCommand("ip route show")).toBe(true);
  });

  test("Show statistics with human-readable values", () => {
    expect(validator.validateCommand("ip -h addr")).toBe(true);
  });

  test("Use batch mode", () => {
    expect(validator.validateCommand("ip -b batchfile.txt")).toBe(true);
  });

  test("Force batch execution without termination on errors", () => {
    expect(validator.validateCommand("ip -force -b batchfile.txt")).toBe(true);
  });

  test("Show details of addresses", () => {
    expect(validator.validateCommand("ip -d addr")).toBe(true);
  });

  test("Switch to a specific network namespace", () => {
    expect(validator.validateCommand("ip -n mynamespace addr")).toBe(true);
  });

  test("Output in JSON format", () => {
    expect(validator.validateCommand("ip -j addr")).toBe(true);
  });

  test("Show only brief information", () => {
    expect(validator.validateCommand("ip -br addr show")).toBe(true);
  });

  test("Display version", () => {
    expect(validator.validateCommand("ip -V")).toBe(true);
  });

  test("Invalid command usage", () => {
    expect(validator.validateCommand("ip --invalid-option")).toBe(false);
  });

  test("Check for valid combinations of options", () => {
    expect(validator.validateCommand("ip -s -d addr")).toBe(true);
  });
});
