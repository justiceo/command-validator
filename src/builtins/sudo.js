import { BaseFSM } from "../base-fsm.js";

export class SudoFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      sudo: this.handleSudo.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 's' ? "sudo" : "invalid";
  }

  handleSudo(char) {
    if ("udo".indexOf(char) !== -1) return "sudo";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
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

  handleCommand(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
