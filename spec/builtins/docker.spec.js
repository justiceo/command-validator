import { CommandValidator } from "../../src/cmd-validator.js";

describe("docker command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic docker command", () => {
    expect(validator.validateCommand("docker")).toBe(false);
  });

  test("docker with help option", () => {
    expect(validator.validateCommand("docker --help")).toBe(true);
  });

  test("docker with version option", () => {
    expect(validator.validateCommand("docker --version")).toBe(true);
  });

  test("docker with command", () => {
    expect(validator.validateCommand("docker run")).toBe(true);
  });

  test("docker with options", () => {
    expect(validator.validateCommand("docker --debug run")).toBe(true);
  });

  test("docker with multiple options", () => {
    expect(validator.validateCommand("docker --log-level=info --debug run")).toBe(true);
  });

  test("docker with config option", () => {
    expect(validator.validateCommand('docker --config="/path/to/config" run')).toBe(true);
  });

  test("docker with host option", () => {
    expect(validator.validateCommand("docker -H tcp://192.168.0.1:2375 run")).toBe(true);
  });

  test("docker with TLS options", () => {
    expect(validator.validateCommand("docker --tls --tlscacert=/path/to/ca.pem run")).toBe(true);
  });

  test("docker with invalid option", () => {
    expect(validator.validateCommand("docker --invalid-option run")).toBe(false);
  });

   test("docker with non existent immage", () => {
    expect(validator.validateCommand("docker run non_existent_image")).toBe(false);
  });

  test("docker with improper network reference", () => {
    expect(validator.validateCommand("docker --network non_existent_network myapp")).toBe(false);
  });

  test("docker with space before option", () => {
    expect(validator.validateCommand(" docker run")).toBe(true);
  });

  test("docker with command and argument", () => {
    expect(validator.validateCommand("docker run hello-world")).toBe(true);
  });

  test("docker with command and multiple arguments", () => {
    expect(validator.validateCommand("docker run -d --name my_container hello-world")).toBe(true);
  });

  test("docker with quoted arguments", () => {
    expect(validator.validateCommand('docker run "my image"')).toBe(true);
  });

  test("docker with escaped characters", () => {
    expect(validator.validateCommand("docker run my\\ image")).toBe(true);
  });

  test("docker with environment variable", () => {
    expect(validator.validateCommand("docker run -e MY_ENV=$HOME hello-world")).toBe(true);
  });

  test("docker with unsupported option combination", () => {
    expect(validator.validateCommand("docker --tls --debug --version run")).toBe(false);
  });

  test("docker with unsupported option combination", () => {
    expect(validator.validateCommand("dockerr --tls --debug --version run")).toBe(false);
  });
});