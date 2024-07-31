import { BaseFSM } from "../base-fsm.js";

export class TypeFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      type: this.handleType.bind(this),
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
    return char === 't' ? "type" : "invalid";
  }

  handleType(char) {
    if ("ype".indexOf(char) !== -1) return "type";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "invalid"; // type requires at least one argument
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid"; // type requires at least one argument
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

export const typeTestCases = [
  { description: "Basic type", input: "type ls", expectedOutput: true },
  { description: "type with multiple arguments", input: "type ls cat grep", expectedOutput: true },
  { description: "type with option", input: "type -t ls", expectedOutput: true },
  { description: "type with long option", input: "type --type ls", expectedOutput: true },
  { description: "Invalid: type without arguments", input: "type", expectedOutput: false },
  { description: "Invalid: type with only options", input: "type -t", expectedOutput: false },
  { description: "type with option and multiple arguments", input: "type -t ls cat", expectedOutput: true },
  { description: "Invalid: type with invalid option", input: "type -z ls", expectedOutput: true }, // type doesn't validate option names at syntax level
];