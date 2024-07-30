import { BaseFSM } from "../base-fsm.js";

export class RmFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      rm: this.handleRm.bind(this),
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
    return char === 'r' ? "rm" : "invalid";
  }

  handleRm(char) {
    if (char === 'm') return "space";
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

export const rmTestCases = [  
    { description: "Basic rm", input: "rm file", expectedOutput: true },
    { description: "rm with option", input: "rm -r directory", expectedOutput: true },
    { description: "rm with multiple files", input: "rm file1 file2 file3", expectedOutput: true },
    { description: "rm with path", input: "rm /path/to/file", expectedOutput: true },
    { description: "rm with option and path", input: "rm -f /path/to/file", expectedOutput: true },
    { description: "rm with long option", input: "rm --recursive directory", expectedOutput: true },
    { description: "rm with quoted file name", input: "rm 'file with spaces.txt'", expectedOutput: true },
    { description: "rm with escaped space", input: "rm file\\ with\\ spaces.txt", expectedOutput: true },
    { description: "Invalid: rm without file", input: "rm", expectedOutput: false },
    { description: "rm with multiple options", input: "rm -rf directory", expectedOutput: true },
    { description: "rm with force option", input: "rm --force file", expectedOutput: true },
    { description: "rm with interactive option", input: "rm -i file", expectedOutput: true },
    { description: "rm with verbose option", input: "rm -v file", expectedOutput: true },
    { description: "rm with preserve-root option", input: "rm --preserve-root -rf /", expectedOutput: true },
    { description: "rm with no-preserve-root option", input: "rm --no-preserve-root -rf /", expectedOutput: true },
  ];