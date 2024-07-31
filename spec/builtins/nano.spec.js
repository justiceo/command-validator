import { NanoFSM } from "../../src/builtins/nano.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("NanoFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nano-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, Nano!\n");
    fs.writeFileSync(testFile2, "Test file content\n");
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new NanoFSM();
  });

  test("Basic nano", () => {
    expect(fsm.isValid("nano")).toBe(true);
  });

  test("nano with single file", () => {
    expect(fsm.isValid(`nano ${testFile1}`)).toBe(true);
  });

  test("nano with multiple files", () => {
    expect(fsm.isValid(`nano ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("nano with short option", () => {
    expect(fsm.isValid("nano -B")).toBe(true);
  });

  test("nano with long option", () => {
    expect(fsm.isValid("nano --backup")).toBe(true);
  });

  test("nano with option and file", () => {
    expect(fsm.isValid(`nano -R ${testFile1}`)).toBe(true);
  });

  test("nano with multiple options and files", () => {
    expect(fsm.isValid(`nano -B -R ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("nano with non-existent file", () => {
    expect(fsm.isValid("nano non_existent_file.txt")).toBe(true);
  });

  test("nano with invalid option", () => {
    expect(fsm.isValid("nano --invalid-option")).toBe(true);
  });

  test("nano with quoted filename", () => {
    expect(fsm.isValid('nano "file with spaces.txt"')).toBe(true);
  });

  test("nano with line number", () => {
    expect(fsm.isValid(`nano +10 ${testFile1}`)).toBe(true);
  });
});
