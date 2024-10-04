import { CommandValidator } from "../../src/cmd-validator.js";

describe("passwd command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic passwd", () => {
    expect(validator.validateCommand("passwd")).toBe(true);
  });

  test("passwd with username", () => {
    expect(validator.validateCommand("passwd username")).toBe(true);
  });

  test("passwd with delete option", () => {
    expect(validator.validateCommand("passwd -d username")).toBe(true);
  });

  test("passwd with expire option", () => {
    expect(validator.validateCommand("passwd -e username")).toBe(true);
  });

  test("passwd with lock option", () => {
    expect(validator.validateCommand("passwd -l username")).toBe(true);
  });

  test("passwd with unlock option", () => {
    expect(validator.validateCommand("passwd -u username")).toBe(true);
  });

  test("passwd with status option", () => {
    expect(validator.validateCommand("passwd -S username")).toBe(true);
  });

  test("passwd with minimum days option", () => {
    expect(validator.validateCommand("passwd -n 5 username")).toBe(true);
  });

  test("passwd with maximum days option", () => {
    expect(validator.validateCommand("passwd -x 90 username")).toBe(true);
  });

  test("passwd with warning days option", () => {
    expect(validator.validateCommand("passwd -w 7 username")).toBe(true);
  });

  test("passwd with inactive days option", () => {
    expect(validator.validateCommand("passwd -i 30 username")).toBe(true);
  });

  test("passwd with keep tokens option", () => {
    expect(validator.validateCommand("passwd -k username")).toBe(true);
  });

  test("passwd with help option", () => {
    expect(validator.validateCommand("passwd --help")).toBe(true);
  });

  test("passwd with version option", () => {
    expect(validator.validateCommand("passwd --version")).toBe(true);
  });

  test("Invalid: passwd with invalid option", () => {
    expect(validator.validateCommand("passwd --invalid-option username")).toBe(false);
  });

   test("Invalid: passwd with typo", () => {
    expect(validator.validateCommand("passwwd ")).toBe(false);
  });

  test("Invalid: passwd with space before option", () => {
    expect(validator.validateCommand(" passwd -d username")).toBe(false);
  });

  test("Invalid: passwd with unmatched quote", () => {
    expect(validator.validateCommand("passwd 'unmatched")).toBe(false);
  });

  test("passwd with multiple options", () => {
    expect(validator.validateCommand("passwd -l -d username")).toBe(true);
  });

  test("passwd with repository option", () => {
    expect(validator.validateCommand("passwd -r some_repository username")).toBe(true);
  });

  test("passwd with root option", () => {
    expect(validator.validateCommand("passwd -R /some/chroot username")).toBe(true);
  });
});
