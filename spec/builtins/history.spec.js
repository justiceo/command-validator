import { CommandValidator } from "../../src/cmd-validator.js";

describe("history command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display command history", () => {
    expect(validator.validateCommand("history")).toBe(true);
  });

  test("Display the last n commands", () => {
    expect(validator.validateCommand("history 10")).toBe(true);
  });

  test("Clear the history list", () => {
    expect(validator.validateCommand("history -c")).toBe(true);
  });

  test("Delete a specific entry from history", () => {
    expect(validator.validateCommand("history -d 5")).toBe(true);
  });

  test("Append current session history to file", () => {
    expect(validator.validateCommand("history -a")).toBe(true);
  });

  test("Read new entries from the history file", () => {
    expect(validator.validateCommand("history -n")).toBe(true);
  });

  test("Read the history file into current session", () => {
    expect(validator.validateCommand("history -r")).toBe(true);
  });

  test("Write current history to the file", () => {
    expect(validator.validateCommand("history -w")).toBe(true);
  });

  test("Perform history substitution without storing", () => {
    expect(validator.validateCommand("history -p echo $HOME")).toBe(true);
  });

  test("Add new entry to history", () => {
    expect(validator.validateCommand("history -s new-command")).toBe(true);
  });

  test("Invalid option usage", () => {
    expect(validator.validateCommand("history --invalid-option")).toBe(false);
  });
});
