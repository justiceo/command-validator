import { CommandValidator } from "../../src/cmd-validator.js";

describe("curl command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic curl command without options", () => {
    expect(validator.validateCommand("curl http://example.com")).toBe(true);
  });

  test("curl with output to file using -o", () => {
    expect(validator.validateCommand("curl -o output.txt http://example.com")).toBe(true);
  });

  test("curl with remote name using -O", () => {
    expect(validator.validateCommand("curl -O http://example.com/file.txt")).toBe(true);
  });

  test("curl with verbose output using -v", () => {
    expect(validator.validateCommand("curl -v http://example.com")).toBe(true);
  });

  test("curl with user authentication using -u", () => {
    expect(validator.validateCommand("curl -u username:password http://example.com")).toBe(true);
  });

  test("curl with POST data using -d", () => {
    expect(validator.validateCommand("curl -d 'key=value' http://example.com")).toBe(true);
    expect(validator.validateCommand("curl -d @data.txt http://example.com")).toBe(true);
  });

  test("curl with header using -H", () => {
    expect(validator.validateCommand("curl -H 'Content-Type: application/json' http://example.com")).toBe(true);
  });

  test("curl with follow redirects using -L", () => {
    expect(validator.validateCommand("curl -L http://example.com")).toBe(true);
  });

  test("curl with silent mode using -s", () => {
    expect(validator.validateCommand("curl -s http://example.com")).toBe(true);
  });

  test("curl with limit rate using --limit-rate", () => {
    expect(validator.validateCommand("curl --limit-rate 100K http://example.com")).toBe(true);
  });

  test("curl with insecure SSL option using -k", () => {
    expect(validator.validateCommand("curl -k https://example.com")).toBe(true);
  });

  test("curl with multiple URLs", () => {
    expect(validator.validateCommand("curl http://example.com http://example.org")).toBe(true);
  });

  test("curl with tracing enabled", () => {
    expect(validator.validateCommand("curl --trace-ascii trace.txt http://example.com")).toBe(true);
  });

  test("Invalid: curl with an invalid option", () => {
    expect(validator.validateCommand("curl --invalid-option http://example.com")).toBe(false);
  });

  test("Invalid: curl with unmatched quotes", () => {
    expect(validator.validateCommand("curl -d 'data")).toBe(false);
  });

  test("curl with custom User-Agent", () => {
    expect(validator.validateCommand("curl -A 'CustomUserAgent' http://example.com")).toBe(true);
  });

  test("curl with FTP upload using -T", () => {
    expect(validator.validateCommand("curl -T localfile.txt ftp://ftp.example.com/")).toBe(true);
  });

  test("curl with proxy settings", () => {
    expect(validator.validateCommand("curl -x proxy:8080 http://example.com")).toBe(true);
  });

  test("curl with compressed response", () => {
    expect(validator.validateCommand("curl --compressed http://example.com")).toBe(true);
  });
});
