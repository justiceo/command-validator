import { BaseFSM } from "../base-fsm.js";

export class ChgrpFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupSeen = false;
    this.fileSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      chgrp: this.handleChgrp.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      group: this.handleGroup.bind(this),
      file: this.handleFile.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'c' ? "chgrp" : "invalid";
  }

  handleChgrp(char) {
    if ("hgrp".indexOf(char) !== -1) return "chgrp";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (char === undefined) return this.fileSeen ? "valid" : "invalid";
    if (!this.groupSeen) {
      this.groupSeen = true;
      return "group";
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

  handleGroup(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "invalid";
    return "group";
  }

  handleFile(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "file";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.groupSeen = false;
    this.fileSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const chgrpTestCases = [
  { description: "Basic chgrp", input: "chgrp group file", expectedOutput: true },
  { description: "chgrp with option", input: "chgrp -R group directory", expectedOutput: true },
  { description: "chgrp with multiple files", input: "chgrp group file1 file2 file3", expectedOutput: true },
  { description: "chgrp with path", input: "chgrp group /path/to/file", expectedOutput: true },
  { description: "chgrp with long option", input: "chgrp --recursive group directory", expectedOutput: true },
  { description: "chgrp with quoted file name", input: "chgrp group 'file with spaces.txt'", expectedOutput: true },
  { description: "chgrp with escaped space", input: "chgrp group file\\ with\\ spaces.txt", expectedOutput: true },
  { description: "Invalid: chgrp without group and file", input: "chgrp", expectedOutput: false },
  { description: "Invalid: chgrp without file", input: "chgrp group", expectedOutput: false },
  { description: "chgrp with reference option", input: "chgrp --reference=ref_file target_file", expectedOutput: true },
  { description: "chgrp with verbose option", input: "chgrp -v group file", expectedOutput: true },
  { description: "chgrp with preserve-root option", input: "chgrp --preserve-root group /", expectedOutput: true },
  { description: "chgrp with from option", input: "chgrp --from=oldgroup newgroup file", expectedOutput: true },
  { description: "chgrp with multiple options", input: "chgrp -Rv group directory", expectedOutput: true },
];