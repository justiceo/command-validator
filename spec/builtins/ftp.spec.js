import { CommandValidator } from "../../src/cmd-validator.js";

describe("ftp command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Connect to FTP server", () => {
    expect(validator.validateCommand('ftp ftp.example.com')).toBe(true);
  });

  test("Connect to FTP server with no auto-login", () => {
    expect(validator.validateCommand('ftp -n ftp.example.com')).toBe(true);
  });

  test("Run commands from a script file", () => {
    expect(validator.validateCommand('ftp -s:commands.txt ftp.example.com')).toBe(true);
  });

  test("Set buffer size for FTP transfer", () => {
    expect(validator.validateCommand('ftp -w:8192 ftp.example.com')).toBe(true);
  });

  test("Disable filename wildcards", () => {
    expect(validator.validateCommand('ftp -g ftp.example.com')).toBe(true);
  });

  test("Upload a local file to the remote host", () => {
    expect(validator.validateCommand('put local-file.txt remote-file.txt')).toBe(true);
  });

  test("Download a remote file to the local PC", () => {
    expect(validator.validateCommand('get remote-file.txt local-file.txt')).toBe(true);
  });

  test("Delete a remote file", () => {
    expect(validator.validateCommand('delete remote-file.txt')).toBe(true);
  });

  test("Change directory on the remote host", () => {
    expect(validator.validateCommand('cd /path/to/directory')).toBe(true);
  });

  test("Create a directory on the remote host", () => {
    expect(validator.validateCommand('mkdir new-directory')).toBe(true);
  });

  test("Delete a remote directory", () => {
    expect(validator.validateCommand('rmdir directory')).toBe(true);
  });

  test("List files in a remote directory", () => {
    expect(validator.validateCommand('ls /path/to/directory')).toBe(true);
  });

  test("Toggle interactive prompts off", () => {
    expect(validator.validateCommand('ftp -i ftp.example.com')).toBe(true);
  });

  test("Toggle verbose mode", () => {
    expect(validator.validateCommand('verbose')).toBe(true);
  });

  test("End the FTP session", () => {
    expect(validator.validateCommand('bye')).toBe(true);
  });

  test("Display help for a specific command", () => {
    expect(validator.validateCommand('help put')).toBe(true);
  });

  test("Invalid command handling", () => {
    expect(validator.validateCommand('ftp --invalid-option')).toBe(false);
  });

  test("Run a local command", () => {
    expect(validator.validateCommand('! ls')).toBe(true);
  });

  test("Set transfer type to binary", () => {
    expect(validator.validateCommand('binary')).toBe(true);
  });

  test("Set transfer type to ASCII", () => {
    expect(validator.validateCommand('ascii')).toBe(true);
  });
});
