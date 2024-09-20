import { CommandValidator } from "../../src/cmd-validator.js";

describe("node command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic node command", () => {
    expect(validator.validateCommand("node")).toBe(true);
  });

  test("node with script", () => {
    expect(validator.validateCommand("node script.js")).toBe(true);
  });

  test("node with eval option", () => {
    expect(validator.validateCommand('node -e "console.log(\'Hello World\')"')).toBe(true);
  });

  test("node with arguments", () => {
    expect(validator.validateCommand("node script.js arg1 arg2")).toBe(true);
  });

  test("node with stdin option", () => {
    expect(validator.validateCommand("node -")).toBe(true);
  });

  test("node with end of options", () => {
    expect(validator.validateCommand("node -- arg1 arg2")).toBe(true);
  });

  test("node with multiple options", () => {
    expect(validator.validateCommand("node --inspect --no-warnings")).toBe(true);
  });

  test("node with abort option", () => {
    expect(validator.validateCommand("node --abort-on-uncaught-exception")).toBe(true);
  });

  test("node with custom conditions", () => {
    expect(validator.validateCommand("node --conditions=development")).toBe(true);
  });

  test("node with memory debug option", () => {
    expect(validator.validateCommand("node --node-memory-debug")).toBe(true);
  });

  test("node with maximum header size", () => {
    expect(validator.validateCommand("node --max-http-header-size=8192")).toBe(true);
  });

  test("Invalid: node with invalid option", () => {
    expect(validator.validateCommand("node --invalid-option")).toBe(false);
  });

  test("Invalid: node with space before script", () => {
    expect(validator.validateCommand("node  script.js")).toBe(false);
  });

  test("node with inspector options", () => {
    expect(validator.validateCommand("node --inspect=127.0.0.1:9229 script.js")).toBe(true);
  });

  test("node with experimental options", () => {
    expect(validator.validateCommand("node --experimental-fetch script.js")).toBe(true);
  });

  test("Invalid: node with unmatched quote", () => {
    expect(validator.validateCommand('node -e "console.log(\'Hello')).toBe(false);
  });

  test("node with specified title", () => {
    expect(validator.validateCommand("node --title=my-app script.js")).toBe(true);
  });

  test("node with signal option", () => {
    expect(validator.validateCommand("node --report-signal SIGUSR1")).toBe(true);
  });

  test("node with test runner option", () => {
    expect(validator.validateCommand("node --test script.js")).toBe(true);
  });

  test("Invalid: node with multiple scripts incorrectly", () => {
    expect(validator.validateCommand("node script1.js script2.js --arg")).toBe(false);
  });
});
