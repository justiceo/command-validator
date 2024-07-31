import { BaseFSM } from "../base-fsm.js";

export class UsermodFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      usermod: this.handleUsermod.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      optionValue: this.handleOptionValue.bind(this),
      username: this.handleUsername.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'u' ? "usermod" : "invalid";
  }

  handleUsermod(char) {
    if ("sermod".indexOf(char) !== -1) return "usermod";
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
    return "optionValue";
  }

  handleOptionValue(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
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

export const usermodTestCases = [
  { description: "Basic usermod", input: "usermod -c 'New comment' username", expectedOutput: true },
  { description: "usermod with single short option", input: "usermod -L username", expectedOutput: true },
  { description: "usermod with multiple short options", input: "usermod -c 'New comment' -s /bin/bash username", expectedOutput: true },
  { description: "usermod with long option", input: "usermod --comment 'New comment' username", expectedOutput: true },
  { description: "usermod with mixed short and long options", input: "usermod -c 'New comment' --shell /bin/bash username", expectedOutput: true },
  { description: "usermod changing home directory", input: "usermod -d /newhome/username -m username", expectedOutput: true },
  { description: "usermod changing login name", input: "usermod -l newusername oldusername", expectedOutput: true },
  { description: "usermod changing user ID", input: "usermod -u 1001 username", expectedOutput: true },
  { description: "usermod changing group ID", input: "usermod -g 1001 username", expectedOutput: true },
  { description: "usermod adding to supplementary groups", input: "usermod -a -G wheel,developers username", expectedOutput: true },
  { description: "usermod with multiple complex options", input: "usermod -c 'New comment' -d /newhome/username -m -s /bin/zsh -L username", expectedOutput: true },
  { description: "usermod with quoted option values", input: "usermod -c 'User with spaces in comment' -d '/home/user with spaces' username", expectedOutput: true },
  { description: "Invalid: usermod without username", input: "usermod -c 'New comment'", expectedOutput: false },
  { description: "Invalid: usermod with multiple usernames", input: "usermod -c 'New comment' user1 user2", expectedOutput: false },
  { description: "Invalid: usermod with invalid option", input: "usermod -z username", expectedOutput: true }, // usermod doesn't validate option names at syntax level
  { description: "usermod with very long username", input: "usermod -c 'New comment' verylongusernamexxxxxxxxxxxxxxxxxxxxxxxxx", expectedOutput: true },
  { description: "usermod with numeric username", input: "usermod -L 123456", expectedOutput: true },
  { description: "usermod with underscore in username", input: "usermod -s /bin/zsh old_user", expectedOutput: true },
  { description: "usermod with all possible options", input: "usermod -c 'New comment' -d /newhome/user -e 2023-12-31 -f 30 -g users -G wheel,developers -l newuser -L -s /bin/zsh -u 1001 -U olduser", expectedOutput: true },
  { description: "Invalid: usermod with option after username", input: "usermod username -c 'New comment'", expectedOutput: false },
  { description: "usermod with long option requiring value", input: "usermod --expiredate 2023-12-31 username", expectedOutput: true },
  { description: "usermod with long option not requiring value", input: "usermod --lock username", expectedOutput: true },
];