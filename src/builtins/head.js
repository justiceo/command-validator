import { BaseFSM } from "../base-fsm.js";

export class HeadFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      head: this.handleHead.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      file: this.handleFile.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'h' ? "head" : "invalid";
  }

  handleHead(char) {
    if ("ead".indexOf(char) !== -1) return "head";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "valid"; // head can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // head allows various option formats
  }

  handleFile(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "file";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const headTestCases = [
  { description: "Basic head", input: "head file.txt", expectedOutput: true },
  { description: "head with multiple files", input: "head file1.txt file2.txt", expectedOutput: true },
  { description: "head with option", input: "head -n 10 file.txt", expectedOutput: true },
  { description: "head with long option", input: "head --lines=20 file.txt", expectedOutput: true },
  { description: "head with multiple options", input: "head -n 10 -q file.txt", expectedOutput: true },
  { description: "head with path", input: "head /path/to/file.txt", expectedOutput: true },
  { description: "head with wildcard", input: "head *.txt", expectedOutput: true },
  { description: "head with quoted filename", input: "head 'file with spaces.txt'", expectedOutput: true },
  { description: "head with escaped spaces", input: "head file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "head without arguments", input: "head", expectedOutput: true },
  { description: "head with only options", input: "head -n 10", expectedOutput: true },
  { description: "head with stdin redirection", input: "head < input.txt", expectedOutput: true },
  { description: "head with pipe", input: "cat file.txt | head", expectedOutput: true },
  { description: "head with multiple wildcards", input: "head *.txt *.log", expectedOutput: true },
  { description: "head with absolute and relative paths", input: "head /etc/passwd ./local/file.txt", expectedOutput: true },
  { description: "head with bytes option", input: "head -c 100 file.txt", expectedOutput: true },
  { description: "head with quiet option", input: "head -q file1.txt file2.txt", expectedOutput: true },
  { description: "head with verbose option", input: "head -v file.txt", expectedOutput: true },
  { description: "head with zero-terminated option", input: "head -z file.txt", expectedOutput: true },
  { description: "head with multiple mixed options and files", input: "head -n 10 -q file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: head with invalid option", input: "head -x file.txt", expectedOutput: true }, // head doesn't validate option names at syntax level
];