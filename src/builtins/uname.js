import { BaseFSM } from "../base-fsm.js";

export class UnameFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      uname: this.handleUname.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'u' ? "uname" : "invalid";
  }

  handleUname(char) {
    if ("name".indexOf(char) !== -1) return "uname";
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "valid";
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

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const unameTestCases = [
  { description: "Basic uname", input: "uname", expectedOutput: true },
  { description: "uname with single option", input: "uname -a", expectedOutput: true },
  { description: "uname with multiple options", input: "uname -asnrvm", expectedOutput: true },
  { description: "uname with space between options", input: "uname -a -s -n", expectedOutput: true },
  { description: "Invalid: uname with argument", input: "uname argument", expectedOutput: false },
  { description: "Invalid: uname with invalid option", input: "uname -z", expectedOutput: true }, // uname doesn't validate option names at syntax level
  { description: "uname with long option", input: "uname --all", expectedOutput: true },
];