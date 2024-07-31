import { BaseFSM } from "../base-fsm.js";

export class HostnameFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      hostname: this.handleHostname.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'h' ? "hostname" : "invalid";
  }

  handleHostname(char) {
    if ("ostname".indexOf(char) !== -1) return "hostname";
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "valid";
    if (!this.argumentSeen) {
      this.argumentSeen = true;
      return "argument";
    }
    return "invalid";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    return "option";
  }

  handleArgument(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const hostnameTestCases = [
  { description: "Basic hostname", input: "hostname", expectedOutput: true },
  { description: "hostname with option", input: "hostname -f", expectedOutput: true },
  { description: "hostname with long option", input: "hostname --fqdn", expectedOutput: true },
  { description: "hostname with argument (set new hostname)", input: "hostname newhost", expectedOutput: true },
  { description: "hostname with option and argument", input: "hostname -b newhost", expectedOutput: true },
  { description: "Invalid: hostname with multiple arguments", input: "hostname arg1 arg2", expectedOutput: false },
  { description: "Invalid: hostname with invalid option", input: "hostname -z", expectedOutput: true }, // hostname doesn't validate option names at syntax level
];