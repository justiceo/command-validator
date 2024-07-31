import { BaseFSM } from "../base-fsm.js";

export class NohupFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      nohup: this.handleNohup.bind(this),
      space: this.handleSpace.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'n' ? "nohup" : "invalid";
  }

  handleNohup(char) {
    if ("ohup".indexOf(char) !== -1) return "nohup";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    this.commandSeen = true;
    return "command";
  }

  handleCommand(char) {
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined) && this.commandSeen;
  }
}
