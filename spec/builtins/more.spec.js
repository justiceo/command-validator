import { MoreFSM } from "../../src/builtins/more.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("MoreFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "more-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, More!\n".repeat(100));
    fs.writeFileSync(testFile2, "Test file content\n".repeat(50));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new MoreFSM();
  });

  test("Basic more", () => {
    expect(fsm.isValid("more")).toBe(true);
  });

  test("more with single file", () => {
    expect(fsm.isValid(`more ${testFile1}`)).toBe(true);
  });

  test("more with multiple files", () => {
    expect(fsm.isValid(`more ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("more with short option", () => {
    expect(fsm.isValid("more -d")).toBe(true);
  });

  test("more with option and file", () => {
    expect(fsm.isValid(`more -p ${testFile1}`)).toBe(true);
  });

  test("more with multiple options and files", () => {
    expect(fsm.isValid(`more -d -p ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("more with non-existent file", () => {
    expect(fsm.isValid("more non_existent_file.txt")).toBe(true);
  });

  test("more with invalid option", () => {
    expect(fsm.isValid("more --invalid-option")).toBe(true);
  });

  test("more with quoted filename", () => {
    expect(fsm.isValid('more "file with spaces.txt"')).toBe(true);
  });
});
