import { BaseFSM } from "../base-fsm.js";

export class TopFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      top: this.handleTop.bind(this),
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
    return char === 't' ? "top" : "invalid";
  }

  handleTop(char) {
    if ("op".indexOf(char) !== -1) return "top";
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "valid";
    return "argument";
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
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const topTestCases = [
    { description: "Basic top", input: "top", expectedOutput: true },
    { description: "top with batch mode", input: "top -b", expectedOutput: true },
    { description: "top with iteration count", input: "top -n 5", expectedOutput: true },
    { description: "top with delay", input: "top -d 2", expectedOutput: true },
    { description: "top with specific PID", input: "top -p 1234", expectedOutput: true },
    { description: "top with multiple PIDs", input: "top -p 1234,5678,9012", expectedOutput: true },
    { description: "top with user filter", input: "top -u username", expectedOutput: true },
    { description: "top with sorting", input: "top -o %CPU", expectedOutput: true },
    { description: "top with multiple options", input: "top -b -n 5 -d 2 -p 1234", expectedOutput: true },
    { description: "top with long options", input: "top --batch --iterations=5 --delay=2", expectedOutput: true },
    { description: "top with invalid option", input: "top -z", expectedOutput: true }, // top doesn't validate option names at syntax level
    { description: "top with valid and invalid options", input: "top -b -z", expectedOutput: true },
    { description: "top with extremely long input", input: "top " + "-b ".repeat(50), expectedOutput: true },
    { description: "top with quoted argument", input: "top -c -p '1234 5678'", expectedOutput: true },
  ];