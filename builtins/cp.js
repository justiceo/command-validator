import { BaseFSM } from "../base-fsm.js";

export class CpFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.sourcesSeen = 0;
    this.states = {
      start: this.handleStart.bind(this),
      cp: this.handleCp.bind(this),
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
    return char === 'c' ? "cp" : "invalid";
  }

  handleCp(char) {
    if (char === 'p') return "space";
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

export const cpTestCases = [
  { description: "Basic cp", input: "cp source destination", expectedOutput: true },
  { description: "cp with option", input: "cp -r source destination", expectedOutput: true },
  { description: "cp with multiple sources", input: "cp file1 file2 file3 destination", expectedOutput: true },
  { description: "cp with path", input: "cp /path/to/source /path/to/destination", expectedOutput: true },
  { description: "cp with option and path", input: "cp -a /path/to/source /path/to/destination", expectedOutput: true },
  { description: "cp with long option", input: "cp --recursive source destination", expectedOutput: true },
  { description: "cp with quoted file names", input: "cp 'source file.txt' 'destination file.txt'", expectedOutput: true },
  { description: "cp with escaped space", input: "cp source\\ file.txt destination\\ file.txt", expectedOutput: true },
  { description: "Invalid: cp without destination", input: "cp source", expectedOutput: false },
  { description: "Invalid: cp without source and destination", input: "cp", expectedOutput: false },
  { description: "cp with multiple options", input: "cp -r -v source destination", expectedOutput: true },
  { description: "cp with preserve option", input: "cp --preserve=all source destination", expectedOutput: true },
  { description: "cp with update option", input: "cp -u source destination", expectedOutput: true },
  { description: "cp with backup option", input: "cp --backup=numbered source destination", expectedOutput: true },
  { description: "cp with target-directory option", input: "cp --target-directory=dest file1 file2", expectedOutput: true },
];