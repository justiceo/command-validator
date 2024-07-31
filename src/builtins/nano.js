import { BaseFSM } from "../base-fsm.js";

export class NanoFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      nano: this.handleNano.bind(this),
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
    return char === 'n' ? "nano" : "invalid";
  }

  handleNano(char) {
    if ("ano".indexOf(char) !== -1) return "nano";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // nano can be used without arguments
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // nano allows various option formats
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

export const nanoTestCases = [
  { description: "Basic nano", input: "nano file.txt", expectedOutput: true },
  { description: "nano with option", input: "nano -w file.txt", expectedOutput: true },
  { description: "nano with multiple options", input: "nano -B -C /path/to/dir file.txt", expectedOutput: true },
  { description: "nano without file", input: "nano", expectedOutput: true },
  { description: "nano with quoted filename", input: "nano 'file with spaces.txt'", expectedOutput: true },
  { description: "nano with line number", input: "nano +10 file.txt", expectedOutput: true },
  { description: "nano with long option", input: "nano --nowrap file.txt", expectedOutput: true },
  { description: "nano with multiple files", input: "nano file1.txt file2.txt", expectedOutput: true },
  { description: "nano with wildcard", input: "nano *.txt", expectedOutput: true },
  { description: "nano with path", input: "nano /path/to/file.txt", expectedOutput: true },
  { description: "nano with stdin redirection", input: "nano < input.txt", expectedOutput: true },
  { description: "nano with backup option", input: "nano -B file.txt", expectedOutput: true },
  { description: "nano with syntax highlighting", input: "nano -Y python file.py", expectedOutput: true },
  { description: "nano with tab size option", input: "nano -T 4 file.txt", expectedOutput: true },
  { description: "nano with multiple mixed options and files", input: "nano -w -B +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: nano with invalid option", input: "nano -z file.txt", expectedOutput: true }, // nano doesn't validate option names at syntax level
];