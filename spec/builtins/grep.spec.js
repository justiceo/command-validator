import { CommandValidator } from "../../src/cmd-validator.js";

describe("grep command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Search for a pattern in a file", () => {
    expect(validator.validateCommand('grep "pattern" file.txt')).toBe(true);
  });

  test("Recursive search in a directory", () => {
    expect(validator.validateCommand('grep -r "function" /path/to/code')).toBe(true);
  });

  test("Without option, pattern or file", () => {
    expect(validator.validateCommand('grep')).toBe(false);
  });

  test("Unquoted pattern with spaces", () => {
    expect(validator.validateCommand('grep unquoted pattern file.txt')).toBe(false);
  });

  test("Ignore case distinctions", () => {
    expect(validator.validateCommand('grep -i "ERROR" logfile.txt')).toBe(true);
  });

  test("Print lines with context after matches", () => {
    expect(validator.validateCommand('grep -A 2 "pattern" file.txt')).toBe(true);
  });

  test("Print lines with context before matches", () => {
    expect(validator.validateCommand('grep -B 2 "pattern" file.txt')).toBe(true);
  });

  test("Show only the matching part of a line", () => {
    expect(validator.validateCommand('grep -o "pattern" file.txt')).toBe(true);
  });

  test("Count matching lines in a file", () => {
    expect(validator.validateCommand('grep -c "pattern" file.txt')).toBe(true);
  });

  test("Use fixed strings for matching", () => {
    expect(validator.validateCommand('grep -F "fixed string" file.txt')).toBe(true);
  });

  test("Exclude certain files in recursive search", () => {
    expect(validator.validateCommand('grep --exclude=*.log "pattern" /path/to/code')).toBe(true);
  });

  test("Search with a Perl regular expression", () => {
    expect(validator.validateCommand('grep -P "\\w+" file.txt')).toBe(true);
  });

  test("Search for whole words only", () => {
    expect(validator.validateCommand('grep -w "word" file.txt')).toBe(true);
  });

  test("Show line numbers with matches", () => {
    expect(validator.validateCommand('grep -n "pattern" file.txt')).toBe(true);
  });

  test("Quiet mode; do not output anything", () => {
    expect(validator.validateCommand('grep -q "pattern" file.txt')).toBe(true);
  });

  test("Display help message", () => {
    expect(validator.validateCommand('grep --help')).toBe(true);
  });

  test("Invalid option usage", () => {
    expect(validator.validateCommand('grep --invalid-option')).toBe(false);
  });

  test("Print version information", () => {
    expect(validator.validateCommand('grep --version')).toBe(true);
  });
});
