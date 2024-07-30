import { BaseFSM } from "../base-fsm.js";

export class PsFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      ps: this.handlePs.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      argument: this.handleArgument.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'p' ? "ps" : "invalid";
  }

  handlePs(char) {
    if (char === 's') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-' || char === 'a' || char === 'u' || char === 'x') return "option";
    if (char === undefined) return "valid";
    return "argument";
  }

  handleOption(char) {
    if (char === ' ' || char === '\t') {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "valid";
    return "option";
  }

  handleArgument(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "argument";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined);
  }
}

export const psTestCases = [
    { description: "Basic ps", input: "ps", expectedOutput: true },
    { description: "ps with single option", input: "ps -e", expectedOutput: true },
    { description: "ps with multiple options", input: "ps -ef", expectedOutput: true },
    { description: "ps with long option", input: "ps --pid 1234", expectedOutput: true },
    { description: "ps with BSD-style options", input: "ps aux", expectedOutput: true },
    { description: "ps with mixed BSD and UNIX options", input: "ps aux -e", expectedOutput: true },
    { description: "ps with process selection", input: "ps -C bash", expectedOutput: true },
    { description: "ps with custom format", input: "ps -o pid,user,%cpu,command", expectedOutput: true },
    { description: "ps with sorting", input: "ps --sort=-%cpu", expectedOutput: true },
    { description: "ps with multiple PIDs", input: "ps -p 1234,5678", expectedOutput: true },
    { description: "ps with forest option", input: "ps -ef --forest", expectedOutput: true },
    { description: "ps with very long option", input: "ps --format user,pid,tid,cpu,stat,time,comm", expectedOutput: true },
    { description: "ps with invalid option", input: "ps -z", expectedOutput: true }, // ps doesn't validate option names at syntax level
    { description: "ps with multiple invalid options", input: "ps -z -y -x", expectedOutput: true },
    { description: "ps with valid and invalid options", input: "ps -ef -z", expectedOutput: true },
    { description: "ps with extremely long input", input: "ps " + "-e".repeat(100), expectedOutput: true },
    { description: "ps with quoted argument", input: "ps -C 'bash -c sleep 100'", expectedOutput: true },
  ];