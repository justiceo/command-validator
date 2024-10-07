import { CommandValidator } from "../../src/cmd-validator.js";

describe("tar command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic tar command", () => {
    expect(validator.validateCommand("tar")).toBe(false);
  });

  test("Create a new archive", () => {
    expect(validator.validateCommand("tar -cvf archive.tar file1 file2")).toBe(true);
  });

  test("Extract files from an archive", () => {
    expect(validator.validateCommand("tar -xvf archive.tar")).toBe(true);
  });

  test("List contents of an archive", () => {
    expect(validator.validateCommand("tar -tvf archive.tar")).toBe(true);
  });

  test("Append files to an archive", () => {
    expect(validator.validateCommand("tar -rvf archive.tar file3")).toBe(true);
  });

  test("Delete files from an archive", () => {
    expect(validator.validateCommand("tar --delete -f archive.tar file1")).toBe(true);
  });

  test("Update files in an archive", () => {
    expect(validator.validateCommand("tar -uvf archive.tar file1")).toBe(true);
  });

  test("Change to directory before operation", () => {
    expect(validator.validateCommand("tar -C /path/to/dir -cvf archive.tar file1")).toBe(true);
  });

  test("Create a gzip-compressed archive", () => {
    expect(validator.validateCommand("tar -czvf archive.tar.gz directory/")).toBe(true);
  });

  test("Create a bzip2-compressed archive", () => {
    expect(validator.validateCommand("tar -cjvf archive.tar.bz2 directory/")).toBe(true);
  });

  test("Create an xz-compressed archive", () => {
    expect(validator.validateCommand("tar -cJvf archive.tar.xz directory/")).toBe(true);
  });

  test("Invalid: tar with unknown option", () => {
    expect(validator.validateCommand("tar --unknown-option")).toBe(false);
  });

  test("Invalid: tar with unmatched quotes", () => {
    expect(validator.validateCommand("tar -cvf 'archive.tar")).toBe(false);
  });

  test("Invalid: tar without required option", () => {
    expect(validator.validateCommand("tar -f archive.tar")).toBe(false);
  });

  test("tar with multiple options", () => {
    expect(validator.validateCommand("tar -czvf archive.tar.gz -C /path/to/dir .")).toBe(true);
  });

  test("Invalid: tar without filename argument", () => {
    expect(validator.validateCommand("tar -cvf")).toBe(false);
  });

   test("Invalid: tar with typo", () => {
    expect(validator.validateCommand("tarr -cvf archive.tar directory")).toBe(false);
  });

  test("tar with verbose listing", () => {
    expect(validator.validateCommand("tar -tvf archive.tar")).toBe(true);
  });
});