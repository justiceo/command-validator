import { BaseFSM } from "../base-fsm.js";

export class LsFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.states = {
      start: this.handleStart.bind(this),
      ls: this.handleLs.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
      quoted: this.handleQuoted.bind(this),
    };
  }

  transition(char) {
    if (this.escapeNext) {
      this.escapeNext = false;
      return this.handleEscaped(char);
    }
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    if (char === "l") return "ls";
    return "invalid";
  }

  handleLs(char) {
    if (char === "s") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (char === undefined) return "valid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    if (/[a-zA-Z1]/.test(char)) return "option";
    return "invalid";
  }

  handleArgument(char) {
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    return "argument";
  }

  handleQuoted(char) {
    if (char === undefined) return "invalid";
    if (char === this.quotedState) {
      this.quotedState = null;
      return "argument";
    }
    if (char === "\\") {
      this.escapeNext = true;
    }
    return "quoted";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return this.state;
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
