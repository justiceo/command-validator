import { BaseFSM } from "../base-fsm.js";

export class HtopFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      htop: this.handleHtop.bind(this),
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
    return char === 'h' ? "htop" : "invalid";
  }

  handleHtop(char) {
    if ("top".indexOf(char) !== -1) return "htop";
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

export const htopTestCases = [
    { description: "Basic htop", input: "htop", expectedOutput: true },
    { description: "htop with user filter", input: "htop -u username", expectedOutput: true },
    { description: "htop with process filter", input: "htop -p 1234,5678", expectedOutput: true },
    { description: "htop with tree view", input: "htop -t", expectedOutput: true },
    { description: "htop with sorting", input: "htop -s PERCENT_CPU", expectedOutput: true },
    { description: "htop with delay", input: "htop -d 10", expectedOutput: true },
    { description: "htop with custom fields", input: "htop -C", expectedOutput: true },
    { description: "htop with multiple options", input: "htop -u root -p 1234 -t -s PERCENT_MEM", expectedOutput: true },
    { description: "htop with long options", input: "htop --user=root --pid=1234,5678 --tree --sort-key=PERCENT_CPU", expectedOutput: true },
    { description: "htop with invalid option", input: "htop -z", expectedOutput: true }, // htop doesn't validate option names at syntax level
    { description: "htop with valid and invalid options", input: "htop -t -z", expectedOutput: true },
    { description: "htop with extremely long input", input: "htop " + "-t ".repeat(50), expectedOutput: true },
    { description: "htop with quoted argument", input: "htop -u 'system user'", expectedOutput: true },
  ];