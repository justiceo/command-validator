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
