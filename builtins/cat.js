import { BaseFSM } from "../base-fsm.js";

export class CatFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      cat: this.handleCat.bind(this),
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
    return char === 'c' ? "cat" : "invalid";
  }

  handleCat(char) {
    if ("at".indexOf(char) !== -1) return "cat";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return "valid"; // cat can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    if (/[a-zA-Z]/.test(char)) return "option";
    return "invalid";
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

export const catTestCases = [
  { description: "Basic cat", input: "cat file.txt", expectedOutput: true },
  { description: "cat with multiple files", input: "cat file1.txt file2.txt file3.txt", expectedOutput: true },
  { description: "cat with option", input: "cat -n file.txt", expectedOutput: true },
  { description: "cat with long option", input: "cat --number file.txt", expectedOutput: true },
  { description: "cat with multiple options", input: "cat -bn file.txt", expectedOutput: true },
  { description: "cat with path", input: "cat /path/to/file.txt", expectedOutput: true },
  { description: "cat with wildcard", input: "cat *.txt", expectedOutput: true },
  { description: "cat with quoted filename", input: "cat 'file with spaces.txt'", expectedOutput: true },
  { description: "cat with escaped spaces", input: "cat file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "cat without arguments", input: "cat", expectedOutput: true },
  { description: "cat with only options", input: "cat -n", expectedOutput: true },
  { description: "cat with stdin redirection", input: "cat < input.txt", expectedOutput: true },
  { description: "cat with stdout redirection", input: "cat file.txt > output.txt", expectedOutput: true },
  { description: "cat with pipe", input: "cat file.txt | grep pattern", expectedOutput: true },
  { description: "cat with multiple wildcards", input: "cat *.txt *.log", expectedOutput: true },
  { description: "cat with absolute and relative paths", input: "cat /etc/passwd ./local/file.txt", expectedOutput: true },
  { description: "cat with show-ends option", input: "cat -E file.txt", expectedOutput: true },
  { description: "cat with show-tabs option", input: "cat -T file.txt", expectedOutput: true },
  { description: "cat with squeeze-blank option", input: "cat -s file.txt", expectedOutput: true },
  { description: "cat with multiple mixed options and files", input: "cat -bns file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: cat with invalid option", input: "cat -z file.txt", expectedOutput: true }, // cat doesn't validate option names at syntax level
];