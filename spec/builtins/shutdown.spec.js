import { CommandValidator } from "../../src/cmd-validator.js";

describe("shutdown command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Shutdown immediately", () => {
    expect(validator.validateCommand("shutdown -h now")).toBe(true);
  });

  test("Shutdown with a time delay", () => {
    expect(validator.validateCommand("shutdown +10")).toBe(true);
  });

  test("Reboot after a specified time", () => {
    expect(validator.validateCommand("shutdown -r +5")).toBe(true);
  });

  test("Shutdown with a message", () => {
    expect(validator.validateCommand("shutdown -r +10 \"Rebooting for maintenance\"")).toBe(true);
  });

  test("Cancel a shutdown", () => {
    expect(validator.validateCommand("shutdown -c")).toBe(true);
  });

  test("Shutdown with no arguments", () => {
    expect(validator.validateCommand("shutdown")).toBe(true);
  });

  test("Invalid: Shutdown with incorrect time format", () => {
    expect(validator.validateCommand("shutdown +abc")).toBe(false);
  });
   test("Invalid: Shutdown with a typo", () => {
    expect(validator.validateCommand("shuutdown -c")).toBe(false);
  });

  test("Invalid: Shutdown with negative time", () => {
    expect(validator.validateCommand("shutdown -5")).toBe(false);
  });

  test("Invalid: Shutdown with non-numeric value", () => {
    expect(validator.validateCommand("shutdown now 5")).toBe(false);
  });

  test("Invalid: Shutdown with unsupported option", () => {
    expect(validator.validateCommand("shutdown -x now")).toBe(false);
  });
});