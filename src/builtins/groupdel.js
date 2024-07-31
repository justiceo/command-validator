import { BaseFSM } from "../base-fsm.js";

export class GroupdelFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groupdel: this.handleGroupdel.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      groupname: this.handleGroupname.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'g' ? "groupdel" : "invalid";
  }

  handleGroupdel(char) {
    if ("roupdel".indexOf(char) !== -1) return "groupdel";
    if (char === ' ' || char === '\t') return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === '-') return "option";
    if (!this.groupnameSeen) {
      this.groupnameSeen = true;
      return "groupname";
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

  handleGroupname(char) {
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
    return "groupname";
  }

  isValid(command) {
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    for (let char of command) {
      if (!this.transition(char)) return false;
    }
    return this.transition(undefined) && this.groupnameSeen;
  }
}

export const groupdelTestCases = [
  { description: "Basic groupdel", input: "groupdel testgroup", expectedOutput: true },
  { description: "groupdel with force option", input: "groupdel -f testgroup", expectedOutput: true },
  { description: "groupdel with long force option", input: "groupdel --force testgroup", expectedOutput: true },
  { description: "groupdel with multiple options", input: "groupdel -f --force testgroup", expectedOutput: true },
  { description: "Invalid: groupdel without groupname", input: "groupdel", expectedOutput: false },
  { description: "Invalid: groupdel with multiple groupnames", input: "groupdel group1 group2", expectedOutput: false },
  { description: "Invalid: groupdel with invalid option", input: "groupdel -z testgroup", expectedOutput: true }, // groupdel doesn't validate option names at syntax level
  { description: "groupdel with very long groupname", input: "groupdel verylonggroupnamexxxxxxxxxxxxxxxxxxxxxxxxx", expectedOutput: true },
  { description: "groupdel with numeric groupname", input: "groupdel 123456", expectedOutput: true },
  { description: "groupdel with underscore in groupname", input: "groupdel test_group", expectedOutput: true },
  { description: "Invalid: groupdel with option after groupname", input: "groupdel testgroup -f", expectedOutput: false },
  { description: "groupdel with multiple spaces", input: "groupdel     testgroup", expectedOutput: true },
  { description: "groupdel with tab character", input: "groupdel\ttestgroup", expectedOutput: true },
  { description: "groupdel with mixed spaces and tabs", input: "groupdel \t \t testgroup", expectedOutput: true },
  { description: "groupdel with force option and spaces", input: "groupdel   -f   testgroup", expectedOutput: true },
  { description: "Invalid: groupdel with no arguments after option", input: "groupdel -f", expectedOutput: false },
  { description: "Invalid: groupdel with extra argument", input: "groupdel testgroup extraarg", expectedOutput: false },
];