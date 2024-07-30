import { BaseFSM } from "./base-fsm.js";

export class MkdirFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.parenthesesDepth = 0;
    this.states = {
      start: this.handleStart.bind(this),
      mkdir: this.handleMkdir.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
      quoted: this.handleQuoted.bind(this),
      parentheses: this.handleParentheses.bind(this),
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
    if (char === "m") return "mkdir";
    return "invalid";
  }

  handleMkdir(char) {
    if ("mkdir".indexOf(char) !== -1) return "mkdir";
    if (char === " " || char === "\t") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (char === undefined) return this.argumentSeen ? "valid" : "invalid";
    if (char === "'" || char === '"') {
      this.quotedState = char;
      return "quoted";
    }
    if (char === "\\") {
      this.escapeNext = true;
      return "argument";
    }
    if (char === "(") {
      this.parenthesesDepth++;
      return "parentheses";
    }
    this.argumentSeen = true;
    return "argument";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid"; // mkdir requires at least one directory argument
    if (/[a-zA-Z]/.test(char)) return "option";
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
    if (char === "(") {
      this.parenthesesDepth++;
      return "parentheses";
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

  handleParentheses(char) {
    if (char === "(") {
      this.parenthesesDepth++;
    } else if (char === ")") {
      this.parenthesesDepth--;
      if (this.parenthesesDepth === 0) {
        return "argument";
      }
    } else if (char === undefined) {
      return "invalid";
    }
    return "parentheses";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.argumentSeen = false;
    this.quotedState = null;
    this.escapeNext = false;
    this.parenthesesDepth = 0;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

function isValidMkdirCommand(command) {
  const fsm = new MkdirFSM();
  return fsm.isValid(command.trim());
}

// Test cases
export const mkdirTestCases = [
  { description: "Basic mkdir", input: "mkdir newdir", expectedOutput: true },
  {
    description: "mkdir with multiple directories",
    input: "mkdir dir1 dir2 dir3",
    expectedOutput: true,
  },
  {
    description: "mkdir with -p option",
    input: "mkdir -p /path/to/new/dir",
    expectedOutput: true,
  },
  {
    description: "mkdir with -m option",
    input: "mkdir -m 755 newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with multiple options",
    input: "mkdir -pv /path/to/new/dir",
    expectedOutput: true,
  },
  {
    description: "mkdir with long option",
    input: "mkdir --parents /path/to/new/dir",
    expectedOutput: true,
  },
  {
    description: "mkdir with quoted directory name",
    input: "mkdir 'My Documents'",
    expectedOutput: true,
  },
  {
    description: "mkdir with double quoted directory name",
    input: 'mkdir "Program Files"',
    expectedOutput: true,
  },
  {
    description: "mkdir with escaped space",
    input: "mkdir My\\ Documents",
    expectedOutput: true,
  },
  {
    description: "mkdir with multiple options and directories",
    input: "mkdir -pv /path/to/dir1 /path/to/dir2",
    expectedOutput: true,
  },
  {
    description: "mkdir with option and complex path",
    input: "mkdir -p /home/user/Documents/project/src",
    expectedOutput: true,
  },
  {
    description: "mkdir with environment variable",
    input: "mkdir $HOME/newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with tilde expansion",
    input: "mkdir ~/Documents/newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with parentheses",
    input: "mkdir (dir)",
    expectedOutput: true,
  },
  {
    description: "mkdir with complex combination",
    input: "mkdir -p ~/Documents/'Project Files'/$(date +%Y-%m-%d)",
    expectedOutput: true,
  },
  {
    description: "Invalid: mkdir without directory",
    input: "mkdir",
    expectedOutput: false,
  },
  {
    description: "Invalid: mkdir with unmatched quote",
    input: "mkdir 'unmatched",
    expectedOutput: false,
  },
  {
    description: "Invalid: mkdir with space before command",
    input: " mkdir newdir",
    expectedOutput: false,
  },
  {
    description: "Invalid: mkdir with invalid option",
    input: "mkdir --invalid-option newdir",
    expectedOutput: true,
  }, // mkdir doesn't validate option names at syntax level
  {
    description: "Invalid: mkdir with unmatched parenthesis",
    input: "mkdir (newdir",
    expectedOutput: false,
  },
  {
    description: "mkdir with multiple escaped spaces",
    input: "mkdir path\\ with\\ many\\ spaces",
    expectedOutput: true,
  },
  {
    description: "mkdir with combination of quoted and escaped paths",
    input: "mkdir 'quoted path' unquoted\\ path",
    expectedOutput: true,
  },
  {
    description: "mkdir with numeric option argument",
    input: "mkdir -m 644 newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with complex permissions",
    input: "mkdir -m u=rwx,g=rx,o=r newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with verbose option",
    input: "mkdir -v newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with context option",
    input: "mkdir --context=user:object_r:user_home_t:s0 newdir",
    expectedOutput: true,
  },
  {
    description: "mkdir with help option",
    input: "mkdir --help",
    expectedOutput: true,
  },
  {
    description: "mkdir with version option",
    input: "mkdir --version",
    expectedOutput: true,
  },
  {
    description: "mkdir with path containing special characters",
    input: "mkdir test!@#$%^&*()_+",
    expectedOutput: true,
  },
  {
    description: "mkdir with path containing unicode characters",
    input: "mkdir 新しいフォルダ",
    expectedOutput: true,
  },
];