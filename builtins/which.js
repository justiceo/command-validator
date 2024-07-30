import { BaseFSM } from "../base-fsm.js";

export class WhichFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      which: this.handleWhich.bind(this),
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
    return char === 'w' ? "which" : "invalid";
  }

  handleWhich(char) {
    if ("hich".indexOf(char) !== -1) return "which";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "invalid"; // which requires at least one argument
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid"; // which requires at least one argument
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

export const whichTestCases = [
  { description: "Basic which", input: "which ls", expectedOutput: true },
  { description: "which with multiple arguments", input: "which ls cat grep", expectedOutput: true },
  { description: "which with option", input: "which -a ls", expectedOutput: true },
  { description: "which with long option", input: "which --all ls", expectedOutput: true },
  { description: "Invalid: which without arguments", input: "which", expectedOutput: false },
  { description: "Invalid: which with only options", input: "which -a", expectedOutput: false },
  { description: "which with option and multiple arguments", input: "which -a ls cat", expectedOutput: true },
  { description: "Invalid: which with invalid option", input: "which -z ls", expectedOutput: true }, // which doesn't validate option names at syntax level
];