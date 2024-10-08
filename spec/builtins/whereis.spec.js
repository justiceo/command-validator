import { CommandValidator } from "../../src/cmd-validator.js";

describe("whereis command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic whereis", () => {
    expect(validator.validateCommand("whereis ls")).toBe(true);
  });

  test("whereis with binaries option", () => {
    expect(validator.validateCommand("whereis -b ls")).toBe(true);
  });

  test("whereis with manuals option", () => {
    expect(validator.validateCommand("whereis -m ls")).toBe(true);
  });

  test("whereis with sources option", () => {
    expect(validator.validateCommand("whereis -s ls")).toBe(true);
  });

  test("whereis with unusual entries option", () => {
    expect(validator.validateCommand("whereis -u ls")).toBe(true);
  });

  test("whereis with custom binaries directory", () => {
    expect(validator.validateCommand("whereis -B /usr/local/bin ls")).toBe(true);
  });

  test("whereis with custom manuals directory", () => {
    expect(validator.validateCommand("whereis -M /usr/local/share/man ls")).toBe(true);
  });

  test("whereis with custom sources directory", () => {
    expect(validator.validateCommand("whereis -S /usr/local/src ls")).toBe(true);
  });

  test("whereis with file termination option", () => {
    expect(validator.validateCommand("whereis -B /usr/local/bin -f ls")).toBe(true);
  });

  test("whereis with output effective lookup paths", () => {
    expect(validator.validateCommand("whereis -l")).toBe(true);
  });

  test("whereis with glob pattern option", () => {
    expect(validator.validateCommand("whereis -g '*.py'")).toBe(true);
  });

  test("whereis with help option", () => {
    expect(validator.validateCommand("whereis --help")).toBe(true);
  });

  test("whereis with version option", () => {
    expect(validator.validateCommand("whereis --version")).toBe(true);
  });

  test("Invalid: whereis with extra arguments", () => {
    expect(validator.validateCommand("whereis ls extra")).toBe(false);
  });

  test("Invalid: whereis with space before command", () => {
    expect(validator.validateCommand(" whereis ls")).toBe(false);
  });
});
