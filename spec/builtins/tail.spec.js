import { TailFSM } from "../../src/builtins/tail.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("TailFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tail-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(
      testFile1,
      "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\n"
    );
    fs.writeFileSync(testFile2, "Test file content\n".repeat(20));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new TailFSM();
  });

  test("Basic tail", () => {
    expect(fsm.isValid(`tail ${testFile1}`)).toBe(true);
  });

  test("tail with multiple files", () => {
    expect(fsm.isValid(`tail ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("tail with short option", () => {
    expect(fsm.isValid(`tail -n 5 ${testFile1}`)).toBe(true);
  });

  test("tail with long option", () => {
    expect(fsm.isValid(`tail --lines=5 ${testFile1}`)).toBe(true);
  });

  test("tail with follow option", () => {
    expect(fsm.isValid(`tail -f ${testFile1}`)).toBe(true);
  });

  test("tail with bytes option", () => {
    expect(fsm.isValid(`tail -c 100 ${testFile1}`)).toBe(true);
  });

  test("tail with multiple options and files", () => {
    expect(fsm.isValid(`tail -n 5 -v ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("tail with non-existent file", () => {
    expect(fsm.isValid("tail non_existent_file.txt")).toBe(true);
  });

  test("tail with invalid option", () => {
    expect(fsm.isValid("tail --invalid-option")).toBe(true);
  });

  test("tail with quoted filename", () => {
    expect(fsm.isValid('tail "file with spaces.txt"')).toBe(true);
  });

  test("tail with positive number of lines", () => {
    expect(fsm.isValid(`tail -n +5 ${testFile1}`)).toBe(true);
  });
});
