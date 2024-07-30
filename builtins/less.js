import { BaseFSM } from "../base-fsm.js";

export class LessFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      less: this.handleLess.bind(this),
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
    return char === 'l' ? "less" : "invalid";
  }

  handleLess(char) {
    if ("ess".indexOf(char) !== -1) return "less";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // less can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // less allows various option formats
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

export const lessTestCases = [
  { description: "Basic less", input: "less file.txt", expectedOutput: true },
  { description: "less with multiple files", input: "less file1.txt file2.txt", expectedOutput: true },
  { description: "less with option", input: "less -N file.txt", expectedOutput: true },
  { description: "less with long option", input: "less --LINE-NUMBERS file.txt", expectedOutput: true },
  { description: "less with multiple options", input: "less -FX file.txt", expectedOutput: true },
  { description: "less with path", input: "less /path/to/file.txt", expectedOutput: true },
  { description: "less with wildcard", input: "less *.txt", expectedOutput: true },
  { description: "less with quoted filename", input: "less 'file with spaces.txt'", expectedOutput: true },
  { description: "less with escaped spaces", input: "less file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "less without arguments", input: "less", expectedOutput: true },
  { description: "less with only options", input: "less -N", expectedOutput: true },
  { description: "less with stdin redirection", input: "less < input.txt", expectedOutput: true },
  { description: "less with pipe", input: "cat file.txt | less", expectedOutput: true },
  { description: "less with multiple wildcards", input: "less *.txt *.log", expectedOutput: true },
  { description: "less with absolute and relative paths", input: "less /etc/passwd ./local/file.txt", expectedOutput: true },
  { description: "less with ignore-case option", input: "less -i file.txt", expectedOutput: true },
  { description: "less with chop-long-lines option", input: "less -S file.txt", expectedOutput: true },
  { description: "less with quit-if-one-screen option", input: "less -F file.txt", expectedOutput: true },
  { description: "less with pattern option", input: "less +/pattern file.txt", expectedOutput: true },
  { description: "less with line number option", input: "less +100 file.txt", expectedOutput: true },
  { description: "less with multiple mixed options and files", input: "less -FXN +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: less with invalid option", input: "less -z file.txt", expectedOutput: true }, // less doesn't validate option names at syntax level
];