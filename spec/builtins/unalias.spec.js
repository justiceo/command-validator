import { CommandValidator } from "../../src/cmd-validator.js";

describe("unalias command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Remove a specific alias", () => {
    expect(validator.validateCommand("unalias ls")).toBe(true);
  });

  test("Remove multiple aliases", () => {
    expect(validator.validateCommand("unalias ls ll")).toBe(true);
  });

  test("Remove all aliases", () => {
    expect(validator.validateCommand("unalias -a")).toBe(true);
  });

  test("Invalid command: missing alias", () => {
    expect(validator.validateCommand("unalias")).toBe(false);
  });

  test("Invalid command: incorrect option", () => {
    expect(validator.validateCommand("unalias --invalid-option ls")).toBe(false);
  });

  test("Invalid command: unmatched quotes", () => {
    expect(validator.validateCommand("unalias 'ls")).toBe(false);
  });

  test("Attempt to remove a non-existent alias", () => {
    expect(validator.validateCommand("unalias non_existent_alias")).toBe(true); // Assuming it doesn't fail if alias doesn't exist
  });
});
