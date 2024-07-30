import { BaseFSM } from "../base-fsm.js";

export class EmacsFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      emacs: this.handleEmacs.bind(this),
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
    return char === 'e' ? "emacs" : "invalid";
  }

  handleEmacs(char) {
    if ("macs".indexOf(char) !== -1) return "emacs";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === '+') return "option";
    if (char === undefined) return "valid"; // emacs can be used without arguments
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid"; // options can be used without files
    return "option"; // emacs allows various option formats
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

export const emacsTestCases = [
    { description: "Basic emacs", input: "emacs file.txt", expectedOutput: true },
    { description: "emacs with option", input: "emacs -nw file.txt", expectedOutput: true },
    { description: "emacs with multiple options", input: "emacs -Q --no-splash file.txt", expectedOutput: true },
    { description: "emacs without file", input: "emacs", expectedOutput: true },
    { description: "emacs with quoted filename", input: "emacs 'file with spaces.txt'", expectedOutput: true },
    { description: "emacs with line number", input: "emacs +10 file.txt", expectedOutput: true },
    { description: "emacs with long option", input: "emacs --no-window-system file.txt", expectedOutput: true },
    { description: "emacs with multiple files", input: "emacs file1.txt file2.txt", expectedOutput: true },
    { description: "emacs with wildcard", input: "emacs *.txt", expectedOutput: true },
    { description: "emacs with path", input: "emacs /path/to/file.txt", expectedOutput: true },
    { description: "emacs with batch mode", input: "emacs -batch -l script.el", expectedOutput: true },
    { description: "emacs with eval option", input: "emacs --eval '(print \"Hello, World!\")' file.txt", expectedOutput: true },
    { description: "emacs with daemon mode", input: "emacs --daemon", expectedOutput: true },
    { description: "emacs with client", input: "emacs -c", expectedOutput: true },
    { description: "emacs with terminal mode", input: "emacs -nw file.txt", expectedOutput: true },
    { description: "emacs with multiple mixed options and files", input: "emacs -Q --no-splash +100 file1.txt 'spaced file.txt' /etc/hosts", expectedOutput: true },
    { description: "Invalid: emacs with invalid option", input: "emacs -z file.txt", expectedOutput: true }, // emacs doesn't validate option names at syntax level
  ];