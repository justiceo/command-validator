import { CommandValidator } from "../../src/cmd-validator.js";

describe("mount command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic mount to directory", () => {
    expect(validator.validateCommand("mount /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount with file system type", () => {
    expect(validator.validateCommand("mount -t ext4 /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount all filesystems", () => {
    expect(validator.validateCommand("mount -a")).toBe(true);
  });

  test("Mount with read-only option", () => {
    expect(validator.validateCommand("mount -r /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount with read-write option", () => {
    expect(validator.validateCommand("mount -w /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount with verbose option", () => {
    expect(validator.validateCommand("mount -v /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount with fork option", () => {
    expect(validator.validateCommand("mount -a -F")).toBe(true);
  });

  test("Mount with UUID option", () => {
    expect(validator.validateCommand("mount -U uuid /mnt")).toBe(true);
  });

  test("Mount with label option", () => {
    expect(validator.validateCommand("mount -L label /mnt")).toBe(true);
  });

  test("Invalid: mount with no device specified", () => {
    expect(validator.validateCommand("mount /mnt")).toBe(false);
  });

  test("mount with invalid option", () => {
    expect(validator.validateCommand("mount --invalid-option /dev/sda1 /mnt")).toBe(true);
  });

  test("Invalid: typo in command", () => {
    expect(validator.validateCommand("mouunt -t ext4 /dev/sda1 /mnt")).toBe(false);
  });

  test("Invalid: mount with unmatched quote", () => {
    expect(validator.validateCommand("mount '/dev/sda1")).toBe(false);
  });

  test("Mount with multiple options", () => {
    expect(validator.validateCommand("mount -o rw,sync /dev/sda1 /mnt")).toBe(true);
  });

  test("Mount with help option", () => {
    expect(validator.validateCommand("mount -h")).toBe(true);
  });

  test("Mount with version option", () => {
    expect(validator.validateCommand("mount -V")).toBe(true);
  });
});