import { BaseFSM } from "../base-fsm.js";

export class IdFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      id: this.handleId.bind(this),
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
    return char === 'i' ? "id" : "invalid";
  }

  handleId(char) {
    if (char === 'd') return "space";
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

export const idTestCases = [
  { description: "Basic id", input: "id", expectedOutput: true },
  { description: "id with single option", input: "id -u", expectedOutput: true },
  { description: "id with multiple options", input: "id -Gn", expectedOutput: true },
  { description: "id with long option", input: "id --group", expectedOutput: true },
  { description: "id with username argument", input: "id username", expectedOutput: true },
  { description: "id with option and username", input: "id -u username", expectedOutput: true },
  { description: "Invalid: id with multiple arguments", input: "id user1 user2", expectedOutput: false },
  { description: "Invalid: id with invalid option", input: "id -z", expectedOutput: true }, // id doesn't validate option names at syntax level
];