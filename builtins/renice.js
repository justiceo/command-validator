import { BaseFSM } from "../base-fsm.js";

export class ReniceFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.nicenessSeen = false;
    this.targetSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      renice: this.handleRenice.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      niceness: this.handleNiceness.bind(this),
      target: this.handleTarget.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'r' ? "renice" : "invalid";
  }

  handleRenice(char) {
    if ("enice".indexOf(char) !== -1) return "renice";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.nicenessSeen && /[0-9-]/.test(char)) return "niceness";
    if (!this.targetSeen) {
      this.targetSeen = true;
      return "target";
    }
    if (char === undefined) return this.targetSeen ? "valid" : "invalid";
    return "target";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    return "option";
  }

  handleNiceness(char) {
    if (char === ' ' || char === '\t') {
      this.nicenessSeen = true;
      return "space";
    }
    if (/[0-9]/.test(char)) return "niceness";
    if (char === undefined) return "invalid";
    return "invalid";
  }

  handleTarget(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "target";
  }

  isValid(command) {
    this.state = "start";
    this.nicenessSeen = false;
    this.targetSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const reniceTestCases = [
    { description: "Basic renice", input: "renice 10 1234", expectedOutput: true },
    { description: "renice with multiple PIDs", input: "renice 10 1234 5678 9012", expectedOutput: true },
    { description: "renice with negative niceness", input: "renice -10 1234", expectedOutput: true },
    { description: "renice with long option", input: "renice --priority 10 --pid 1234", expectedOutput: true },
    { description: "renice for all processes of a user", input: "renice 10 -u username", expectedOutput: true },
    { description: "renice for all processes of a group", input: "renice 10 -g groupname", expectedOutput: true },
    { description: "renice with mixed targets", input: "renice 10 -p 1234 -u username -g groupname", expectedOutput: true },
    { description: "renice without targets", input: "renice 10", expectedOutput: false },
    { description: "renice with invalid niceness", input: "renice abc 1234", expectedOutput: true }, // renice doesn't validate niceness at syntax level
    { description: "renice with extremely high niceness", input: "renice 1000 1234", expectedOutput: true },
    { description: "renice with extremely low niceness", input: "renice -1000 1234", expectedOutput: true },
    { description: "renice with multiple options", input: "renice -n 10 -p 1234 -n 20 -p 5678", expectedOutput: true },
    { description: "renice with extremely long input", input: "renice 10 " + "1234 ".repeat(100), expectedOutput: true },
    { description: "renice with quoted argument", input: "renice 10 -u 'user with spaces'", expectedOutput: true },
  ];