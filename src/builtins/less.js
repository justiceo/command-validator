import { BaseFSM } from "../base-fsm.js";

export class LessFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      less: this.handleLess.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      file: this.handleFile.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === "l" ? "less" : "invalid";
  }

  handleLess(char) {
    if ("ess".indexOf(char) !== -1) return "less";
    if (char === " " || char === "\t") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-" || char === "+") return "option";
    if (char === undefined) return "valid"; // less can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // less allows various option formats
  }

  handleFile(char) {
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "file";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
