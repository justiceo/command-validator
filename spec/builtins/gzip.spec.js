import { CommandValidator } from "../../src/cmd-validator.js";

describe("gzip command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Compress a file", () => {
    expect(validator.validateCommand("gzip file.txt")).toBe(true);
  });

  test("Decompress a gzipped file", () => {
    expect(validator.validateCommand("gzip -d file.txt.gz")).toBe(true);
  });

  test("Compress with highest compression level", () => {
    expect(validator.validateCommand("gzip -9 file.txt")).toBe(true);
  });

  test("Decompress to standard output", () => {
    expect(validator.validateCommand("gunzip -c file.txt.gz")).toBe(true);
  });

  test("Force overwrite of existing files", () => {
    expect(validator.validateCommand("gzip -f file.txt")).toBe(true);
  });

  test("Keep original file after compression", () => {
    expect(validator.validateCommand("gzip -k file.txt")).toBe(true);
  });

  test("List compressed file information", () => {
    expect(validator.validateCommand("gzip -l file.txt.gz")).toBe(true);
  });

  test("Check integrity of a compressed file", () => {
    expect(validator.validateCommand("gzip -t file.txt.gz")).toBe(true);
  });

  test("Use a custom suffix for compressed files", () => {
    expect(validator.validateCommand("gzip -S .mygz file.txt")).toBe(true);
  });

  test("Invalid option usage", () => {
    expect(validator.validateCommand("gzip --invalid-option")).toBe(false);
  });

  test("With non existent file", () => {
    expect(validator.validateCommand("gzip non_existent_file")).toBe(false);
  });

  test("Missing compression type", () => {
    expect(validator.validateCommand("gzip")).toBe(false);
  });

  test("Uncompress non-zip file", () => {
    expect(validator.validateCommand("gunzip non_zip_file")).toBe(false);
  });

  test("Display help message", () => {
    expect(validator.validateCommand("gzip --help")).toBe(true);
  });

  test("Typo in command name", () => {
    expect(validator.validateCommand("gziip --help")).toBe(false);
  });

  test("Display version information", () => {
    expect(validator.validateCommand("gzip --version")).toBe(true);
  });
});