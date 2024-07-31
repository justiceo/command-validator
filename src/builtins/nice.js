import { BaseFSM } from "../base-fsm.js";

export class NiceFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.nicenessSeen = false;
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      nice: this.handleNice.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      niceness: this.handleNiceness.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'n' ? "nice" : "invalid";
  }

  handleNice(char) {
    if ("ice".indexOf(char) !== -1) return "nice";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.nicenessSeen && /[0-9-]/.test(char)) return "niceness";
    if (!this.commandSeen) {
      this.commandSeen = true;
      return "command";
    }
    if (char === undefined) return this.commandSeen ? "valid" : "invalid";
    return "command";
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

  handleCommand(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.nicenessSeen = false;
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const niceTestCases = [
    { description: "Basic nice", input: "nice command", expectedOutput: true },
    { description: "nice with specific niceness", input: "nice -n 10 command", expectedOutput: true },
    { description: "nice with negative niceness", input: "nice -n -10 command", expectedOutput: true },
    { description: "nice with long option", input: "nice --adjustment=10 command", expectedOutput: true },
    { description: "nice with command and arguments", input: "nice command arg1 arg2", expectedOutput: true },
    { description: "nice with quoted command", input: "nice 'command with spaces'", expectedOutput: true },
    { description: "nice with pipeline", input: "nice command1 | command2", expectedOutput: true },
    { description: "nice with redirection", input: "nice command > output.txt", expectedOutput: true },
    { description: "nice without command", input: "nice", expectedOutput: false },
    { description: "nice with invalid niceness", input: "nice -n abc command", expectedOutput: true }, // nice doesn't validate niceness at syntax level
    { description: "nice with extremely high niceness", input: "nice -n 1000 command", expectedOutput: true },
    { description: "nice with extremely low niceness", input: "nice -n -1000 command", expectedOutput: true },
    { description: "nice with multiple options", input: "nice -n 10 -n 20 command", expectedOutput: true }, // Last option takes precedence
    { description: "nice with extremely long input", input: "nice " + "-n 10 ".repeat(50) + "command", expectedOutput: true },
  ];