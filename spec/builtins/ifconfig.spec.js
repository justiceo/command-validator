import { CommandValidator } from "../../src/cmd-validator.js";

describe("ifconfig command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Display all interfaces", () => {
    expect(validator.validateCommand("ifconfig")).toBe(true);
  });

  test("Activate a network interface", () => {
    expect(validator.validateCommand("ifconfig eth0 up")).toBe(true);
  });

  test("Invalid: Wrong order of argument", () => {
    expect(validator.validateCommand("ifconfig -v -a  eth0 -s")).toBe(false);
  });

  test("Deactivate a network interface", () => {
    expect(validator.validateCommand("ifconfig eth0 down")).toBe(true);
  });

  test("Set the IP address of an interface", () => {
    expect(validator.validateCommand("ifconfig eth0 192.168.1.10")).toBe(true);
  });

  test("Set the netmask of an interface", () => {
    expect(validator.validateCommand("ifconfig eth0 netmask 255.255.255.0")).toBe(true);
  });

  test("Enable promiscuous mode", () => {
    expect(validator.validateCommand("ifconfig eth0 promisc")).toBe(true);
  });

  test("Disable promiscuous mode", () => {
    expect(validator.validateCommand("ifconfig eth0 -promisc")).toBe(true);
  });

  test("Set the MTU of an interface", () => {
    expect(validator.validateCommand("ifconfig eth0 mtu 1500")).toBe(true);
  });

  test("Add an IPv6 address", () => {
    expect(validator.validateCommand("ifconfig eth0 add 2001:db8::1/64")).toBe(true);
  });

  test("Remove an IPv6 address", () => {
    expect(validator.validateCommand("ifconfig eth0 del 2001:db8::1/64")).toBe(true);
  });

  test("Enable multicast on an interface", () => {
    expect(validator.validateCommand("ifconfig eth0 multicast")).toBe(true);
  });

  test("Set hardware address", () => {
    expect(validator.validateCommand("ifconfig eth0 hw ether 00:11:22:33:44:55")).toBe(true);
  });

  test("Invalid command usage", () => {
    expect(validator.validateCommand("ifconfig --invalid-option")).toBe(false);
  });

   test("Wrong combination of options", () => {
    expect(validator.validateCommand("ifconfig -va")).toBe(false);
  });

  test("Check for valid combination of options", () => {
    expect(validator.validateCommand("ifconfig eth0 192.168.1.10 netmask 255.255.255.0 up")).toBe(true);
  });
});
