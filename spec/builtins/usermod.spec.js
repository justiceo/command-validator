import { CommandValidator } from "../../src/cmd-validator.js";

describe("usermod command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    // Cleanup after each test
    validator = null; // Clear the validator instance
  });

  test("Basic usermod command", () => {
    expect(validator.validateCommand("usermod username")).toBe(true);
  });

  test("usermod with append option", () => {
    expect(validator.validateCommand("usermod -a -G groupname username")).toBe(true);
  });

  test("usermod with home directory option", () => {
    expect(validator.validateCommand("usermod -d /home/newhome username")).toBe(true);
  });

  test("usermod with shell option", () => {
    expect(validator.validateCommand("usermod -s /bin/bash username")).toBe(true);
  });

  test("usermod with expire date option", () => {
    expect(validator.validateCommand("usermod -e 2024-12-31 username")).toBe(true);
  });

  test("usermod with lock option", () => {
    expect(validator.validateCommand("usermod -L username")).toBe(true);
  });

  test("usermod with unlock option", () => {
    expect(validator.validateCommand("usermod -U username")).toBe(true);
  });

  test("usermod with UID option", () => {
    expect(validator.validateCommand("usermod -u 1001 username")).toBe(true);
  });

  test("Invalid: usermod with missing username", () => {
    expect(validator.validateCommand("usermod -a -G groupname")).toBe(false);
  });

   test("Invalid: usermod without argument", () => {
    expect(validator.validateCommand("usermod")).toBe(false);
  });

   test("Invalid: usermod with non existent user", () => {
    expect(validator.validateCommand("usermod non_existen_username")).toBe(false);
  });

   test("Invalid: usermod with improper option placement", () => {
    expect(validator.validateCommand("usermod username -d")).toBe(false);
  });
  
   test("Invalid: usermod with typo", () => {
    expect(validator.validateCommand("usermood username")).toBe(false);
  });

  test("Invalid: usermod with invalid option", () => {
    expect(validator.validateCommand("usermod --invalid-option username")).toBe(false);
  });

  test("usermod with multiple options", () => {
    expect(validator.validateCommand("usermod -d /home/newhome -s /bin/zsh username")).toBe(true);
  });
});
