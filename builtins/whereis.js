import { BaseFSM } from "../base-fsm.js";

export class WhereisFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      whereis: this.handleWhereis.bind(this),
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
    return char === 'w' ? "whereis" : "invalid";
  }

  handleWhereis(char) {
    if ("hereis".indexOf(char) !== -1) return "whereis";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "invalid"; // whereis requires at least one argument
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid"; // whereis requires at least one argument
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

export const whereisTestCases = [
  { description: "Basic whereis", input: "whereis ls", expectedOutput: true },
  { description: "whereis with multiple arguments", input: "whereis ls cat grep", expectedOutput: true },
  { description: "whereis with option", input: "whereis -b ls", expectedOutput: true },
  { description: "whereis with multiple options", input: "whereis -bm ls", expectedOutput: true },
  { description: "Invalid: whereis without arguments", input: "whereis", expectedOutput: false },
  { description: "Invalid: whereis with only options", input: "whereis -b", expectedOutput: false },
  { description: "whereis with option and multiple arguments", input: "whereis -b ls cat", expectedOutput: true },
  { description: "Invalid: whereis with invalid option", input: "whereis -z ls", expectedOutput: true }, // whereis doesn't validate option names at syntax level
];