import { BaseFSM } from "../base-fsm.js";

export class SudoFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.commandSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      sudo: this.handleSudo.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      command: this.handleCommand.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 's' ? "sudo" : "invalid";
  }

  handleSudo(char) {
    if ("udo".indexOf(char) !== -1) return "sudo";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
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

  handleCommand(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "command";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.commandSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const sudoTestCases = [
    { description: "Basic sudo", input: "sudo command", expectedOutput: true },
    { description: "sudo with options", input: "sudo -u user command", expectedOutput: true },
    { description: "sudo with multiple options", input: "sudo -u user -g group command", expectedOutput: true },
    { description: "sudo with long options", input: "sudo --user=user --group=group command", expectedOutput: true },
    { description: "sudo with command and arguments", input: "sudo command arg1 arg2", expectedOutput: true },
    { description: "sudo with quoted command", input: "sudo 'command with spaces'", expectedOutput: true },
    { description: "sudo with environment variables", input: "sudo -E command", expectedOutput: true },
    { description: "sudo with specific environment variables", input: "sudo ENV_VAR=value command", expectedOutput: true },
    { description: "sudo with shell", input: "sudo sh -c 'command1 && command2'", expectedOutput: true },
    { description: "sudo with redirection", input: "sudo command > output.log 2>&1", expectedOutput: true },
    { description: "sudo with pipeline", input: "sudo command1 | command2", expectedOutput: true },
    { description: "sudo without command (open shell)", input: "sudo", expectedOutput: true },
    { description: "sudo with -i option (simulate initial login)", input: "sudo -i", expectedOutput: true },
    { description: "sudo with -s option (run shell)", input: "sudo -s", expectedOutput: true },
    { description: "sudo with -l option (list allowed commands)", input: "sudo -l", expectedOutput: true },
    { description: "sudo with -k option (invalidate timestamp)", input: "sudo -k command", expectedOutput: true },
    { description: "sudo with -b option (run in background)", input: "sudo -b command", expectedOutput: true },
    { description: "sudo with -H option (set HOME)", input: "sudo -H command", expectedOutput: true },
    { description: "sudo with multiple short options", input: "sudo -Hbu user command", expectedOutput: true },
    { description: "sudo with invalid option", input: "sudo -z command", expectedOutput: true }, // sudo doesn't validate option names at syntax level
    { description: "sudo with extremely long input", input: "sudo " + "-u user ".repeat(50) + "command", expectedOutput: true },
    { description: "sudo with quoted arguments containing spaces", input: "sudo command 'arg with spaces' \"another arg with spaces\"", expectedOutput: true },
  ];