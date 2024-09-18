import { CommandValidator } from "../../src/cmd-validator.js";

describe("wget command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic wget with URL", () => {
    expect(validator.validateCommand("wget http://example.com/file")).toBe(true);
  });

  test("wget with -V option", () => {
    expect(validator.validateCommand("wget -V")).toBe(true);
  });

  test("wget with -h option", () => {
    expect(validator.validateCommand("wget --help")).toBe(true);
  });

  test("wget in background", () => {
    expect(validator.validateCommand("wget -b http://example.com/file")).toBe(true);
  });

  test("wget with output file option", () => {
    expect(validator.validateCommand("wget -o log.txt http://example.com/file")).toBe(true);
  });

  test("wget with multiple URLs", () => {
    expect(validator.validateCommand("wget http://example.com/file1 http://example.com/file2")).toBe(true);
  });

  test("wget with input file", () => {
    expect(validator.validateCommand("wget -i urls.txt")).toBe(true);
  });

  test("wget with continue option", () => {
    expect(validator.validateCommand("wget -c http://example.com/file")).toBe(true);
  });

  test("Invalid: wget with unmatched quotes", () => {
    expect(validator.validateCommand("wget 'http://example.com/file")).toBe(false);
  });

  test("Invalid: wget with invalid option", () => {
    expect(validator.validateCommand("wget --invalid-option")).toBe(false);
  });

  test("wget with wait between downloads", () => {
    expect(validator.validateCommand("wget -w 2 http://example.com/file")).toBe(true);
  });

  test("wget with no proxy option", () => {
    expect(validator.validateCommand("wget --no-proxy http://example.com/file")).toBe(true);
  });

  test("wget with multiple options", () => {
    expect(validator.validateCommand("wget -q -O output.txt http://example.com/file")).toBe(true);
  });

  test("wget with forced HTML input", () => {
    expect(validator.validateCommand("wget -F -i input.html")).toBe(true);
  });

  test("wget with timestamping", () => {
    expect(validator.validateCommand("wget -N http://example.com/file")).toBe(true);
  });
});
