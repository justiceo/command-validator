import { BaseFSM } from "../base-fsm.js";

export class ChmodFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.modeSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      chmod: this.handleChmod.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      mode: this.handleMode.bind(this),
      file: this.handleFile.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'c' ? "chmod" : "invalid";
  }

  handleChmod(char) {
    if ("hmod".indexOf(char) !== -1) return "chmod";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return this.fileSeen ? "valid" : "invalid";
    if (!this.modeSeen) {
      this.modeSeen = true;
      return "mode";
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

  handleMode(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    return "mode";
  }

  handleFile(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "file";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.modeSeen = false;
    this.fileSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const chmodTestCases = [
  { description: "Basic chmod", input: "chmod 644 file", expectedOutput: true },
  { description: "chmod with option", input: "chmod -R 755 directory", expectedOutput: true },
  { description: "chmod with symbolic mode", input: "chmod u+x file", expectedOutput: true },
  { description: "chmod with multiple files", input: "chmod 644 file1 file2 file3", expectedOutput: true },
  { description: "chmod with path", input: "chmod 755 /path/to/file", expectedOutput: true },
  { description: "chmod with long option", input: "chmod --recursive 644 directory", expectedOutput: true },
  { description: "chmod with quoted file name", input: "chmod 644 'file with spaces.txt'", expectedOutput: true },
  { description: "chmod with escaped space", input: "chmod 644 file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "Invalid: chmod without mode and file", input: "chmod", expectedOutput: false },
  { description: "Invalid: chmod without file", input: "chmod 644", expectedOutput: false },
  { description: "chmod with reference option", input: "chmod --reference=ref_file target_file", expectedOutput: true },
  { description: "chmod with verbose option", input: "chmod -v 644 file", expectedOutput: true },
  { description: "chmod with complex symbolic mode", input: "chmod u=rwx,g=rx,o=r file", expectedOutput: true },
  { description: "chmod with multiple options", input: "chmod -Rv 755 directory", expectedOutput: true },
];