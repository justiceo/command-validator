import { CommandValidator } from "../../src/cmd-validator.js";

describe("scp command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic scp", () => {
    expect(validator.validateCommand("scp")).toBe(false); // scp needs at least a source and destination
  });

  test("scp with file to remote", () => {
    expect(validator.validateCommand("scp file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with remote file to local", () => {
    expect(validator.validateCommand("scp user@remote:/path/to/file.txt .")).toBe(true);
  });

  test("scp with recursive option", () => {
    expect(validator.validateCommand("scp -r directory/ user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with multiple files", () => {
    expect(validator.validateCommand("scp file1.txt file2.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with -P option", () => {
    expect(validator.validateCommand("scp -P 2222 file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with -p option", () => {
    expect(validator.validateCommand("scp -p file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with compression option", () => {
    expect(validator.validateCommand("scp -C file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with identity file", () => {
    expect(validator.validateCommand("scp -i ~/.ssh/id_rsa file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with IPv4 option", () => {
    expect(validator.validateCommand("scp -4 file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with verbose option", () => {
    expect(validator.validateCommand("scp -v file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with typo", () => {
    expect(validator.validateCommand("scpp file.txt user@remote:/path/to/destination")).toBe(false);
  });

  test("scp with invalid option", () => {
    expect(validator.validateCommand("scp --invalid-option file.txt user@remote:/path/to/destination")).toBe(false);
  });

  test("scp with unmatched quote", () => {
    expect(validator.validateCommand("scp 'file.txt user@remote:/path/to/destination")).toBe(false);
  });

  test("scp with typo", () => {
    expect(validator.validateCommand("sccp 'file.txt user@remote:/path/to/destination")).toBe(false);
  });

  test("scp with space before options", () => {
    expect(validator.validateCommand(" scp -C file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with user@host and file", () => {
    expect(validator.validateCommand("scp user@remote:/path/to/file.txt user@another:/path/to/destination")).toBe(true);
  });

  test("scp with option after file", () => {
    expect(validator.validateCommand("scp file.txt -C user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with file path", () => {
    expect(validator.validateCommand("scp /path/to/file.txt user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with directory", () => {
    expect(validator.validateCommand("scp directory/ user@remote:/path/to/destination")).toBe(true);
  });

  test("scp with path and options", () => {
    expect(validator.validateCommand("scp -r /path/to/directory/ user@remote:/path/to/destination")).toBe(true);
  });
});
