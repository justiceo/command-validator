import { VimFSM } from "../../src/builtins/vim.js";
import fs from "fs";
import path from "path";
import os from "os";

describe("VimFSM", () => {
  let fsm;
  let tempDir;
  let testFile1;
  let testFile2;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vim-test-"));
    testFile1 = path.join(tempDir, "test1.txt");
    testFile2 = path.join(tempDir, "test2.txt");
    fs.writeFileSync(testFile1, "Hello, Vim!\n");
    fs.writeFileSync(testFile2, "Test file content\n");
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new VimFSM();
  });

  test("Basic vim", () => {
    expect(fsm.isValid("vim")).toBe(true);
  });

  test("vim with single file", () => {
    expect(fsm.isValid(`vim ${testFile1}`)).toBe(true);
  });

  test("vim with multiple files", () => {
    expect(fsm.isValid(`vim ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("vim with read-only option", () => {
    expect(fsm.isValid(`vim -R ${testFile1}`)).toBe(true);
  });

  test("vim with recover option", () => {
    expect(fsm.isValid(`vim -r ${testFile1}`)).toBe(true);
  });

  test("vim with tag option", () => {
    expect(fsm.isValid("vim -t mytag")).toBe(true);
  });

  test("vim with command option", () => {
    expect(fsm.isValid(`vim +10 ${testFile1}`)).toBe(true);
  });

  test("vim with multiple options", () => {
    expect(fsm.isValid(`vim -R +10 ${testFile1}`)).toBe(true);
  });

  test("vim with non-existent file", () => {
    expect(fsm.isValid("vim non_existent_file.txt")).toBe(true);
  });

  test("vim with invalid option", () => {
    expect(fsm.isValid("vim --invalid-option")).toBe(true);
  });

  test("vim with quoted filename", () => {
    expect(fsm.isValid('vim "file with spaces.txt"')).toBe(true);
  });

  test("vim with ex mode", () => {
    expect(fsm.isValid("vim -e")).toBe(true);
  });

  test("vim with diff mode", () => {
    expect(fsm.isValid(`vim -d ${testFile1} ${testFile2}`)).toBe(true);
  });

  test("vim with server name", () => {
    expect(fsm.isValid("vim --servername MYSERVER")).toBe(true);
  });

  test("vim with remote file editing", () => {
    expect(fsm.isValid("vim --remote file.txt")).toBe(true);
  });

  test("vim with GUI option", () => {
    expect(fsm.isValid("vim -g")).toBe(true);
  });

  test("vim with readonly mode", () => {
    expect(fsm.isValid(`vim -R ${testFile1}`)).toBe(true);
  });
});
