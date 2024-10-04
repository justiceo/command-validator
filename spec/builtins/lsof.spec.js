import { CommandValidator } from "../../src/cmd-validator.js";

describe("lsof command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("List all open files", () => {
    expect(validator.validateCommand("lsof")).toBe(true);
  });

  test("List open files for a specific user", () => {
    expect(validator.validateCommand("lsof -u username")).toBe(true);
  });

  test("List open files for a specific PID", () => {
    expect(validator.validateCommand("lsof -p 1234")).toBe(true);
  });

  test("List internet files matching a specific address", () => {
    expect(validator.validateCommand("lsof -i :80")).toBe(true);
  });

  test("Verbose output with version information", () => {
    expect(validator.validateCommand("lsof -v")).toBe(true);
  });

  test("Exclude conversion of network numbers", () => {
    expect(validator.validateCommand("lsof -n")).toBe(true);
  });

  test("List files for processes executing a specific command", () => {
    expect(validator.validateCommand("lsof -c process_name")).toBe(true);
  });

  test("Invalid: Exclude non-existent PID", () => {
    expect(validator.validateCommand("lsof -p invalid_pid")).toBe(false);
  });

  test("Invalid: Unsupported option", () => {
    expect(validator.validateCommand("lsof -unsupported_option")).toBe(false);
  });

  test("Invalid: Missing arguments", () => {
    expect(validator.validateCommand("lsof -u")).toBe(false);
  });

   test("Invalid: Typo in command", () => {
    expect(validator.validateCommand("lssof -v")).toBe(false);
  });

  test("List open files for specific filenames", () => {
    expect(validator.validateCommand("lsof /path/to/file")).toBe(true);
  });
});
