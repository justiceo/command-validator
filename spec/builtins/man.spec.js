import { CommandValidator } from "../../src/cmd-validator.js";

describe("man command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic man page retrieval", () => {
    expect(validator.validateCommand("man ls")).toBe(true);
  });

  test("Man page with section", () => {
    expect(validator.validateCommand("man 1 ls")).toBe(true);
  });

  test("Search for a keyword", () => {
    expect(validator.validateCommand("man -k keyword")).toBe(true);
  });

  test("Display all manual pages", () => {
    expect(validator.validateCommand("man -a ls")).toBe(true);
  });

  test("Display help message", () => {
    expect(validator.validateCommand("man -h")).toBe(true);
  });

  test("Display path of man pages", () => {
    expect(validator.validateCommand("man --path")).toBe(true);
  });

  test("Reformatting source man page", () => {
    expect(validator.validateCommand("man -c ls")).toBe(true);
  });

  test("Use specific pager", () => {
    expect(validator.validateCommand("man -P less ls")).toBe(true);
  });

  test("Use specific browser for HTML", () => {
    expect(validator.validateCommand("man -B firefox ls")).toBe(true);
  });

  test("Use specific HTML pager", () => {
    expect(validator.validateCommand("man -H lynx ls")).toBe(true);
  });

  test("Specify alternate system man pages", () => {
    expect(validator.validateCommand("man -m mysystem ls")).toBe(true);
  });

  test("Invalid: Man page with no argument", () => {
    expect(validator.validateCommand("man")).toBe(false);
  });

  test("Invalid: Man page with unsupported section", () => {
    expect(validator.validateCommand("man 999 ls")).toBe(false);
  });

  test("Invalid: Man page with invalid option", () => {
    expect(validator.validateCommand("man --invalid-option ls")).toBe(false);
  });

  test(" Man page with space before option", () => {
    expect(validator.validateCommand("man  -k keyword")).toBe(true);
  });

  test("Invalid: Man page with unmatched quote", () => {
    expect(validator.validateCommand("man 'ls")).toBe(false);
  });

  test("Invalid: without parameter", () => {
    expect(validator.validateCommand("man")).toBe(false);
  });

  test("Invalid: Use of wildcard", () => {
    expect(validator.validateCommand("man grep*")).toBe(false);
  });

  test("Man page with formatting option", () => {
    expect(validator.validateCommand("man -t ls")).toBe(true);
  });

  test("Show debugging information", () => {
    expect(validator.validateCommand("man -d ls")).toBe(true);
  });

  test("Path retrieval with -w option", () => {
    expect(validator.validateCommand("man -w ls")).toBe(true);
  });

  test("Search all man pages with -K", () => {
    expect(validator.validateCommand("man -K keyword")).toBe(true);
  });
});

