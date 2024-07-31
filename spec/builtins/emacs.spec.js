import { EmacsFSM } from "../../src/builtins/emacs.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("EmacsFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "emacs-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, Emacs!\n");
    fs.writeFileSync(testFile2, "Test file content\n");
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new EmacsFSM();
  });

  test("Basic emacs", () => {
    expect(fsm.isValid("emacs")).toBe(true);
  });

  test("emacs with single file", () => {
    expect(fsm.isValid(`emacs ${testFile1}`)).toBe(true);
  });

  test("emacs with multiple files", () => {
    expect(fsm.isValid(`emacs ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("emacs with short option", () => {
    expect(fsm.isValid("emacs -nw")).toBe(true);
  });

  test("emacs with long option", () => {
    expect(fsm.isValid("emacs --no-window-system")).toBe(true);
  });

  test("emacs with option and file", () => {
    expect(fsm.isValid(`emacs -Q ${testFile1}`)).toBe(true);
  });

  test("emacs with multiple options and files", () => {
    expect(fsm.isValid(`emacs -nw -Q ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("emacs with non-existent file", () => {
    expect(fsm.isValid("emacs non_existent_file.txt")).toBe(true);
  });

  test("emacs with invalid option", () => {
    expect(fsm.isValid("emacs --invalid-option")).toBe(true);
  });

  test("emacs with quoted filename", () => {
    expect(fsm.isValid('emacs "file with spaces.txt"')).toBe(true);
  });
});
