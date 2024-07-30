import { BaseFSM } from "../base-fsm.js";

export class PkillFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.patternSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      pkill: this.handlePkill.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      signal: this.handleSignal.bind(this),
      pattern: this.handlePattern.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'p' ? "pkill" : "invalid";
  }

  handlePkill(char) {
    if ("kill".indexOf(char) !== -1) return "pkill";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.signalSeen && char === 'S') return "signal";
    if (!this.patternSeen) {
      this.patternSeen = true;
      return "pattern";
    }
    if (char === undefined) return this.patternSeen ? "valid" : "invalid";
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

  handlePattern(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "pattern";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.signalSeen = false;
    this.patternSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const pkillTestCases = [
    { description: "Basic pkill", input: "pkill process_name", expectedOutput: true },
    { description: "pkill with signal number", input: "pkill -9 process_name", expectedOutput: true },
    { description: "pkill with signal name", input: "pkill -SIGKILL process_name", expectedOutput: true },
    { description: "pkill with user filter", input: "pkill -u username process_name", expectedOutput: true },
    { description: "pkill with group filter", input: "pkill -G groupname process_name", expectedOutput: true },
    { description: "pkill with parent PID filter", input: "pkill -P 1234 process_name", expectedOutput: true },
    { description: "pkill with full command match", input: "pkill -f 'command with args'", expectedOutput: true },
    { description: "pkill with exact match", input: "pkill -x process_name", expectedOutput: true },
    { description: "pkill with multiple options", input: "pkill -9 -u root -x process_name", expectedOutput: true },
    { description: "pkill with long options", input: "pkill --signal SIGKILL --user root process_name", expectedOutput: true },
    { description: "pkill with invalid signal", input: "pkill -999 process_name", expectedOutput: true }, // pkill doesn't validate signal numbers at syntax level
    { description: "pkill without process name", input: "pkill", expectedOutput: false },
    { description: "pkill with extremely long input", input: "pkill " + "-9 ".repeat(50) + "process_name", expectedOutput: true },
    { description: "pkill with quoted argument", input: "pkill -f 'python script.py --arg=value'", expectedOutput: true },
  ];