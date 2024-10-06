import { CommandValidator } from "../../src/cmd-validator.js";

describe("useradd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic useradd command", () => {
    expect(validator.validateCommand("useradd username")).toBe(true);
  });

  test("useradd with home directory option", () => {
    expect(validator.validateCommand("useradd -d /home/username username")).toBe(true);
  });

  test("useradd with create home option", () => {
    expect(validator.validateCommand("useradd -m username")).toBe(true);
  });

  test("useradd with shell option", () => {
    expect(validator.validateCommand("useradd -s /bin/bash username")).toBe(true);
  });

  test("useradd with groups option", () => {
    expect(validator.validateCommand("useradd -G group1,group2 username")).toBe(true);
  });

  test("useradd with password option", () => {
    expect(validator.validateCommand("useradd -p encrypted_password username")).toBe(true);
  });

  test("useradd with non-unique UID option", () => {
    expect(validator.validateCommand("useradd -o -u 1001 username")).toBe(true);
  });

  test("useradd with expire date option", () => {
    expect(validator.validateCommand("useradd -e 2024-12-31 username")).toBe(true);
  });

  test("useradd with no user group option", () => {
    expect(validator.validateCommand("useradd -N username")).toBe(true);
  });

  test("Invalid: useradd with missing username", () => {
    expect(validator.validateCommand("useradd")).toBe(false);
  });

  test("Invalid: single useradd with duplicate username", () => {
    expect(validator.validateCommand("useradd username username")).toBe(false);
  });

  test("Invalid: useradd without permission", () => {
    expect(validator.validateCommand("useradd username")).toBe(false);
  });

  test("Invalid: useradd with typo", () => {
    expect(validator.validateCommand("useraddd username")).toBe(false);
  });

  test("Invalid: useradd with invalid option", () => {
    expect(validator.validateCommand("useradd --invalid-option username")).toBe(false);
  });

  test("useradd with multiple options", () => {
    expect(validator.validateCommand("useradd -m -s /bin/zsh -G group1 username")).toBe(true);
  });
});
