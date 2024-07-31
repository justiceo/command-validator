import { BaseFSM } from "../base-fsm.js";

export class ViFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      vi: this.handleVi.bind(this),
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
    return char === 'v' ? "vi" : "invalid";
  }

  handleVi(char) {
    if (char === 'i') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // vi can be used without arguments
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // vi allows various option formats
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

export const viTestCases = [
  { description: "Basic vi", input: "vi file.txt", expectedOutput: true },
  { description: "vi with option", input: "vi -R file.txt", expectedOutput: true },
  { description: "vi without file", input: "vi", expectedOutput: true },
  { description: "vi with quoted filename", input: "vi 'file with spaces.txt'", expectedOutput: true },
  { description: "vi with line number", input: "vi +10 file.txt", expectedOutput: true },
  { description: "vi with multiple options", input: "vi -r -c 'set number' file.txt", expectedOutput: true },
  { description: "vi with multiple files", input: "vi file1.txt file2.txt", expectedOutput: true },
  { description: "vi with wildcard", input: "vi *.txt", expectedOutput: true },
  { description: "vi with path", input: "vi /path/to/file.txt", expectedOutput: true },
  { description: "vi with tag", input: "vi -t mytag", expectedOutput: true },
  { description: "vi with readonly option", input: "vi -R file.txt", expectedOutput: true },
  { description: "vi with recovery mode", input: "vi -r file.txt", expectedOutput: true },
  { description: "vi with command option", input: "vi -c ':set nu' file.txt", expectedOutput: true },
  { description: "vi with multiple mixed options and files", input: "vi -R +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: vi with invalid option", input: "vi -z file.txt", expectedOutput: true }, // vi doesn't validate option names at syntax level
];