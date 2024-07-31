import { PsFSM } from "../../src/builtins/ps.js";

describe("PsFSM", () => {
  let fsm;

  beforeEach(() => {
    fsm = new PsFSM();
  });

  test("Basic ps command", () => {
    expect(fsm.isValid("ps")).toBe(true);
  });

  test("ps with single option", () => {
    expect(fsm.isValid("ps -e")).toBe(true);
  });

  test("ps with multiple options", () => {
    expect(fsm.isValid("ps -ef")).toBe(true);
  });

  test("ps with long option", () => {
    expect(fsm.isValid("ps --pid 1234")).toBe(true);
  });

  test("ps with invalid option", () => {
    expect(fsm.isValid("ps -z")).toBe(true); // ps doesn't validate option names at syntax level
  });
});
