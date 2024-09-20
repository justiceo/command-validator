import { CommandValidator } from "../../src/cmd-validator.js";

describe("ssh command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic ssh command", () => {
    expect(validator.validateCommand("ssh user@remote")).toBe(true);
  });

  test("Specify port", () => {
    expect(validator.validateCommand("ssh -p 2222 user@remote")).toBe(true);
  });

  test("Enable X11 forwarding", () => {
    expect(validator.validateCommand("ssh -X user@remote")).toBe(true);
  });

  test("Verbose mode", () => {
    expect(validator.validateCommand("ssh -v user@remote")).toBe(true);
  });

  test("Request a remote command execution", () => {
    expect(validator.validateCommand("ssh user@remote 'ls -la'")).toBe(true);
  });

  test("Specify identity file", () => {
    expect(validator.validateCommand("ssh -i /path/to/key user@remote")).toBe(true);
  });

  test("Request compression", () => {
    expect(validator.validateCommand("ssh -C user@remote")).toBe(true);
  });

  test("Control socket for connection sharing", () => {
    expect(validator.validateCommand("ssh -S /tmp/socket user@remote")).toBe(true);
  });

  test("Run in the background", () => {
    expect(validator.validateCommand("ssh -f user@remote")).toBe(true);
  });

  test("Display version information", () => {
    expect(validator.validateCommand("ssh -V")).toBe(true);
  });

  test("Invalid: ssh without user or hostname", () => {
    expect(validator.validateCommand("ssh")).toBe(false);
  });

  test("Invalid: ssh with unknown option", () => {
    expect(validator.validateCommand("ssh --unknown-option")).toBe(false);
  });

  test("Invalid: ssh with unmatched quotes", () => {
    expect(validator.validateCommand("ssh user@remote 'ls -la")).toBe(false);
  });

  test("Invalid: specify user without hostname", () => {
    expect(validator.validateCommand("ssh user@")).toBe(false);
  });
});
