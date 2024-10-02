import { CommandValidator } from "../../src/cmd-validator.js";

describe("dd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic dd command with input and output files", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile")).toBe(true);
  });

  test("dd with block size option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile bs=1M")).toBe(true);
  });

  test("dd with count option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile count=100")).toBe(true);
  });

  test("dd with skip option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile skip=10")).toBe(true);
  });

  test("dd with seek option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile seek=5")).toBe(true);
  });

  test("dd with input and output block sizes", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile ibs=512 obs=1M")).toBe(true);
  });

  test("dd with status option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile status=progress")).toBe(true);
  });

  test("Invalid: dd without input file", () => {
    expect(validator.validateCommand("dd of=outputfile")).toBe(false);
     expect(validator.validateCommand("dd if= of=outputfile")).toBe(false);
  });

  test("Invalid: dd without output file", () => {
    expect(validator.validateCommand("dd if=inputfile")).toBe(false);
  });

  test("Invalid: dd with non_existent input file", () => {
    expect(validator.validateCommand("dd if=non_existent_file of=outputfile")).toBe(false);
  });

   test("Invalid: dd with invalid options", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile xyz")).toBe(false);
  });

  test("Invalid: dd with invalid option", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile --invalid-option")).toBe(false);
  });

   test("Invalid: dd with incorrect block size", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile bs=abc")).toBe(false);
  });

  test("Invalid: dd with missing arguments", () => {
    expect(validator.validateCommand("dd")).toBe(false);
  });
  
  test("dd with flags for input", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile iflag=direct")).toBe(true);
  });

  test("dd with flags for output", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile oflag=sync")).toBe(true);
  });

  test("dd with multiple options", () => {
    expect(validator.validateCommand("dd if=inputfile of=outputfile bs=1M count=100 skip=10 seek=5")).toBe(true);
  });

  test("Invalid: dd with unmatched quote", () => {
    expect(validator.validateCommand("dd if='inputfile")).toBe(false);
  });

  test("Invalid: dd with space before option", () => {
    expect(validator.validateCommand(" dd if=inputfile of=outputfile")).toBe(false);
  });

  test("dd with /dev/zero input file", () => {
    expect(validator.validateCommand("dd if=/dev/zero of=outputfile bs=1M count=1")).toBe(true);
  });
});
