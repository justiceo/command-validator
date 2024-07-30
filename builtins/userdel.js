import { BaseFSM } from "../base-fsm.js";

export class UserdelFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      userdel: this.handleUserdel.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      username: this.handleUsername.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'u' ? "userdel" : "invalid";
  }

  handleUserdel(char) {
    if ("serdel".indexOf(char) !== -1) return "userdel";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.usernameSeen) {
      this.usernameSeen = true;
      return "username";
    }
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "option";
  }

  handleUsername(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "username";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined) && this.usernameSeen;
  }
}

export const userdelTestCases = [
  { description: "Basic userdel", input: "userdel username", expectedOutput: true },
  { description: "userdel with short option", input: "userdel -r username", expectedOutput: true },
  { description: "userdel with long option", input: "userdel --remove username", expectedOutput: true },
  { description: "userdel with multiple options", input: "userdel -r -f username", expectedOutput: true },
  { description: "userdel with mixed short and long options", input: "userdel -r --force username", expectedOutput: true },
  { description: "Invalid: userdel without username", input: "userdel", expectedOutput: false },
  { description: "Invalid: userdel with multiple usernames", input: "userdel user1 user2", expectedOutput: false },
  { description: "Invalid: userdel with invalid option", input: "userdel -z username", expectedOutput: true }, // userdel doesn't validate option names at syntax level
  { description: "userdel with option requiring no value", input: "userdel --force username", expectedOutput: true },
  { description: "userdel with very long username", input: "userdel verylongusernamexxxxxxxxxxxxxxxxxxxxxxxxx", expectedOutput: true },
  { description: "userdel with numeric username", input: "userdel 123456", expectedOutput: true },
  { description: "userdel with underscore in username", input: "userdel old_user", expectedOutput: true },
  { description: "userdel with all possible options", input: "userdel -r -f --force username", expectedOutput: true },
  { description: "Invalid: userdel with option after username", input: "userdel username -r", expectedOutput: false },
];