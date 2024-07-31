import { BaseFSM } from "../base-fsm.js";

export class MkdirFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.parenthesesDepth = 0;
    this.states = {
      start: this.handleStart.bind(this),
      mkdir: this.handleMkdir.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
      quoted: this.handleQuoted.bind(this),
      parentheses: this.handleParentheses.bind(this),
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
    if (char === "m") return "mkdir";
    return "invalid";
  }

  handleMkdir(char) {
    if ("mkdir".indexOf(char) !== -1) return "mkdir";
    if (char === " " || char === "\t") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (char === undefined) return this.argumentSeen ? "valid" : "invalid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    if (char === "(") {
      this.parenthesesDepth++;
      return "parentheses";
    }
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid"; // mkdir requires at least one directory argument
    if (/[a-zA-Z]/.test(char)) return "option";
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
    if (char === "(") {
      this.parenthesesDepth++;
      return "parentheses";
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

  handleParentheses(char) {
    if (char === "(") {
      this.parenthesesDepth++;
    } else if (char === ")") {
      this.parenthesesDepth--;
      if (this.parenthesesDepth === 0) {
        return "argument";
      }
    } else if (char === undefined) {
      return "invalid";
    }
    return "parentheses";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.parenthesesDepth = 0;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
