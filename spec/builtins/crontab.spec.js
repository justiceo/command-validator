import { CommandValidator } from "../../src/cmd-validator.js";

describe("crontab command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic crontab edit", () => {
    expect(validator.validateCommand("crontab -e")).toBe(true);
  });

  test("crontab list", () => {
    expect(validator.validateCommand("crontab -l")).toBe(true);
  });

  test("crontab remove", () => {
    expect(validator.validateCommand("crontab -r")).toBe(true);
  });

  test("crontab with user option", () => {
    expect(validator.validateCommand("crontab -u user")).toBe(true);
  });

  test("crontab with edit and user option", () => {
    expect(validator.validateCommand("crontab -u user -e")).toBe(true);
  });

  test("crontab with list and user option", () => {
    expect(validator.validateCommand("crontab -u user -l")).toBe(true);
  });

  test("Invalid: crontab with unmatched quote", () => {
    expect(validator.validateCommand("crontab 'user")).toBe(false);
  });

  test("crontab with space before option", () => {
    expect(validator.validateCommand(" crontab -e")).toBe(true);
  });

  test("Invalid: crontab with invalid option", () => {
    expect(validator.validateCommand("crontab --invalid-option")).toBe(false);
  });

  test("crontab with file argument", () => {
    expect(validator.validateCommand("crontab myfile.txt")).toBe(true);
  });

  test("crontab with multiple options", () => {
    expect(validator.validateCommand("crontab -l -u user")).toBe(true);
  });

  test("crontab with multiple users (invalid)", () => {
    expect(validator.validateCommand("crontab -u user1 -u user2 -l")).toBe(false);
  });
});
