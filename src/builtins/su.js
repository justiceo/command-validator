import { BaseFSM } from "../base-fsm.js";

export class SuFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      su: this.handleSu.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      username: this.handleUsername.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 's' ? "su" : "invalid";
  }

  handleSu(char) {
    if (char === 'u') return "su";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.usernameSeen) {
      this.usernameSeen = true;
      return "username";
    }
    if (!this.commandSeen) {
      this.commandSeen = true;
      return "command";
    }
    if (char === undefined) return "valid";
    return "command";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    return "option";
  }

  handleUsername(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "username";
  }

  handleCommand(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
