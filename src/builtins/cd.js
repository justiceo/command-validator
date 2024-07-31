import { BaseFSM } from "../base-fsm.js";

/**
 * Finite State Machine to validate the syntax of a cd command
 */
export class CdFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.hasSeenArgument = false;
    this.parenthesisDepth = 0;
    this.states = {
      start: this.handleStart.bind(this),
      cd: this.handleCd.bind(this),
      space: this.handleSpace.bind(this),
      dash: this.handleDash.bind(this),
      tilde: this.handleTilde.bind(this),
      dollar: this.handleDollar.bind(this),
      quoted: this.handleQuoted.bind(this),
      unquoted: this.handleUnquoted.bind(this),
      parenthesis: this.handleParenthesis.bind(this),
      escaped: this.handleEscaped.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    if (char === "c") return "cd";
    return "invalid";
  }

  handleCd(char) {
    if (char === "d") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (this.hasSeenArgument && this.parenthesisDepth === 0) return "invalid";
    if (char === "-") return "dash";
    if (char === "~") return "tilde";
    if (char === "$") return "dollar";
    if (char === '"') return "quoted";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    if (char === "\\") return "escaped";
    if (char === undefined) return "valid";
    this.hasSeenArgument = true;
    return "unquoted";
  }

  handleDash(char) {
    if (/[a-zA-Z]/.test(char)) return "unquoted";
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleTilde(char) {
    this.hasSeenArgument = true;
    if (/[a-zA-Z0-9*-]/.test(char) || char === "/") return "unquoted";
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleDollar(char) {
    this.hasSeenArgument = true;
    if (char === "{") return "unquoted";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    return "unquoted";
  }

  handleQuoted(char) {
    this.hasSeenArgument = true;
    if (char === '"') return "unquoted";
    if (char === undefined) return "invalid";
    return "quoted";
  }

  handleUnquoted(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "\\") return "escaped";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    if (char === ")" && this.parenthesisDepth > 0) {
      this.parenthesisDepth--;
      return this.parenthesisDepth === 0 ? "unquoted" : "parenthesis";
    }
    if (char === undefined) return "valid";
    return "unquoted";
  }

  handleParenthesis(char) {
    if (char === "(") {
      this.parenthesisDepth++;
    } else if (char === ")") {
      this.parenthesisDepth--;
      if (this.parenthesisDepth === 0) return "unquoted";
    }
    if (char === undefined) return "invalid";
    return "parenthesis";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return "unquoted";
  }

  isValid(command) {
    this.state = "start";
    this.hasSeenArgument = false;
    this.parenthesisDepth = 0;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
