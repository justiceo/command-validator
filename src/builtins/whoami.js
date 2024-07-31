import { BaseFSM } from "../base-fsm.js";

export class WhoamiFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.states = {
      start: this.handleStart.bind(this),
      whoami: this.handleWhoami.bind(this),
      space: this.handleSpace.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === "w" ? "whoami" : "invalid";
  }

  handleWhoami(char) {
    if ("hoami".indexOf(char) !== -1) return "whoami";
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  isValid(command) {
    this.state = "start";
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
