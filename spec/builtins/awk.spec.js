 import { CommandValidator } from "../../src/cmd-validator.js";

describe("awk command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic awk", () => {
    expect(validator.validateCommand("awk '{print $1}'")).toBe(true);
  });

  test("awk with input file", () => {
    expect(validator.validateCommand("awk '{print $1}' file.txt")).toBe(true);
  });

  test("awk with field separator", () => {
    expect(validator.validateCommand("awk -F ',' '{print $2}' file.csv")).toBe(true);
  });

  test("awk with program file option", () => {
    expect(validator.validateCommand("awk -f program.awk input.txt")).toBe(true);
  });

  test("awk with variable assignment", () => {
    expect(validator.validateCommand("awk -v var=value '{print var}'")).toBe(true);
  });

  test("awk with compatibility mode", () => {
    expect(validator.validateCommand("awk -W traditional '{print $1}'")).toBe(true);
  });

  test("awk with lint warnings", () => {
    expect(validator.validateCommand("awk -W lint '{print $1}'")).toBe(true);
  });

  test("awk with POSIX mode", () => {
    expect(validator.validateCommand("awk -W posix '{print $1}'")).toBe(true);
  });

  test("awk with interval expressions", () => {
    expect(validator.validateCommand("awk -W re-interval '{print $1}'")).toBe(true);
  });

  test("awk with source code", () => {
    expect(validator.validateCommand("awk --source='{print $1}' input.txt")).toBe(true);
  });

  test("Invalid: awk with unmatched quote", () => {
    expect(validator.validateCommand("awk '{print $1")).toBe(false);
  });

  test("Invalid: awk with space before option", () => {
    expect(validator.validateCommand(" awk '{print $1}'")).toBe(false);
  });

  test("awk with no input file", () => {
    expect(validator.validateCommand("awk '{print $1}'")).toBe(true);
  });

  test("awk with multiple commands", () => {
    expect(validator.validateCommand("awk '{print $1; print $2}' file.txt")).toBe(true);
  });

  test("awk with command line and program file", () => {
    expect(validator.validateCommand("awk -f program.awk '{print $1}' file.txt")).toBe(true);
  });

  test("awk with examples from documentation", () => {
    expect(validator.validateCommand("awk '{sum += $1} END {print sum}' file.txt")).toBe(true);
  });
});
