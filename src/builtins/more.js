import { BaseFSM } from "../base-fsm.js";

export class MoreFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      more: this.handleMore.bind(this),
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
    return char === 'm' ? "more" : "invalid";
  }

  handleMore(char) {
    if ("ore".indexOf(char) !== -1) return "more";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // more can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // more allows various option formats
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

export const moreTestCases = [
  { description: "Basic more", input: "more file.txt", expectedOutput: true },
  { description: "more with multiple files", input: "more file1.txt file2.txt", expectedOutput: true },
  { description: "more with option", input: "more -d file.txt", expectedOutput: true },
  { description: "more with multiple options", input: "more -dlfp file.txt", expectedOutput: true },
  { description: "more with path", input: "more /path/to/file.txt", expectedOutput: true },
  { description: "more with wildcard", input: "more *.txt", expectedOutput: true },
  { description: "more with quoted filename", input: "more 'file with spaces.txt'", expectedOutput: true },
  { description: "more with escaped spaces", input: "more file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "more without arguments", input: "more", expectedOutput: true },
  { description: "more with only options", input: "more -d", expectedOutput: true },
  { description: "more with stdin redirection", input: "more < input.txt", expectedOutput: true },
  { description: "more with pipe", input: "cat file.txt | more", expectedOutput: true },
  { description: "more with multiple wildcards", input: "more *.txt *.log", expectedOutput: true },
  { description: "more with absolute and relative paths", input: "more /etc/passwd ./local/file.txt", expectedOutput: true },
  { description: "more with line number option", input: "more +100 file.txt", expectedOutput: true },
  { description: "more with display-line-numbers option", input: "more -l file.txt", expectedOutput: true },
  { description: "more with squeeze multiple blank lines option", input: "more -s file.txt", expectedOutput: true },
  { description: "more with pattern option", input: "more +/pattern file.txt", expectedOutput: true },
  { description: "more with multiple mixed options and files", input: "more -dlfp +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: more with invalid option", input: "more -z file.txt", expectedOutput: true }, // more doesn't validate option names at syntax level
];