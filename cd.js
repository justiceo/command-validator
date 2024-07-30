import { BaseFSM } from "./base-fsm.js";

/**
 * Finite State Machine to validate the syntax of a cd command
 */
export class CdFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.hasSeenArgument = false;
    this.parenthesisDepth = 0;
    this.states = {
      start: this.handleStart.bind(this),
      cd: this.handleCd.bind(this),
      space: this.handleSpace.bind(this),
      dash: this.handleDash.bind(this),
      tilde: this.handleTilde.bind(this),
      dollar: this.handleDollar.bind(this),
      quoted: this.handleQuoted.bind(this),
      unquoted: this.handleUnquoted.bind(this),
      parenthesis: this.handleParenthesis.bind(this),
      escaped: this.handleEscaped.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    if (char === "c") return "cd";
    return "invalid";
  }

  handleCd(char) {
    if (char === "d") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (this.hasSeenArgument && this.parenthesisDepth === 0) return "invalid";
    if (char === "-") return "dash";
    if (char === "~") return "tilde";
    if (char === "$") return "dollar";
    if (char === '"') return "quoted";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    if (char === "\\") return "escaped";
    if (char === undefined) return "valid";
    this.hasSeenArgument = true;
    return "unquoted";
  }

  handleDash(char) {
    if (/[a-zA-Z]/.test(char)) return "unquoted";
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleTilde(char) {
    this.hasSeenArgument = true;
    if (/[a-zA-Z0-9*-]/.test(char) || char === "/") return "unquoted";
    if (char === " " || char === "\t") return "space";
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleDollar(char) {
    this.hasSeenArgument = true;
    if (char === "{") return "unquoted";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    return "unquoted";
  }

  handleQuoted(char) {
    this.hasSeenArgument = true;
    if (char === '"') return "unquoted";
    if (char === undefined) return "invalid";
    return "quoted";
  }

  handleUnquoted(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "\\") return "escaped";
    if (char === "(") {
      this.parenthesisDepth++;
      return "parenthesis";
    }
    if (char === ")" && this.parenthesisDepth > 0) {
      this.parenthesisDepth--;
      return this.parenthesisDepth === 0 ? "unquoted" : "parenthesis";
    }
    if (char === undefined) return "valid";
    return "unquoted";
  }

  handleParenthesis(char) {
    if (char === "(") {
      this.parenthesisDepth++;
    } else if (char === ")") {
      this.parenthesisDepth--;
      if (this.parenthesisDepth === 0) return "unquoted";
    }
    if (char === undefined) return "invalid";
    return "parenthesis";
  }

  handleEscaped(char) {
    if (char === undefined) return "invalid";
    return "unquoted";
  }

  isValid(command) {
    this.state = "start";
    this.hasSeenArgument = false;
    this.parenthesisDepth = 0;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

function isValidCommand(command) {
  const fsm = new CdFSM();
  return fsm.isValid(command.trim()); // Trim trailing spaces
}

// Test cases
export const cdTestCases = [
  { description: "Basic cd", input: "cd", expectedOutput: true },
  {
    description: "Absolute path",
    input: "cd /home/user",
    expectedOutput: true,
  },
  { description: "Parent directory", input: "cd ..", expectedOutput: true },
  {
    description: "Home directory with subfolder",
    input: "cd ~/Documents",
    expectedOutput: true,
  },
  {
    description: "Directory with spaces (quoted)",
    input: 'cd "My Documents"',
    expectedOutput: true,
  },
  {
    description: "Option with path",
    input: "cd -P /actual/path",
    expectedOutput: true,
  },
  {
    description: "Option with symbolic link (quoted)",
    input: 'cd -L "Symbolic Link"',
    expectedOutput: true,
  },
  { description: "Previous directory", input: "cd -", expectedOutput: true },
  {
    description: "Another user's home directory",
    input: "cd ~username",
    expectedOutput: true,
  },
  {
    description: "Environment variable",
    input: "cd $HOME",
    expectedOutput: true,
  },
  {
    description: "Environment variable with path",
    input: "cd ${HOME}/Documents",
    expectedOutput: true,
  },
  { description: "Subshell command", input: "cd $(pwd)", expectedOutput: true },
  {
    description: "Path with escaped spaces",
    input: "cd /path/with\\ spaces",
    expectedOutput: true,
  },
  {
    description: "Path with multiple escaped spaces",
    input: "cd /multiple\\ spaces",
    expectedOutput: true,
  },
  {
    description: "Tab-separated path",
    input: "cd \t/tab\tseparated",
    expectedOutput: true,
  },
  {
    description: "Trailing space in path",
    input: "cd /trailing/spaces ",
    expectedOutput: true,
  },
  {
    description: "Invalid: extra word",
    input: "cd to /home/user",
    expectedOutput: false,
  },
  {
    description: "Invalid: multiple paths",
    input: "cd /home /user",
    expectedOutput: false,
  },
  {
    description: "Invalid: multiple relative paths",
    input: "cd a b",
    expectedOutput: false,
  },
  {
    description: "Invalid: unclosed quote",
    input: 'cd "Unclosed Quote',
    expectedOutput: false,
  },
  {
    description: "Tab and space-separated",
    input: "cd \t/tab\tseparated",
    expectedOutput: true,
  },
  { description: "Empty path", input: 'cd ""', expectedOutput: true },
  {
    description: "Environment variable with curly braces",
    input: "cd ${HOME}",
    expectedOutput: true,
  },
  {
    description: "Path with special characters",
    input: "cd /path/with!@#$%^&*()_+",
    expectedOutput: true,
  },
  {
    description: "Path with unicode characters",
    input: "cd /path/with/üñîçødë",
    expectedOutput: true,
  },
  {
    description: "Invalid: unescaped space in path",
    input: "cd /path with/unescaped space",
    expectedOutput: false,
  },
  {
    description: "Invalid: invalid option",
    input: "cd -invalidOption",
    expectedOutput: false,
  },
  {
    description: "Escaped quotes in path",
    input: 'cd /path/with/\\"escaped\\"/quotes',
    expectedOutput: true,
  },
  {
    description: "Invalid: unmatched parentheses in subshell",
    input: "cd $(pwd",
    expectedOutput: false,
  },
  {
    description: "Complex path with multiple elements",
    input: "cd -P $(pwd)/~username/${HOME}/Documents",
    expectedOutput: true,
  },
  {
    description: "Path with only spaces (quoted)",
    input: 'cd "   "',
    expectedOutput: true,
  },
  {
    description: "Path with only spaces (unquoted)",
    input: "cd    ",
    expectedOutput: true,
  },
  {
    description: "Path with special characters in quotes",
    input: 'cd "/path/with/special/!$%^&*()"',
    expectedOutput: true,
  },
];
