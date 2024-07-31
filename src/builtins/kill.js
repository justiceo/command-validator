import { BaseFSM } from "../base-fsm.js";

export class KillFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.pidSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      kill: this.handleKill.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      signal: this.handleSignal.bind(this),
      pid: this.handlePid.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'k' ? "kill" : "invalid";
  }

  handleKill(char) {
    if ("ill".indexOf(char) !== -1) return "kill";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.signalSeen && char === 'S') return "signal";
    if (!this.pidSeen && /[0-9]/.test(char)) {
      this.pidSeen = true;
      return "pid";
    }
    if (char === undefined) return this.pidSeen ? "valid" : "invalid";
    return "invalid";
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

  handlePid(char) {
    if (char === ' ' || char === '\t') return "space";
    if (/[0-9]/.test(char)) return "pid";
    if (char === undefined) return "valid";
    return "invalid";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.pidSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}
