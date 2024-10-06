import { CommandValidator } from "../../src/cmd-validator.js";

describe("uniq command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic uniq", () => {
    expect(validator.validateCommand("uniq file.txt")).toBe(true);
  });

  test("uniq with count option", () => {
    expect(validator.validateCommand("uniq -c file.txt")).toBe(true);
  });

  test("uniq with unique option", () => {
    expect(validator.validateCommand("uniq -u file.txt")).toBe(true);
  });

  test("uniq with repeated option", () => {
    expect(validator.validateCommand("uniq -d file.txt")).toBe(true);
  });

  test("uniq with skip fields option", () => {
    expect(validator.validateCommand("uniq -f 2 file.txt")).toBe(true);
  });

  test("uniq with ignore case option", () => {
    expect(validator.validateCommand("uniq -i file.txt")).toBe(true);
  });

  test("uniq with skip chars option", () => {
    expect(validator.validateCommand("uniq -s 3 file.txt")).toBe(true);
  });

  test("uniq with check chars option", () => {
    expect(validator.validateCommand("uniq -w 5 file.txt")).toBe(true);
  });

  test("uniq with zero terminated option", () => {
    expect(validator.validateCommand("uniq -z file.txt")).toBe(true);
  });

  test("uniq with all repeated option", () => {
    expect(validator.validateCommand("uniq -D file.txt")).toBe(true);
  });

  test("uniq with group option", () => {
    expect(validator.validateCommand("uniq --group file.txt")).toBe(true);
  });

  test("uniq with output redirection", () => {
    expect(validator.validateCommand("uniq file.txt output.txt")).toBe(true);
  });

  test("Invalid: uniq with unmatched option", () => {
    expect(validator.validateCommand("uniq --invalid-option file.txt")).toBe(false);
  });

  test("Invalid: uniq with typo", () => {
    expect(validator.validateCommand("uniqq file.txt")).toBe(false);
  });

   test("Invalid: uniq without atgument", () => {
    expect(validator.validateCommand("uniq")).toBe(false);
  });

  test("uniq with space before command", () => {
    expect(validator.validateCommand(" uniq file.txt")).toBe(true);
  });

  test("uniq with help option", () => {
    expect(validator.validateCommand("uniq --help")).toBe(true);
  });

  test("uniq with version option", () => {
    expect(validator.validateCommand("uniq --version")).toBe(true);
  });

  test("uniq with multiple options", () => {
    expect(validator.validateCommand("uniq -c -i file.txt")).toBe(true);
  });

  test("uniq with all repeated option and method", () => {
    expect(validator.validateCommand("uniq --all-repeated=prepend file.txt")).toBe(true);
  });
});