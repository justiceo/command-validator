import { BaseFSM } from "../base-fsm.js";

export class MvFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.sourcesSeen = 0;
    this.states = {
      start: this.handleStart.bind(this),
      mv: this.handleMv.bind(this),
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
    return char === 'm' ? "mv" : "invalid";
  }

  handleMv(char) {
    if (char === 'v') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return this.sourcesSeen >= 2 ? "valid" : "invalid";
    this.sourcesSeen++;
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
    if (char === undefined) return this.sourcesSeen >= 2 ? "valid" : "invalid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.sourcesSeen = 0;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const mvTestCases = [
  { description: "Basic mv", input: "mv source destination", expectedOutput: true },
  { description: "mv with option", input: "mv -i source destination", expectedOutput: true },
  { description: "mv with multiple sources", input: "mv file1 file2 file3 destination", expectedOutput: true },
  { description: "mv with path", input: "mv /path/to/source /path/to/destination", expectedOutput: true },
  { description: "mv with option and path", input: "mv -f /path/to/source /path/to/destination", expectedOutput: true },
  { description: "mv with long option", input: "mv --force source destination", expectedOutput: true },
  { description: "mv with quoted file names", input: "mv 'source file.txt' 'destination file.txt'", expectedOutput: true },
  { description: "mv with escaped space", input: "mv source\\ file.txt destination\\ file.txt", expectedOutput: true },
  { description: "Invalid: mv without destination", input: "mv source", expectedOutput: false },
  { description: "Invalid: mv without source and destination", input: "mv", expectedOutput: false },
  { description: "mv with multiple options", input: "mv -i -v source destination", expectedOutput: true },
  { description: "mv with update option", input: "mv -u source destination", expectedOutput: true },
  { description: "mv with backup option", input: "mv --backup=numbered source destination", expectedOutput: true },
  { description: "mv with target-directory option", input: "mv --target-directory=dest file1 file2", expectedOutput: true },
  { description: "mv with no-clobber option", input: "mv -n source destination", expectedOutput: true },
];