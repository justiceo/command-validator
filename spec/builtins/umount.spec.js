import { CommandValidator } from "../../src/cmd-validator.js";

describe("umount command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic umount", () => {
    expect(validator.validateCommand("umount /mnt/point")).toBe(true);
  });

  test("umount with lazy option", () => {
    expect(validator.validateCommand("umount -l /mnt/point")).toBe(true);
  });

  test("umount with verbose option", () => {
    expect(validator.validateCommand("umount -v /mnt/point")).toBe(true);
  });

  test("umount with help option", () => {
    expect(validator.validateCommand("umount -h")).toBe(true);
  });

  test("umount with version option", () => {
    expect(validator.validateCommand("umount -V")).toBe(true);
  });

  test("umount with force option", () => {
    expect(validator.validateCommand("umount -f /mnt/point")).toBe(true);
  });

  test("umount with all option", () => {
    expect(validator.validateCommand("umount -a")).toBe(true);
  });

  test("umount with multiple options", () => {
    expect(validator.validateCommand("umount -dfl /mnt/point")).toBe(true);
  });

  test("Invalid: umount with unmatched option", () => {
    expect(validator.validateCommand("umount --invalid-option")).toBe(false);
  });

  test("Invalid: umount with space before command", () => {
    expect(validator.validateCommand(" umount /mnt/point")).toBe(false);
  });

  test("umount with specified filesystem type", () => {
    expect(validator.validateCommand("umount -t ext4 /mnt/point")).toBe(true);
  });

  test("umount with specified options", () => {
    expect(validator.validateCommand("umount -O options /mnt/point")).toBe(true);
  });
});
