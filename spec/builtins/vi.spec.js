import { ViFSM } from "../../src/builtins/vi.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("ViFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vi-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, Vi!\n");
    fs.writeFileSync(testFile2, "Test file content\n");
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new ViFSM();
  });

  test("Basic vi", () => {
    expect(fsm.isValid("vi")).toBe(true);
  });

  test("vi with single file", () => {
    expect(fsm.isValid(`vi ${testFile1}`)).toBe(true);
  });

  test("vi with multiple files", () => {
    expect(fsm.isValid(`vi ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("vi with read-only option", () => {
    expect(fsm.isValid(`vi -R ${testFile1}`)).toBe(true);
  });

  test("vi with recover option", () => {
    expect(fsm.isValid(`vi -r ${testFile1}`)).toBe(true);
  });

  test("vi with tag option", () => {
    expect(fsm.isValid("vi -t mytag")).toBe(true);
  });

  test("vi with command option", () => {
    expect(fsm.isValid(`vi +10 ${testFile1}`)).toBe(true);
  });

  test("vi with multiple options", () => {
    expect(fsm.isValid(`vi -R +10 ${testFile1}`)).toBe(true);
  });

  test("vi with non-existent file", () => {
    expect(fsm.isValid("vi non_existent_file.txt")).toBe(true);
  });

  test("vi with invalid option", () => {
    expect(fsm.isValid("vi --invalid-option")).toBe(true);
  });

  test("vi with quoted filename", () => {
    expect(fsm.isValid('vi "file with spaces.txt"')).toBe(true);
  });

  test("vi with ex mode", () => {
    expect(fsm.isValid("vi -e")).toBe(true);
  });
});
