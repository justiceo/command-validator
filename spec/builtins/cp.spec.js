import { CpFSM } from "../../src/builtins/cp.js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

describe("CpFSM", () => {
  let fsm;
  let tempDir;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cp-test-"));
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fsm = new CpFSM();
  });

  test("Basic cp", () => {
    const sourceFile = path.join(tempDir, "source");
    const destFile = path.join(tempDir, "dest");
    fs.writeFileSync(sourceFile, "Test content");
    expect(fsm.isValid(`cp ${sourceFile} ${destFile}`)).toBe(true);
    execSync(`cp ${sourceFile} ${destFile}`);
    expect(fs.existsSync(destFile)).toBe(true);
    expect(fs.readFileSync(destFile, "utf8")).toBe("Test content");
  });

  test("cp with -r option", () => {
    const sourceDir = path.join(tempDir, "sourcedir");
    const destDir = path.join(tempDir, "destdir");
    fs.mkdirSync(sourceDir);
    fs.writeFileSync(path.join(sourceDir, "file"), "Content");
    expect(fsm.isValid(`cp -r ${sourceDir} ${destDir}`)).toBe(true);
    execSync(`cp -r ${sourceDir} ${destDir}`);
    expect(fs.existsSync(destDir)).toBe(true);
    expect(fs.existsSync(path.join(destDir, "file"))).toBe(true);
  });

  test("cp with multiple sources", () => {
    const file1 = path.join(tempDir, "file1");
    const file2 = path.join(tempDir, "file2");
    const destDir = path.join(tempDir, "destdir");
    fs.writeFileSync(file1, "Content 1");
    fs.writeFileSync(file2, "Content 2");
    fs.mkdirSync(destDir);
    expect(fsm.isValid(`cp ${file1} ${file2} ${destDir}`)).toBe(true);
    execSync(`cp ${file1} ${file2} ${destDir}`);
    expect(fs.existsSync(path.join(destDir, "file1"))).toBe(true);
    expect(fs.existsSync(path.join(destDir, "file2"))).toBe(true);
  });

  test("cp with -p option", () => {
    const sourceFile = path.join(tempDir, "source");
    const destFile = path.join(tempDir, "dest");
    fs.writeFileSync(sourceFile, "Test content");
    const originalStats = fs.statSync(sourceFile);
    expect(fsm.isValid(`cp -p ${sourceFile} ${destFile}`)).toBe(true);
    execSync(`cp -p ${sourceFile} ${destFile}`);
    const newStats = fs.statSync(destFile);
    expect(newStats.mode).toBe(originalStats.mode);
    expect(newStats.mtime.getTime()).toBe(originalStats.mtime.getTime());
  });

  test("cp with non-existent source", () => {
    const nonExistentFile = path.join(tempDir, "nonexistent");
    const destFile = path.join(tempDir, "dest");
    expect(fsm.isValid(`cp ${nonExistentFile} ${destFile}`)).toBe(true);
    expect(() => execSync(`cp ${nonExistentFile} ${destFile}`)).toThrow();
  });

  test("cp with invalid option", () => {
    const sourceFile = path.join(tempDir, "source");
    const destFile = path.join(tempDir, "dest");
    expect(fsm.isValid(`cp -z ${sourceFile} ${destFile}`)).toBe(true); // The FSM allows invalid options
    expect(() => execSync(`cp -z ${sourceFile} ${destFile}`)).toThrow();
  });
});
