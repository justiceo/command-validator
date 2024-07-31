import { BaseFSM } from "../base-fsm.js";

export class GroupdelFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groupdel: this.handleGroupdel.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      groupname: this.handleGroupname.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === "g" ? "groupdel" : "invalid";
  }

  handleGroupdel(char) {
    if ("roupdel".indexOf(char) !== -1) return "groupdel";
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
    return "option";
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
