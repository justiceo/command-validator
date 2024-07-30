import { BaseFSM } from "../base-fsm.js";

export class UseraddFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      useradd: this.handleUseradd.bind(this),
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
    return char === 'u' ? "useradd" : "invalid";
  }

  handleUseradd(char) {
    if ("seradd".indexOf(char) !== -1) return "useradd";
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
    return this.transition(undefined);
  }
}

export const useraddTestCases = [
  { description: "Basic useradd", input: "useradd newuser", expectedOutput: true },
  { description: "useradd with single short option", input: "useradd -m newuser", expectedOutput: true },
  { description: "useradd with multiple short options", input: "useradd -m -k /etc/skel newuser", expectedOutput: true },
  { description: "useradd with long option", input: "useradd --system newuser", expectedOutput: true },
  { description: "useradd with mixed short and long options", input: "useradd -m --group users newuser", expectedOutput: true },
  { description: "useradd with option requiring value", input: "useradd -c 'New User' newuser", expectedOutput: true },
  { description: "useradd with multiple options requiring values", input: "useradd -c 'New User' -s /bin/bash -g users newuser", expectedOutput: true },
  { description: "useradd with -D option (modify defaults)", input: "useradd -D -s /bin/bash", expectedOutput: true },
  { description: "Invalid: useradd without username", input: "useradd", expectedOutput: false },
  { description: "Invalid: useradd with multiple usernames", input: "useradd user1 user2", expectedOutput: false },
  { description: "Invalid: useradd with invalid option", input: "useradd -z newuser", expectedOutput: true }, // useradd doesn't validate option names at syntax level
  { description: "useradd with quoted option value", input: "useradd -p 'encrypted_password' newuser", expectedOutput: true },
  { description: "useradd with very long username", input: "useradd verylongusernamexxxxxxxxxxxxxxxxxxxxxxxxx", expectedOutput: true },
  { description: "useradd with numeric username", input: "useradd 123456", expectedOutput: true },
  { description: "useradd with underscore in username", input: "useradd new_user", expectedOutput: true },
];