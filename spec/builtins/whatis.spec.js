import { CommandValidator } from "../../src/cmd-validator.js";

describe("whatis command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic whatis", () => {
    expect(validator.validateCommand("whatis ls")).toBe(true);
  });

  test("whatis with multiple commands", () => {
    expect(validator.validateCommand("whatis ls ssh")).toBe(true);
  });

  test("whatis with debug option", () => {
    expect(validator.validateCommand("whatis -d ls")).toBe(true);
  });

  test("whatis with verbose option", () => {
    expect(validator.validateCommand("whatis -v ls")).toBe(true);
  });

  test("whatis with regex option", () => {
    expect(validator.validateCommand("whatis -r ls")).toBe(true);
  });

  test("whatis with wildcard option", () => {
    expect(validator.validateCommand("whatis -w ls")).toBe(true);
  });

  test("whatis with long option", () => {
    expect(validator.validateCommand("whatis -l ls")).toBe(true);
  });

  test("whatis with sections option", () => {
    expect(validator.validateCommand("whatis -s 1:2 ls")).toBe(true);
  });

  test("whatis with systems option", () => {
    expect(validator.validateCommand("whatis -m linux,bsd ls")).toBe(true);
  });

  test("whatis with manpath option", () => {
    expect(validator.validateCommand("whatis -M /usr/share/man ls")).toBe(true);
  });

  test("whatis with locale option", () => {
    expect(validator.validateCommand("whatis -L en_US ls")).toBe(true);
  });

  test("whatis with config file option", () => {
    expect(validator.validateCommand("whatis -C ~/.manpath ls")).toBe(true);
  });

  test("whatis with help option", () => {
    expect(validator.validateCommand("whatis --help")).toBe(true);
  });

  test("whatis with usage option", () => {
    expect(validator.validateCommand("whatis --usage")).toBe(true);
  });

  test("whatis with version option", () => {
    expect(validator.validateCommand("whatis --version")).toBe(true);
  });

  test("Invalid: whatis with extra arguments", () => {
    expect(validator.validateCommand("whatis ls extra")).toBe(false);
  });

   test("Invalid: whatis with wrong syntax", () => {
    expect(validator.validateCommand("whatis -s 1,2,3")).toBe(false);
  });

   test("Invalid: whatis with typo", () => {
    expect(validator.validateCommand("whatiis ls")).toBe(false);
  });

   test("Invalid: whatis with path", () => {
    expect(validator.validateCommand("whatis /bin/bash")).toBe(false);
  });

   test("Invalid: whatis with improper option combination", () => {
    expect(validator.validateCommand("whatis -w wild*card")).toBe(false);
  });

  test("Invalid: whatis with space before command", () => {
    expect(validator.validateCommand(" whatis ls")).toBe(false);
  });
});