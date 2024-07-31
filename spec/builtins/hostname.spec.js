import { HostnameFSM, hostnameTestCases } from "../../src/builtins/hostname.js";
import { execSync } from "child_process";
import os from "os";

describe("HostnameFSM", () => {
  let fsm;
  let originalHostname;

  beforeAll(() => {
    originalHostname = os.hostname();
  });

  afterAll(() => {
    if (process.getuid() === 0) {
      // Only run if root
      execSync(`hostname ${originalHostname}`);
    }
  });

  beforeEach(() => {
    fsm = new HostnameFSM();
  });

  hostnameTestCases.forEach(({ description, input, expectedOutput }) => {
    test(description, () => {
      expect(fsm.isValid(input)).toBe(expectedOutput);
    });
  });

  test("hostname basic execution", () => {
    const command = "hostname";
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toBe(originalHostname);
  });

  test("hostname with -f option", () => {
    const command = "hostname -f";
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toContain(".");
  });

  test("hostname with -i option", () => {
    const command = "hostname -i";
    expect(fsm.isValid(command)).toBe(true);

    const output = execSync(command).toString().trim();
    expect(output).toMatch(/^(\d{1,3}\.){3}\d{1,3}$/);
  });

  test("hostname set new hostname", () => {
    const newHostname = "newhostname-test";
    const command = `hostname ${newHostname}`;
    expect(fsm.isValid(command)).toBe(true);

    if (process.getuid() === 0) {
      // Only run if root
      execSync(command);
      const output = execSync("hostname").toString().trim();
      expect(output).toBe(newHostname);
    } else {
      console.warn("Test skipped: requires root privileges");
    }
  });

  test("hostname with invalid option", () => {
    const command = "hostname -z";
    expect(fsm.isValid(command)).toBe(true); // The FSM allows invalid options

    expect(() => execSync(command)).toThrow();
  });
});
