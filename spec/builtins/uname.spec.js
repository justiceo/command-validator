import { CommandValidator } from "../../src/cmd-validator.js";

describe("uname command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic uname", () => {
    expect(validator.validateCommand("uname")).toBe(true);
  });

  test("uname with kernel release option", () => {
    expect(validator.validateCommand("uname -r")).toBe(true);
  });

  test("uname with kernel name option", () => {
    expect(validator.validateCommand("uname -s")).toBe(true);
  });

  test("uname with nodename option", () => {
    expect(validator.validateCommand("uname -n")).toBe(true);
  });

  test("uname with kernel version option", () => {
    expect(validator.validateCommand("uname -v")).toBe(true);
  });

  test("uname with machine option", () => {
    expect(validator.validateCommand("uname -m")).toBe(true);
  });

  test("uname with processor option", () => {
    expect(validator.validateCommand("uname -p")).toBe(true);
  });

  test("uname with hardware platform option", () => {
    expect(validator.validateCommand("uname -i")).toBe(true);
  });

  test("uname with operating system option", () => {
    expect(validator.validateCommand("uname -o")).toBe(true);
  });

  test("uname with all option", () => {
    expect(validator.validateCommand("uname -a")).toBe(true);
  });

  test("uname with help option", () => {
    expect(validator.validateCommand("uname --help")).toBe(true);
  });

  test("uname with version option", () => {
    expect(validator.validateCommand("uname --version")).toBe(true);
  });

  test("Invalid: uname with unmatched option", () => {
    expect(validator.validateCommand("uname --invalid-option")).toBe(false);
  });

  test("Invalid: uname with typo", () => {
    expect(validator.validateCommand(" unamme")).toBe(false);
  });

  test("uname with space before command", () => {
    expect(validator.validateCommand(" uname")).toBe(true);

  test("uname with multiple options", () => {
    expect(validator.validateCommand("uname -a -m")).toBe(true);
  });
});
