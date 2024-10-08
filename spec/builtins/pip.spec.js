import { CommandValidator } from "../../src/cmd-validator.js";

describe("pip command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic pip command", () => {
    expect(validator.validateCommand("pip")).toBe(true);
  });

  test("pip with install command", () => {
    expect(validator.validateCommand("pip install package-name")).toBe(true);
  });

  test("pip with uninstall command", () => {
    expect(validator.validateCommand("pip uninstall package-name")).toBe(true);
  });

  test("pip with list command", () => {
    expect(validator.validateCommand("pip list")).toBe(true);
  });

  test("pip with version option", () => {
    expect(validator.validateCommand("pip -V")).toBe(true);
  });

  test("pip with help option", () => {
    expect(validator.validateCommand("pip --help")).toBe(true);
  });

  test("pip with multiple options", () => {
    expect(validator.validateCommand("pip install --quiet --no-cache-dir package-name")).toBe(true);
  });

  test("pip with specific Python interpreter", () => {
    expect(validator.validateCommand("pip --python=python3.8 install package-name")).toBe(true);
  });

  test("pip with proxy option", () => {
    expect(validator.validateCommand("pip install --proxy http://user:password@proxy.server:port package-name")).toBe(true);
  });

  test("pip with retries option", () => {
    expect(validator.validateCommand("pip install --retries 3 package-name")).toBe(true);
  });

  test("Invalid: pip with unknown command", () => {
    expect(validator.validateCommand("pip unknown")).toBe(false);
  });

  test("Invalid: pip with space before command", () => {
    expect(validator.validateCommand(" pip install package-name")).toBe(false);
  });

  test("pip with timeout option", () => {
    expect(validator.validateCommand("pip install package-name --timeout 30")).toBe(true);
  });

  test("Invalid: pip with invalid option", () => {
    expect(validator.validateCommand("pip install --invalid-option package-name")).toBe(false);
  });

  test("pip with no-input option", () => {
    expect(validator.validateCommand("pip install --no-input package-name")).toBe(true);
  });

  test("pip with quiet option", () => {
    expect(validator.validateCommand("pip install -q package-name")).toBe(true);
  });

  test("Invalid: pip with unmatched quotes", () => {
    expect(validator.validateCommand("pip install 'package-name")).toBe(false);
  });

  test("pip with exists-action option", () => {
    expect(validator.validateCommand("pip install package-name --exists-action b")).toBe(true);
  });

  test("pip with disable-pip-version-check option", () => {
    expect(validator.validateCommand("pip install --disable-pip-version-check package-name")).toBe(true);
  });

  test("pip with cache-dir option", () => {
    expect(validator.validateCommand("pip install package-name --cache-dir /path/to/cache")).toBe(true);
  });

  test("pip with feature flag", () => {
    expect(validator.validateCommand("pip install package-name --use-feature=fast-deps")).toBe(true);
  });

  test("Invalid: pip with multiple spaces", () => {
    expect(validator.validateCommand("pip   install package-name")).toBe(false);
  });

  test("Invalid: pip with missing package requirement", () => {
    expect(validator.validateCommand("pip install --upgrade")).toBe(false);
  });

  test("Invalid: pip with wring command", () => {
    expect(validator.validateCommand("pip remove package-name")).toBe(false);
  });

  test("Invalid: pip with typo in command", () => {
    expect(validator.validateCommand("pip instll package-name")).toBe(false);
  });
});