import { BaseFSM } from "../base-fsm.js";

export class LnFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.sourcesSeen = 0;
    this.states = {
      start: this.handleStart.bind(this),
      ln: this.handleLn.bind(this),
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
    return char === 'l' ? "ln" : "invalid";
  }

  handleLn(char) {
    if (char === 'n') return "space";
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

export const lnTestCases = [
  { description: "Basic ln", input: "ln source destination", expectedOutput: true },
  { description: "ln with option", input: "ln -s source destination", expectedOutput: true },
  { description: "ln with path", input: "ln /path/to/source /path/to/destination", expectedOutput: true },
  { description: "ln with option and path", input: "ln -f /path/to/source /path/to/destination", expectedOutput: true },
  { description: "ln with long option", input: "ln --symbolic source destination", expectedOutput: true },
  { description: "ln with quoted file names", input: "ln 'source file.txt' 'destination file.txt'", expectedOutput: true },
  { description: "ln with escaped space", input: "ln source\\ file.txt destination\\ file.txt", expectedOutput: true },
  { description: "Invalid: ln without destination", input: "ln source", expectedOutput: false },
  { description: "Invalid: ln without source and destination", input: "ln", expectedOutput: false },
  { description: "ln with multiple options", input: "ln -sf source destination", expectedOutput: true },
  { description: "ln with backup option", input: "ln --backup=numbered source destination", expectedOutput: true },
  { description: "ln with target-directory option", input: "ln --target-directory=dest file1 file2", expectedOutput: true },
  { description: "ln with no-dereference option", input: "ln -n source destination", expectedOutput: true },
  { description: "ln with relative option", input: "ln --relative source destination", expectedOutput: true },
];