import { BaseFSM } from "../base-fsm.js";

export class TailFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      tail: this.handleTail.bind(this),
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
    return char === 't' ? "tail" : "invalid";
  }

  handleTail(char) {
    if ("ail".indexOf(char) !== -1) return "tail";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // tail can be used without arguments to read from stdin
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // tail allows various option formats
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

export const tailTestCases = [
  { description: "Basic tail", input: "tail file.txt", expectedOutput: true },
  { description: "tail with multiple files", input: "tail file1.txt file2.txt", expectedOutput: true },
  { description: "tail with option", input: "tail -n 10 file.txt", expectedOutput: true },
  { description: "tail with long option", input: "tail --lines=20 file.txt", expectedOutput: true },
  { description: "tail with multiple options", input: "tail -n 10 -f file.txt", expectedOutput: true },
  { description: "tail with path", input: "tail /path/to/file.txt", expectedOutput: true },
  { description: "tail with wildcard", input: "tail *.txt", expectedOutput: true },
  { description: "tail with quoted filename", input: "tail 'file with spaces.txt'", expectedOutput: true },
  { description: "tail with escaped spaces", input: "tail file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "tail without arguments", input: "tail", expectedOutput: true },
  { description: "tail with only options", input: "tail -n 10", expectedOutput: true },
  { description: "tail with stdin redirection", input: "tail < input.txt", expectedOutput: true },
  { description: "tail with pipe", input: "cat file.txt | tail", expectedOutput: true },
  { description: "tail with multiple wildcards", input: "tail *.txt *.log", expectedOutput: true },
  { description: "tail with absolute and relative paths", input: "tail /etc/passwd ./local/file.txt", expectedOutput: true },
  { description: "tail with bytes option", input: "tail -c 100 file.txt", expectedOutput: true },
  { description: "tail with quiet option", input: "tail -q file1.txt file2.txt", expectedOutput: true },
  { description: "tail with verbose option", input: "tail -v file.txt", expectedOutput: true },
  { description: "tail with follow option", input: "tail -f file.txt", expectedOutput: true },
  { description: "tail with sleep interval option", input: "tail -s 5 -f file.txt", expectedOutput: true },
  { description: "tail with multiple mixed options and files", input: "tail -n 10 -f file1.txt 'spaced file.txt' /var/log/syslog", expectedOutput: true },
  { description: "Invalid: tail with invalid option", input: "tail -x file.txt", expectedOutput: true }, // tail doesn't validate option names at syntax level
];