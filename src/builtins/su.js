import { BaseFSM } from "../base-fsm.js";

export class SuFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      su: this.handleSu.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      username: this.handleUsername.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 's' ? "su" : "invalid";
  }

  handleSu(char) {
    if (char === 'u') return "su";
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
    if (!this.commandSeen) {
      this.commandSeen = true;
      return "command";
    }
    if (char === undefined) return "valid";
    return "command";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    return "option";
  }

  handleUsername(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "username";
  }

  handleCommand(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const suTestCases = [
    { description: "Basic su", input: "su", expectedOutput: true },
    { description: "su with username", input: "su username", expectedOutput: true },
    { description: "su with hyphen (simulate full login)", input: "su -", expectedOutput: true },
    { description: "su with hyphen and username", input: "su - username", expectedOutput: true },
    { description: "su with -c option (run command)", input: "su -c 'command'", expectedOutput: true },
    { description: "su with -c option and username", input: "su -c 'command' username", expectedOutput: true },
    { description: "su with multiple options", input: "su -l -c 'command' username", expectedOutput: true },
    { description: "su with long options", input: "su --login --command='command' username", expectedOutput: true },
    { description: "su with -s option (specify shell)", input: "su -s /bin/bash username", expectedOutput: true },
    { description: "su with -p option (preserve environment)", input: "su -p username", expectedOutput: true },
    { description: "su with quoted command containing spaces", input: "su -c 'command with spaces' username", expectedOutput: true },
    { description: "su with multiple commands", input: "su -c 'command1 && command2' username", expectedOutput: true },
    { description: "su with redirection", input: "su -c 'command > output.log' username", expectedOutput: true },
    { description: "su with pipeline", input: "su -c 'command1 | command2' username", expectedOutput: true },
    { description: "su with invalid option", input: "su -z username", expectedOutput: true }, // su doesn't validate option names at syntax level
    { description: "su with extremely long input", input: "su " + "-c 'command' ".repeat(50) + "username", expectedOutput: true },
    { description: "su with quoted username containing spaces", input: "su 'user name with spaces'", expectedOutput: true },
    { description: "su with environment variables", input: "su -c 'echo $HOME' username", expectedOutput: true },
  ];