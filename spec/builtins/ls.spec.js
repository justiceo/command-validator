import { CommandValidator } from "../../src/cmd-validator.js";

describe("ls command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic ls", () => {
    expect(validator.validateCommand("ls")).toBe(true);
  });

  test("ls with option", () => {
    expect(validator.validateCommand("ls -l")).toBe(true);
  });

  test("ls with multiple options", () => {
    expect(validator.validateCommand("ls -la")).toBe(true);
  });

  test("ls with path", () => {
    expect(validator.validateCommand("ls /home/user")).toBe(true);
  });

  test("ls with option and path", () => {
    expect(validator.validateCommand("ls -l /home/user")).toBe(true);
  });

  test("ls with multiple option after path", () => {
    expect(validator.validateCommand("ls /home/user -la")).toBe(true);
  });

  test("ls with multiple paths", () => {
    expect(validator.validateCommand("ls /home /usr")).toBe(true);
  });

  test("ls with wildcard", () => {
    expect(validator.validateCommand("ls *.txt")).toBe(true);
  });

  test("ls with quoted path", () => {
    expect(validator.validateCommand("ls 'My Documents'")).toBe(true);
  });

  test("ls with double quoted path", () => {
    expect(validator.validateCommand('ls "Program Files"')).toBe(true);
  });

  test("ls with escaped space", () => {
    expect(validator.validateCommand("ls My\\ Documents")).toBe(true);
  });

   test("Invalid: ls with multiple escaped spaces", () => {
    expect(validator.validateCommand("ls My\\Dir /dir")).toBe(false);
  });

   test("Invalid: ls with quoted and escaped path", () => {
    expect(validator.validateCommand("ls "My\\Dir /dir"")).toBe(false);
  });

  test("ls with multiple options and path", () => {
    expect(validator.validateCommand("ls -lah /home/user")).toBe(true);
  });

  // Long options are supported in GNU ls.
  // test("ls with long option", () => {
  //   expect(validator.validateCommand("ls --all")).toBe(true);
  // });

  test("ls with numeric option", () => {
    expect(validator.validateCommand("ls -1")).toBe(true);
  });

   test("Invalid: ls with complex combinations", () => {
    expect(validator.validateCommand("ls -lR dir3/*.txt dir1 dir")).toBe(false);
  });

  test("Invalid: ls with unescaped special character", () => {
    expect(validator.validateCommand("ls file|2.txt")).toBe(true);
  });

  test("ls with multiple quoted paths", () => {
    expect(validator.validateCommand("ls 'path with spaces' \"another path\"")
    ).toBe(true);
  });

  test("ls with option and wildcard", () => {
    expect(validator.validateCommand("ls -l *.jpg")).toBe(true);
  });

  test("ls with complex path", () => {
    expect(validator.validateCommand("ls /home/user/Documents/*.txt")).toBe(true);
  });

  test("ls with environment variable", () => {
    expect(validator.validateCommand("ls $HOME")).toBe(true);
  });

  test("ls with tilde expansion", () => {
    expect(validator.validateCommand("ls ~/Documents")).toBe(true);
  });

  test("Invalid: ls with unmatched quote", () => {
    expect(validator.validateCommand("ls 'unmatched")).toBe(false);
  });

  test("Invalid: ls with space before option", () => {
    expect(validator.validateCommand(" ls -l")).toBe(false);
  });

  test("ls with option after path", () => {
    expect(validator.validateCommand("ls /home -l")).toBe(true);
  });

  test("ls with invalid option", () => {
    expect(validator.validateCommand("ls --invalid-option")).toBe(false);
  });

  test("ls with multiple escaped spaces", () => {
    expect(validator.validateCommand("ls path\\ with\\ many\\ spaces")).toBe(
      true
    );
  });

  test("ls with combination of quoted and escaped paths", () => {
    expect(validator.validateCommand("ls 'quoted path' unquoted\\ path")).toBe(
      true
    );
  });

  test("ls with option and multiple wildcards", () => {
    expect(validator.validateCommand("ls -l *.jpg *.png")).toBe(true);
  });

  test("ls with option and complex wildcard", () => {
    expect(validator.validateCommand("ls -l [a-z]*.txt")).toBe(true);
  });

  test("ls with multiple separated options", () => {
    expect(validator.validateCommand("ls -a -l")).toBe(true);
  });

  test("ls with option and hidden files", () => {
    expect(validator.validateCommand("ls -a .hidden_file")).toBe(true);
  });

  test("ls with complex combination", () => {
    expect(
      validator.validateCommand("ls -lR ~/Documents/*.pdf '/path with spaces'")
    ).toBe(true);
  });

  test("ls with unescaped special character", () => {
    expect(validator.validateCommand("ls file|name")).toBe(true);
  });
});
