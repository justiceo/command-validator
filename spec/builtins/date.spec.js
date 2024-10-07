import { CommandValidator } from "../../src/cmd-validator.js";

describe("date command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic date command without arguments", () => {
    expect(validator.validateCommand("date")).toBe(true);
  });

  test("date with format string", () => {
    expect(validator.validateCommand("date +%Y-%m-%d")).toBe(true);
  });

  test("date with -d option", () => {
    expect(validator.validateCommand("date -d 'yesterday'")).toBe(true);
  });

  test("date with -I option", () => {
    expect(validator.validateCommand("date -I")).toBe(true);
    expect(validator.validateCommand("date -I seconds")).toBe(true);
  });

  test("date with -r option", () => {
    expect(validator.validateCommand("date -r file.txt")).toBe(true);
  });

  test("date with -R option", () => {
    expect(validator.validateCommand("date -R")).toBe(true);
  });

  test("date with --rfc-3339 option", () => {
    expect(validator.validateCommand("date --rfc-3339=date")).toBe(true);
  });

  test("Invalid: with reference to non existent file", () => {
    expect(validator.validateCommand("date --reference=non_existent_file")).toBe(false);
  });

   test("Invalid: with improper field option declaration", () => {
    expect(validator.validateCommand("date date --reference=file5.txt -f")).toBe(false);
  });

  test("date with -s option to set time", () => {
    expect(validator.validateCommand("date -s '2024-01-01 10:00:00'")).toBe(true);
  });

  test("date with -u option for UTC", () => {
    expect(validator.validateCommand("date -u")).toBe(true);
  });

  test("Invalid: date with wrong option declarator", () => {
    expect(validator.validateCommand("date --d "2024-10-4")).toBe(false);
  });

  test("Invalid: date with unmatched quote", () => {
    expect(validator.validateCommand("date -d 'tomorrow")).toBe(false);
  });

  test("date with --version option", () => {
    expect(validator.validateCommand("date --version")).toBe(true);
  });

  test("date with --help option", () => {
    expect(validator.validateCommand("date --help")).toBe(true);
  });

  test("date with multiple options", () => {
    expect(validator.validateCommand("date -u -d 'now'")).toBe(true);
  });

  test("date with file input for -f option", () => {
    expect(validator.validateCommand("date -f dates.txt")).toBe(true);
  });

  test("Invalid: date with no arguments", () => {
    expect(validator.validateCommand("date")).toBe(true);
  });
});