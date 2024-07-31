import { BaseFSM } from "../base-fsm.js";

export class TouchFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      touch: this.handleTouch.bind(this),
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
    return char === 't' ? "touch" : "invalid";
  }

  handleTouch(char) {
    if ("ouch".indexOf(char) !== -1) return "touch";
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

export const touchTestCases = [
  { description: "Basic touch", input: "touch file", expectedOutput: true },
  { description: "touch with option", input: "touch -a file", expectedOutput: true },
  { description: "touch with multiple files", input: "touch file1 file2 file3", expectedOutput: true },
  { description: "touch with path", input: "touch /path/to/file", expectedOutput: true },
  { description: "touch with option and path", input: "touch -m /path/to/file", expectedOutput: true },
  { description: "touch with long option", input: "touch --no-create file", expectedOutput: true },
  { description: "touch with quoted file name", input: "touch 'file with spaces.txt'", expectedOutput: true },
  { description: "touch with escaped space", input: "touch file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "Invalid: touch without file", input: "touch", expectedOutput: false },
  { description: "touch with multiple options", input: "touch -am file", expectedOutput: true },
  { description: "touch with date option", input: "touch -d '2023-07-30 12:00:00' file", expectedOutput: true },
  { description: "touch with reference file option", input: "touch -r reference_file target_file", expectedOutput: true },
  { description: "touch with no-dereference option", input: "touch -h symbolic_link", expectedOutput: true },
  { description: "touch with time option", input: "touch -t 202307301200.00 file", expectedOutput: true },
];