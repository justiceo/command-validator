import { CommandValidator } from "../../src/cmd-validator.js";

describe("xargs command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic xargs with input", () => {
    expect(validator.validateCommand("echo 'file.txt' | xargs cat")).toBe(true);
  });

  test("xargs with argument file option", () => {
    expect(validator.validateCommand("xargs --arg-file=arguments.txt")).toBe(true);
  });

  test("xargs with null termination", () => {
    expect(validator.validateCommand("find . -print0 | xargs -0 echo")).toBe(true);
  });

  test("xargs with custom delimiter", () => {
    expect(validator.validateCommand("echo 'file1,file2' | xargs -d ',' cat")).toBe(true);
  });

  test("xargs with max arguments", () => {
    expect(validator.validateCommand("echo 'arg1 arg2' | xargs -n 1 echo")).toBe(true);
  });

  test("xargs with interactive prompt", () => {
    expect(validator.validateCommand("echo 'file.txt' | xargs -p cat")).toBe(true);
  });

  test("xargs with no run if empty option", () => {
    expect(validator.validateCommand("echo '' | xargs --no-run-if-empty echo")).toBe(true);
  });

  test("xargs with verbose option", () => {
    expect(validator.validateCommand("echo 'file.txt' | xargs -t cat")).toBe(true);
  });

  test("xargs with multiple commands", () => {
    expect(validator.validateCommand("find . -type f | xargs -n 1 wc -l")).toBe(true);
  });

  test("Invalid: xargs with unmatched quote", () => {
    expect(validator.validateCommand("echo 'file.txt | xargs cat")).toBe(false);
  });

  test("xargs with space before option", () => {
    expect(validator.validateCommand(" xargs -n 1 echo")).toBe(true);
  });

  test("Invalid: xargs without argument", () => {
    expect(validator.validateCommand("xargs")).toBe(false);
  });

  test("Invalid: xargs with typo", () => {
    expect(validator.validateCommand(" xarggs --help")).toBe(false);
  });

  test("xargs with show limits option", () => {
    expect(validator.validateCommand("xargs --show-limits")).toBe(true);
  });

  test("xargs with version option", () => {
    expect(validator.validateCommand("xargs --version")).toBe(true);
  });

  test("xargs with help option", () => {
    expect(validator.validateCommand("xargs --help")).toBe(true);
  });

  test("xargs with maximum processes", () => {
    expect(validator.validateCommand("echo 'file.txt' | xargs -P 4 cat")).toBe(true);
  });
});