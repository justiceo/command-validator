import { CommandValidator } from "../../src/cmd-validator.js";

describe("cut command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic cut", () => {
    expect(validator.validateCommand("cut")).toBe(false);
  });

  test("cut with option -b", () => {
    expect(validator.validateCommand("cut -b 1,2,3")).toBe(true);
  });

  test("cut with option -c", () => {
    expect(validator.validateCommand("cut -c 1-5")).toBe(true);
  });

  test("cut with option -f", () => {
    expect(validator.validateCommand("cut -f 2")).toBe(true);
  });

  test("cut with option -d", () => {
    expect(validator.validateCommand("cut -d ';' -f 2")).toBe(true);
  });

  test("Invalid: cut with complex options", () => {
    expect(validator.validateCommand("cut -b 1-5 -d ';' -f 2")).toBe(false);
  });

   test("cut with no fields", () => {
    expect(validator.validateCommand("cut -f 0 myfile.txt")).toBe(false);
  });

  test("cut with input file", () => {
    expect(validator.validateCommand("cut -f 2 myfile.txt")).toBe(true);
  });

  test("cut with multiple input files", () => {
    expect(validator.validateCommand("cut -f 2 myfile.txt yourfile.txt")).toBe(true);
  });

   test("cut with complex options", () => {
    expect(validator.validateCommand("cut -b 1-5 -d 'dir' -f 2 myfile.txt")).toBe(false);
  });

   test("cut with no input file", () => {
    expect(validator.validateCommand("cut -f 2")).toBe(false);
  });

  test("cut with standard input", () => {
    expect(validator.validateCommand("cat myfile.txt | cut -f 2")).toBe(true);
  });

  test("cut with output delimiter", () => {
    expect(validator.validateCommand("cut -f 1,2 --output-delimiter=',' myfile.txt")).toBe(true);
  });

  test("cut with no fields", () => {
    expect(validator.validateCommand("cut -f 0 myfile.txt")).toBe(false);
  });

  test("Invalid: cut with unmatched quote", () => {
    expect(validator.validateCommand("cut -f 'unmatched")).toBe(false);
  });

  test("cut with space before option", () => {
    expect(validator.validateCommand(" cut -b file.txt")).toBe(true);
  });

  test("cut with typo", () => {
    expect(validator.validateCommand("cutt -b file.txt")).toBe(false);
  });

  test("cut with invalid option", () => {
    expect(validator.validateCommand("cut --invalid-option")).toBe(false);
  });

  test("cut with multiple input delimiters", () => {
    expect(validator.validateCommand("cut -d ';' -d ',' -f 2 myfile.txt")).toBe(true);
  });

  test("cut with option and no input file", () => {
    expect(validator.validateCommand("cut -f 2")).toBe(true);
  });
});