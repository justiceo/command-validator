import { CommandValidator } from "../../src/cmd-validator.js";

describe("tmux command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic tmux command", () => {
    expect(validator.validateCommand("tmux")).toBe(true);
  });

  test("tmux with new session command", () => {
    expect(validator.validateCommand("tmux new-session")).toBe(true);
  });

  test("tmux with attach command", () => {
    expect(validator.validateCommand("tmux attach")).toBe(true);
  });

  test("tmux with detach command", () => {
    expect(validator.validateCommand("tmux detach")).toBe(true);
  });

  test("tmux with option -2", () => {
    expect(validator.validateCommand("tmux -2")).toBe(true);
  });

  test("tmux with option -C", () => {
    expect(validator.validateCommand("tmux -C")).toBe(true);
  });

  test("tmux with shell command option", () => {
    expect(validator.validateCommand("tmux -c 'echo Hello'")).toBe(true);
  });

  test("tmux with custom config file", () => {
    expect(validator.validateCommand("tmux -f ~/.tmux.conf")).toBe(true);
  });

  test("tmux with socket name option", () => {
    expect(validator.validateCommand("tmux -L mysocket")).toBe(true);
  });

  test("tmux with socket path option", () => {
    expect(validator.validateCommand("tmux -S /tmp/mytmux.sock")).toBe(true);
  });

  test("tmux with verbose logging", () => {
    expect(validator.validateCommand("tmux -v")).toBe(true);
  });

  test("tmux with version flag", () => {
    expect(validator.validateCommand("tmux -V")).toBe(true);
  });

  test("Invalid: tmux with unknown option", () => {
    expect(validator.validateCommand("tmux --unknown-option")).toBe(false);
  });

  test("Invalid: tmux with space before command", () => {
    expect(validator.validateCommand(" tmux new-session")).toBe(false);
  });

  test("tmux with multiple options", () => {
    expect(validator.validateCommand("tmux -2 -v")).toBe(true);
  });

  test("tmux with multiple commands", () => {
    expect(validator.validateCommand("tmux new-session -c 'mydir'")).toBe(true);
  });

  test("Invalid: tmux with unmatched quotes", () => {
    expect(validator.validateCommand("tmux -c 'echo Hello")).toBe(false);
  });

  test("tmux with features option", () => {
    expect(validator.validateCommand("tmux -T myfeatures")).toBe(true);
  });

  test("Invalid: tmux with double options", () => {
    expect(validator.validateCommand("tmux -C -C")).toBe(true);
  });

  test("tmux with login shell option", () => {
    expect(validator.validateCommand("tmux -l")).toBe(true);
  });

  test("tmux with do not start server option", () => {
    expect(validator.validateCommand("tmux -N")).toBe(true);
  });

  test("tmux with wrong config file type", () => {
    expect(validator.validateCommand("tmux -f file.txt")).toBe(true);
  });
});
