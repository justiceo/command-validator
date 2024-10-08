import { CommandValidator } from "../../src/cmd-validator.js";

describe("df command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display disk space for all mounted filesystems", () => {
    expect(validator.validateCommand('df')).toBe(true);
  });

  test("Display disk space in human-readable format", () => {
    expect(validator.validateCommand('df -h')).toBe(true);
  });

  test("Display disk space using SI units", () => {
    expect(validator.validateCommand('df -H')).toBe(true);
  });

  test("List inode usage information", () => {
    expect(validator.validateCommand('df -i')).toBe(true);
  });

  test("Print sizes in kilobytes", () => {
    expect(validator.validateCommand('df -k')).toBe(true);
  });

  test("Limit listing to local filesystems", () => {
    expect(validator.validateCommand('df -l')).toBe(true);
  });

  test("Print sizes in megabytes", () => {
    expect(validator.validateCommand('df -m')).toBe(true);
  });

  test("Use POSIX output format", () => {
    expect(validator.validateCommand('df -P')).toBe(true);
  });

  test("Exclude filesystems of a specific type", () => {
    expect(validator.validateCommand('df -x tmpfs')).toBe(true);
  });

  test("Limit listing to a specific filesystem type", () => {
    expect(validator.validateCommand('df -t ext4')).toBe(true);
  });

  test("Print each filesystem’s type", () => {
    expect(validator.validateCommand('df -T')).toBe(true);
  });

  test("Include all filesystems, including those with size 0", () => {
    expect(validator.validateCommand('df -a')).toBe(true);
  });

  test("Invoke sync system call before getting usage data", () => {
    expect(validator.validateCommand('df --sync')).toBe(true);
  });

  test("Do not invoke sync system call", () => {
    expect(validator.validateCommand('df --no-sync')).toBe(true);
  });

  test("Do not invoke sync system call", () => {
    expect(validator.validateCommand('dff -a')).toBe(false);
  });
});
