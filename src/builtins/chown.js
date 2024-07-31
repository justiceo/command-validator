import { BaseFSM } from "../base-fsm.js";

export class ChownFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.ownerSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      chown: this.handleChown.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      owner: this.handleOwner.bind(this),
      file: this.handleFile.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'c' ? "chown" : "invalid";
  }

  handleChown(char) {
    if ("hown".indexOf(char) !== -1) return "chown";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return this.fileSeen ? "valid" : "invalid";
    if (!this.ownerSeen) {
      this.ownerSeen = true;
      return "owner";
    }
    this.fileSeen = true;
    return "file";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    if (/[a-zA-Z]/.test(char)) return "option";
    return "invalid";
  }

  handleOwner(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    return "owner";
  }

  handleFile(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "file";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.ownerSeen = false;
    this.fileSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const chownTestCases = [
  { description: "Basic chown", input: "chown user file", expectedOutput: true },
  { description: "chown with option", input: "chown -R user:group directory", expectedOutput: true },
  { description: "chown with multiple files", input: "chown user file1 file2 file3", expectedOutput: true },
  { description: "chown with path", input: "chown user:group /path/to/file", expectedOutput: true },
  { description: "chown with long option", input: "chown --recursive user directory", expectedOutput: true },
  { description: "chown with quoted file name", input: "chown user 'file with spaces.txt'", expectedOutput: true },
  { description: "chown with escaped space", input: "chown user file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "Invalid: chown without owner and file", input: "chown", expectedOutput: false },
  { description: "Invalid: chown without file", input: "chown user", expectedOutput: false },
  { description: "chown with reference option", input: "chown --reference=ref_file target_file", expectedOutput: true },
  { description: "chown with verbose option", input: "chown -v user:group file", expectedOutput: true },
  { description: "chown with preserve-root option", input: "chown --preserve-root user /", expectedOutput: true },
  { description: "chown with from option", input: "chown --from=olduser:oldgroup newuser:newgroup file", expectedOutput: true },
  { description: "chown with multiple options", input: "chown -Rv user:group directory", expectedOutput: true },
];