import { LessFSM } from "../../src/builtins/less.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("LessFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "less-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, Less!\n".repeat(100));
    fs.writeFileSync(testFile2, "Test file content\n".repeat(50));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new LessFSM();
  });

  test("Basic less", () => {
    expect(fsm.isValid("less")).toBe(true);
  });

  test("less with single file", () => {
    expect(fsm.isValid(`less ${testFile1}`)).toBe(true);
  });

  test("less with multiple files", () => {
    expect(fsm.isValid(`less ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("less with short option", () => {
    expect(fsm.isValid("less -N")).toBe(true);
  });

  test("less with long option", () => {
    expect(fsm.isValid("less --line-numbers")).toBe(true);
  });

  test("less with option and file", () => {
    expect(fsm.isValid(`less -F ${testFile1}`)).toBe(true);
  });

  test("less with multiple options and files", () => {
    expect(fsm.isValid(`less -N -F ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("less with non-existent file", () => {
    expect(fsm.isValid("less non_existent_file.txt")).toBe(true);
  });

  test("less with invalid option", () => {
    expect(fsm.isValid("less --invalid-option")).toBe(true);
  });

  test("less with quoted filename", () => {
    expect(fsm.isValid('less "file with spaces.txt"')).toBe(true);
  });
});
