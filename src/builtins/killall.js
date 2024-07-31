import { BaseFSM } from "../base-fsm.js";

export class KillallFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.processSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      killall: this.handleKillall.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      signal: this.handleSignal.bind(this),
      process: this.handleProcess.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'k' ? "killall" : "invalid";
  }

  handleKillall(char) {
    if ("illall".indexOf(char) !== -1) return "killall";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.signalSeen && char === 'S') return "signal";
    if (!this.processSeen) {
      this.processSeen = true;
      return "process";
    }
    if (char === undefined) return this.processSeen ? "valid" : "invalid";
    return "process";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "option";
  }

  handleSignal(char) {
    if (char === ' ' || char === '\t') {
      this.signalSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "signal";
  }

  handleProcess(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "process";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.processSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
