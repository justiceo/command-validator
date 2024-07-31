import { BaseFSM } from "../base-fsm.js";

export class RmdirFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      rmdir: this.handleRmdir.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'r' ? "rmdir" : "invalid";
  }

  handleRmdir(char) {
    if ("mdir".indexOf(char) !== -1) return "rmdir";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return this.argumentSeen ? "valid" : "invalid";
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    if (/[a-zA-Z]/.test(char)) return "option";
    return "invalid";
  }

  handleArgument(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const rmdirTestCases = [
  { description: "Basic rmdir", input: "rmdir directory", expectedOutput: true },
  { description: "rmdir with option", input: "rmdir -p directory", expectedOutput: true },
  { description: "rmdir with multiple directories", input: "rmdir dir1 dir2 dir3", expectedOutput: true },
  { description: "rmdir with path", input: "rmdir /path/to/directory", expectedOutput: true },
  { description: "rmdir with option and path", input: "rmdir -p /path/to/directory", expectedOutput: true },
  { description: "rmdir with long option", input: "rmdir --parents /path/to/directory", expectedOutput: true },
  { description: "rmdir with quoted directory name", input: "rmdir 'My Directory'", expectedOutput: true },
  { description: "rmdir with escaped space", input: "rmdir My\\ Directory", expectedOutput: true },
  { description: "Invalid: rmdir without directory", input: "rmdir", expectedOutput: false },
  { description: "Invalid: rmdir with invalid option", input: "rmdir --invalid directory", expectedOutput: true }, // Considered valid syntactically
  { description: "rmdir with multiple options", input: "rmdir -p -v directory", expectedOutput: true },
  { description: "rmdir with verbose option", input: "rmdir --verbose directory", expectedOutput: true },
  { description: "rmdir with ignore-fail-on-non-empty option", input: "rmdir --ignore-fail-on-non-empty directory", expectedOutput: true },
  { description: "rmdir with path containing special characters", input: "rmdir /path/with/!@#$%^&*()", expectedOutput: true },
  { description: "rmdir with path containing unicode characters", input: "rmdir /path/with/üñîçødë", expectedOutput: true },
];