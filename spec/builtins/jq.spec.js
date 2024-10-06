import { CommandValidator } from "../../src/cmd-validator.js";

describe("jq command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic jq command", () => {
    expect(validator.validateCommand("jq .")).toBe(true);
  });

  test("Run jq with a filter", () => {
    expect(validator.validateCommand("jq 'map(.price)' input.json")).toBe(true);
  });

  test("Run jq with null input", () => {
    expect(validator.validateCommand("jq -n")).toBe(true);
  });

  test("Use raw input mode", () => {
    expect(validator.validateCommand("jq -R 'length' input.txt")).toBe(true);
  });

  test("Slurp mode", () => {
    expect(validator.validateCommand("jq -s . input1.json input2.json")).toBe(true);
  });

  test("Compact output", () => {
    expect(validator.validateCommand("jq -c . input.json")).toBe(true);
  });

  test("Raw output", () => {
    expect(validator.validateCommand("jq -r '.name' input.json")).toBe(true);
  });

  test("Sort keys", () => {
    expect(validator.validateCommand("jq -S . input.json")).toBe(true);
  });

  test("Specify indentation", () => {
    expect(validator.validateCommand("jq --indent 4 . input.json")).toBe(true);
  });

  test("Use from file", () => {
    expect(validator.validateCommand("jq -f filter.jq input.json")).toBe(true);
  });

   test("Use from file without filter", () => {
    expect(validator.validateCommand("jq -f input.json")).toBe(false);
  });

  test("Pass argument to jq", () => {
    expect(validator.validateCommand("jq --arg name 'value' '.name = $name' input.json")).toBe(true);
  });

  test("Invalid: jq with unknown option", () => {
    expect(validator.validateCommand("jq --unknown-option")).toBe(false);
  });

  test("Invalid: jq with unmatched quotes", () => {
    expect(validator.validateCommand("jq 'filter")).toBe(false);
  });

  test("Run tests", () => {
    expect(validator.validateCommand("jq --run-tests testfile")).toBe(true);
  });

  test("Check version", () => {
    expect(validator.validateCommand("jq --version")).toBe(true);
  });

  test("Help command", () => {
    expect(validator.validateCommand("jq --help")).toBe(true);
  });

  test("Invalid: jq without filter", () => {
    expect(validator.validateCommand("jq")).toBe(false);
  });

  test("Invalid: jq with no input files specified", () => {
    expect(validator.validateCommand("jq '.'")).toBe(false);
  });

  
  test("Invalid: jq with improper array handling", () => {
    expect(validator.validateCommand("jq '.array.select(.field == "value")'")).toBe(false);
  });

  test("Invalid: jq with unknown option", () => {
    expect(validator.validateCommand("jq -unknown-option testfile")).toBe(false);
  });
});