import { CommandValidator } from "../../src/cmd-validator.js";

describe("chown command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Change owner of a file", () => {
    expect(validator.validateCommand("chown user file.txt")).toBe(true);
  });

  test("Change owner and group of a file", () => {
    expect(validator.validateCommand("chown user:group file.txt")).toBe(true);
    expect(validator.validateCommand("chown user.group file.txt")).toBe(true);
  });

  test("Change only group of a file", () => {
    expect(validator.validateCommand("chown :group file.txt")).toBe(true);
    expect(validator.validateCommand("chown .group file.txt")).toBe(true);
  });

  test("Change owner using reference file", () => {
    expect(validator.validateCommand("chown --reference=reffile.txt file.txt")).toBe(true);
  });

  test("Recursive change of ownership", () => {
    expect(validator.validateCommand("chown -R user:group directory/")).toBe(true);
  });

  test("Verbose output on changes", () => {
    expect(validator.validateCommand("chown -v user:group file.txt")).toBe(true);
  });

  test("Silent mode, no error messages", () => {
    expect(validator.validateCommand("chown -f user file.txt")).toBe(true);
  });

  test("Change ownership of symbolic link", () => {
    expect(validator.validateCommand("chown -h user file.txt")).toBe(true);
  });

  test("Dereference symbolic links", () => {
    expect(validator.validateCommand("chown --dereference user file.txt")).toBe(true);
  });

  test("Invalid command: missing file argument", () => {
    expect(validator.validateCommand("chown user")).toBe(false);
  });

  test("Invalid command: non_existent user or group", () => {
    expect(validator.validateCommand("chown invalid_user: invalid_group file.txt")).toBe(false);
  });

  test("Invalid command: too many argument", () => {
    expect(validator.validateCommand("chown user1 user2 file1 file2")).toBe(false);
  });

  test("Invalid command: incorrect option", () => {
    expect(validator.validateCommand("chown --invalid-option user file.txt")).toBe(false);
  });

  test("Invalid command: unmatched quotes", () => {
    expect(validator.validateCommand("chown 'user file.txt")).toBe(false);
  });

  test("Invalid command: improper user of special character", () => {
    expect(validator.validateCommand("chown user@group file")).toBe(false);
  });

  test("Change owner to a non-existing user", () => {
    expect(validator.validateCommand("chown nonexistinguser file.txt")).toBe(false);
  });

  test("Change ownership of multiple files", () => {
    expect(validator.validateCommand("chown user:group file1.txt file2.txt")).toBe(true);
  });

  test("Invalid", () => {
    expect(validator.validateCommand("chown user:group file1.txt file2.txt")).toBe(true);
  });
});
