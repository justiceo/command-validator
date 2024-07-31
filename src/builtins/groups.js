import { BaseFSM } from "../base-fsm.js";

export class GroupsFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groups: this.handleGroups.bind(this),
      space: this.handleSpace.bind(this),
      argument: this.handleArgument.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'g' ? "groups" : "invalid";
  }

  handleGroups(char) {
    if ("roups".indexOf(char) !== -1) return "groups";
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    if (!this.argumentSeen) {
      this.argumentSeen = true;
      return "argument";
    }
    return "invalid";
  }

  handleArgument(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.argumentSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const groupsTestCases = [
  { description: "Basic groups", input: "groups", expectedOutput: true },
  { description: "groups with username", input: "groups username", expectedOutput: true },
  { description: "groups with multiple usernames", input: "groups user1 user2", expectedOutput: true },
  { description: "Invalid: groups with option", input: "groups -a", expectedOutput: false },
];