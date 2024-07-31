import { RmdirFSM } from "../../src/builtins/rmdir.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("RmdirFSM", () => {
  let fsm;
  let tempDir;
  let testDir1;
  let testDir2;
  let nestedDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rmdir-test-"));
    testDir1 = path.join(tempDir, "dir1");
    testDir2 = path.join(tempDir, "dir2");
    nestedDir = path.join(testDir2, "nested");
    fs.mkdirSync(testDir1);
    fs.mkdirSync(testDir2);
    fs.mkdirSync(nestedDir);
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new RmdirFSM();
  });

  test("Basic rmdir", () => {
    expect(fsm.isValid(`rmdir ${testDir1}`)).toBe(true);
  });

  test("rmdir with multiple directories", () => {
    expect(fsm.isValid(`rmdir ${testDir1} ${testDir2}`)).toBe(true);
  });

  test("rmdir with short option", () => {
    expect(fsm.isValid(`rmdir -p ${nestedDir}`)).toBe(true);
  });

  test("rmdir with long option", () => {
    expect(fsm.isValid(`rmdir --parents ${nestedDir}`)).toBe(true);
  });

  test("rmdir with option and multiple directories", () => {
    expect(fsm.isValid(`rmdir -v ${testDir1} ${testDir2}`)).toBe(true);
  });

  test("rmdir with non-existent directory", () => {
    expect(fsm.isValid("rmdir non_existent_dir")).toBe(true);
  });

  test("rmdir with invalid option", () => {
    expect(fsm.isValid("rmdir --invalid-option")).toBe(true);
  });

  test("rmdir with quoted directory name", () => {
    expect(fsm.isValid('rmdir "directory with spaces"')).toBe(true);
  });
});
