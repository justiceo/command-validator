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

export const killallTestCases = [
    { description: "Basic killall", input: "killall process_name", expectedOutput: true },
    { description: "killall with signal number", input: "killall -9 process_name", expectedOutput: true },
    { description: "killall with signal name", input: "killall -SIGKILL process_name", expectedOutput: true },
    { description: "killall with user filter", input: "killall -u username process_name", expectedOutput: true },
    { description: "killall with exact match", input: "killall -e process_name", expectedOutput: true },
    { description: "killall with ignore case", input: "killall -I PROCESS_NAME", expectedOutput: true },
    { description: "killall with wait mode", input: "killall -w process_name", expectedOutput: true },
    { description: "killall with quiet mode", input: "killall -q process_name", expectedOutput: true },
    { description: "killall with multiple process names", input: "killall proc1 proc2 proc3", expectedOutput: true },
    { description: "killall with multiple options", input: "killall -9 -u root -e process_name", expectedOutput: true },
    { description: "killall with long options", input: "killall --signal SIGKILL --user root process_name", expectedOutput: true },
    { description: "killall with invalid signal", input: "killall -999 process_name", expectedOutput: true }, // killall doesn't validate signal numbers at syntax level
    { description: "killall without process name", input: "killall", expectedOutput: false },
    { description: "killall with extremely long input", input: "killall " + "-9 ".repeat(50) + "process_name", expectedOutput: true },
    { description: "killall with quoted argument", input: "killall 'process name with spaces'", expectedOutput: true },
  ];