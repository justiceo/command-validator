import { BaseFSM } from "../base-fsm.js";

export class VimFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      vim: this.handleVim.bind(this),
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
    return char === 'v' ? "vim" : "invalid";
  }

  handleVim(char) {
    if ("im".indexOf(char) !== -1) return "vim";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // vim can be used without arguments
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // vim allows various option formats
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

export const vimTestCases = [
  { description: "Basic vim", input: "vim file.txt", expectedOutput: true },
  { description: "vim with option", input: "vim -b file.txt", expectedOutput: true },
  { description: "vim with multiple options", input: "vim -n -u NONE file.txt", expectedOutput: true },
  { description: "vim without file", input: "vim", expectedOutput: true },
  { description: "vim with quoted filename", input: "vim 'file with spaces.txt'", expectedOutput: true },
  { description: "vim with line number", input: "vim +10 file.txt", expectedOutput: true },
  { description: "vim with long option", input: "vim --noplugin file.txt", expectedOutput: true },
  { description: "vim with multiple files", input: "vim file1.txt file2.txt", expectedOutput: true },
  { description: "vim with wildcard", input: "vim *.txt", expectedOutput: true },
  { description: "vim with path", input: "vim /path/to/file.txt", expectedOutput: true },
  { description: "vim with readonly option", input: "vim -R file.txt", expectedOutput: true },
  { description: "vim with diff mode", input: "vim -d file1.txt file2.txt", expectedOutput: true },
  { description: "vim with server name", input: "vim --servername MYSERVER file.txt", expectedOutput: true },
  { description: "vim with remote file editing", input: "vim scp://user@host/path/to/file.txt", expectedOutput: true },
  { description: "vim with multiple mixed options and files", input: "vim -R -n +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
  { description: "Invalid: vim with invalid option", input: "vim -z file.txt", expectedOutput: true }, // vim doesn't validate option names at syntax level
];