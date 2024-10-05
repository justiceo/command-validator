import { CommandValidator } from "../../src/cmd-validator.js";

describe("rsync command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic file synchronization", () => {
    expect(validator.validateCommand("rsync -av source/ destination/")).toBe(true);
  });

  test("Sync with compression", () => {
    expect(validator.validateCommand("rsync -avz remote:/path/to/source /local/destination")).toBe(true);
  });

  test("Recursive directory copy", () => {
    expect(validator.validateCommand("rsync -r source/ destination/")).toBe(true);
  });

  test("Use exclude pattern", () => {
    expect(validator.validateCommand("rsync -av --exclude='*.tmp' source/ destination/")).toBe(true);
  });

  test("Perform a dry run", () => {
    expect(validator.validateCommand("rsync -n -av source/ destination/")).toBe(true);
  });

  test("Preserve permissions and times", () => {
    expect(validator.validateCommand("rsync -pt source/ destination/")).toBe(true);
  });

  test("Delete files not in source", () => {
    expect(validator.validateCommand("rsync --delete -av source/ destination/")).toBe(true);
  });

  test("Limit bandwidth", () => {
    expect(validator.validateCommand("rsync --bwlimit=1000 source/ destination/")).toBe(true);
  });

  test("Invalid: Missing destination", () => {
    expect(validator.validateCommand("rsync source/")).toBe(false);
  });

  test("Invalid: Missing destination", () => {
    expect(validator.validateCommand("rsync -av user@remote:/source /destination")).toBe(false);
  });

  test("Invalid: Missing source and destination", () => {
    expect(validator.validateCommand("rsync -av")).toBe(false);
  });

  test("Invalid: With unquoted spaces", () => {
    expect(validator.validateCommand("rsync -av path/with space/ /destination")).toBe(false);
  });

  test("Invalid: Incorrect option usage", () => {
    expect(validator.validateCommand("rsync --invalid-option source/ destination/")).toBe(false);
  });

  test("Invalid: Source does not exist", () => {
    expect(validator.validateCommand("rsync nonexistent/ destination/")).toBe(false);
  });

  test("Invalid: Multiple sources but single destination", () => {
    expect(validator.validateCommand("rsync source1/ source2/ destination/")).toBe(false);
  });
});
