import { BaseFSM } from "./base-fsm.js";

export class LsFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.states = {
      start: this.handleStart.bind(this),
      ls: this.handleLs.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
      quoted: this.handleQuoted.bind(this),
    };
  }

  transition(char) {
    if (this.escapeNext) {
      this.escapeNext = false;
      return this.handleEscaped(char);
    }
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    if (char === "l") return "ls";
    return "invalid";
  }

  handleLs(char) {
    if (char === "s") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (char === undefined) return "valid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    if (/[a-zA-Z1]/.test(char)) return "option";
    return "invalid";
  }

  handleArgument(char) {
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    return "argument";
  }

  handleQuoted(char) {
    if (char === undefined) return "invalid";
    if (char === this.quotedState) {
      this.quotedState = null;
      return "argument";
    }
    if (char === "\\") {
      this.escapeNext = true;
    }
    return "quoted";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return this.state;
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

function isValidLsCommand(command) {
  const fsm = new LsFSM();
  return fsm.isValid(command.trim());
}

// Test cases
export const lsTestCases = [
  { description: "Basic ls", input: "ls", expectedOutput: true },
  { description: "ls with option", input: "ls -l", expectedOutput: true },
  {
    description: "ls with multiple options",
    input: "ls -la",
    expectedOutput: true,
  },
  { description: "ls with path", input: "ls /home/user", expectedOutput: true },
  {
    description: "ls with option and path",
    input: "ls -l /home/user",
    expectedOutput: true,
  },
  {
    description: "ls with multiple paths",
    input: "ls /home /usr",
    expectedOutput: true,
  },
  { description: "ls with wildcard", input: "ls *.txt", expectedOutput: true },
  {
    description: "ls with quoted path",
    input: "ls 'My Documents'",
    expectedOutput: true,
  },
  {
    description: "ls with double quoted path",
    input: 'ls "Program Files"',
    expectedOutput: true,
  },
  {
    description: "ls with escaped space",
    input: "ls My\\ Documents",
    expectedOutput: true,
  },
  {
    description: "ls with multiple options and path",
    input: "ls -lah /home/user",
    expectedOutput: true,
  },
  {
    description: "Invalid: ls with invalid long option",
    input: "ls --all",
    expectedOutput: false,
  },
  {
    description: "ls with numeric option",
    input: "ls -1",
    expectedOutput: true,
  },
  {
    description: "ls with multiple quoted paths",
    input: "ls 'path with spaces' \"another path\"",
    expectedOutput: true,
  },
  {
    description: "ls with option and wildcard",
    input: "ls -l *.jpg",
    expectedOutput: true,
  },
  {
    description: "ls with complex path",
    input: "ls /home/user/Documents/*.txt",
    expectedOutput: true,
  },
  {
    description: "ls with environment variable",
    input: "ls $HOME",
    expectedOutput: true,
  },
  {
    description: "ls with tilde expansion",
    input: "ls ~/Documents",
    expectedOutput: true,
  },
  {
    description: "Invalid: ls with unmatched quote",
    input: "ls 'unmatched",
    expectedOutput: false,
  },
  {
    description: "ls with space before option",
    input: "ls -l",
    expectedOutput: true,
  },
  {
    description: "Invalid: ls with option after path",
    input: "ls /home -l",
    expectedOutput: true,
  },
  {
    description: "Invalid: ls with invalid option",
    input: "ls --invalid-option",
    expectedOutput: true,
  },
  {
    description: "ls with multiple escaped spaces",
    input: "ls path\\ with\\ many\\ spaces",
    expectedOutput: true,
  },
  {
    description: "ls with combination of quoted and escaped paths",
    input: "ls 'quoted path' unquoted\\ path",
    expectedOutput: true,
  },
  {
    description: "ls with option and multiple wildcards",
    input: "ls -l *.jpg *.png",
    expectedOutput: true,
  },
  {
    description: "ls with option and complex wildcard",
    input: "ls -l [a-z]*.txt",
    expectedOutput: true,
  },
  {
    description: "ls with multiple long options",
    input: "ls --all --human-readable",
    expectedOutput: true,
  },
  {
    description: "ls with option and hidden files",
    input: "ls -a .hidden_file",
    expectedOutput: true,
  },
  {
    description: "ls with complex combination",
    input: "ls -lR ~/Documents/*.pdf '/path with spaces'",
    expectedOutput: true,
  },
  {
    description: "ls with unescaped special character",
    input: "ls file|name",
    expectedOutput: true,
  },
];
