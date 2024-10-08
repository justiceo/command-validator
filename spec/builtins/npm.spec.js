import { CommandValidator } from "../../src/cmd-validator.js";

describe("npm command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic npm command", () => {
    expect(validator.validateCommand("npm")).toBe(true);
  });

  test("npm with install command", () => {
    expect(validator.validateCommand("npm install")).toBe(true);
  });

  test("npm with adduser command", () => {
    expect(validator.validateCommand("npm adduser")).toBe(true);
  });

  test("npm with publish command", () => {
    expect(validator.validateCommand("npm publish")).toBe(true);
  });

  test("npm with link command", () => {
    expect(validator.validateCommand("npm link")).toBe(true);
  });

  test("npm with multiple commands", () => {
    expect(validator.validateCommand("npm install package1 package2")).toBe(true);
  });

  test("npm with command and arguments", () => {
    expect(validator.validateCommand("npm install --save package1")).toBe(true);
  });

  test("Invalid: npm with unknown command", () => {
    expect(validator.validateCommand("npm unknown")).toBe(false);
  });

  test("Invalid: npm with space before command", () => {
    expect(validator.validateCommand(" npm install")).toBe(false);
  });

  test("npm with json option", () => {
    expect(validator.validateCommand("npm json")).toBe(true);
  });

  test("npm with valid options", () => {
    expect(validator.validateCommand("npm install --global package1")).toBe(true);
  });

  test("Invalid: npm with invalid option", () => {
    expect(validator.validateCommand("npm install --invalid-option")).toBe(false);
  });

  test("npm with complex command", () => {
    expect(validator.validateCommand("npm install package1 package2 --save-dev")).toBe(true);
  });

  test("npm with command and path", () => {
    expect(validator.validateCommand("npm install ./local-package")).toBe(true);
  });

  test("Invalid: npm with unmatched quotes", () => {
    expect(validator.validateCommand("npm install 'package1")).toBe(false);
  });

  test("Invalid: npm with non existent package", () => {
    expect(validator.validateCommand("npm install non_existent_package")).toBe(false);
  });

  test("Invalid: npm with unsupported version", () => {
    expect(validator.validateCommand("npm install package@latesttest")).toBe(false);
  });

  test("Invalid: npm with syntax errror", () => {
    expect(validator.validateCommand("npm instal package1")).toBe(false);
  });

  test("npm with command and flags", () => {
    expect(validator.validateCommand("npm publish --access public")).toBe(true);
  });

  test("npm with version flag", () => {
    expect(validator.validateCommand("npm --version")).toBe(true);
  });

  test("Invalid: npm with multiple spaces", () => {
    expect(validator.validateCommand("npm   install")).toBe(false);
  });

  test("npm with help command", () => {
    expect(validator.validateCommand("npm help")).toBe(true);
  });
});