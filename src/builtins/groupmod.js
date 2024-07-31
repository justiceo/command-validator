import { BaseFSM } from "../base-fsm.js";

export class GroupmodFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groupmod: this.handleGroupmod.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      optionValue: this.handleOptionValue.bind(this),
      groupname: this.handleGroupname.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === "g" ? "groupmod" : "invalid";
  }

  handleGroupmod(char) {
    if ("roupmod".indexOf(char) !== -1) return "groupmod";
    if (char === " " || char === "\t") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (!this.groupnameSeen) {
      this.groupnameSeen = true;
      return "groupname";
    }
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleOptionValue(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleGroupname(char) {
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "groupname";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined) && this.groupnameSeen;
  }
}
