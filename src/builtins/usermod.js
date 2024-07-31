import { BaseFSM } from "../base-fsm.js";

export class UsermodFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      usermod: this.handleUsermod.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      optionValue: this.handleOptionValue.bind(this),
      username: this.handleUsername.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'u' ? "usermod" : "invalid";
  }

  handleUsermod(char) {
    if ("sermod".indexOf(char) !== -1) return "usermod";
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
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleOptionValue(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleUsername(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "username";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined) && this.usernameSeen;
  }
}
