import { BaseFSM } from "../base-fsm.js";

export class GroupaddFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groupadd: this.handleGroupadd.bind(this),
      space: this.handleSpace.bind(this),
      option: this.handleOption.bind(this),
      optionValue: this.handleOptionValue.bind(this),
      groupname: this.handleGroupname.bind(this),
    };
  }

  transition(char) {
    this.state = this.states[this.state](char);
    return this.state !== "invalid";
  }

  handleStart(char) {
    return char === 'g' ? "groupadd" : "invalid";
  }

  handleGroupadd(char) {
    if ("roupadd".indexOf(char) !== -1) return "groupadd";
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

export const groupaddTestCases = [
  { description: "Basic groupadd", input: "groupadd newgroup", expectedOutput: true },
  { description: "groupadd with single short option", input: "groupadd -f newgroup", expectedOutput: true },
  { description: "groupadd with multiple short options", input: "groupadd -r -f newgroup", expectedOutput: true },
  { description: "groupadd with long option", input: "groupadd --system newgroup", expectedOutput: true },
  { description: "groupadd with mixed short and long options", input: "groupadd -K PASS_MAX_DAYS=99999 --force newgroup", expectedOutput: true },
  { description: "groupadd with specific GID", input: "groupadd -g 1001 newgroup", expectedOutput: true },
  { description: "groupadd with non-unique GID", input: "groupadd -o -g 1001 newgroup", expectedOutput: true },
  { description: "groupadd with key=value option", input: "groupadd -K PASS_MAX_DAYS=99999 newgroup", expectedOutput: true },
  { description: "Invalid: groupadd without groupname", input: "groupadd", expectedOutput: false },
  { description: "Invalid: groupadd with multiple groupnames", input: "groupadd group1 group2", expectedOutput: false },
  { description: "Invalid: groupadd with invalid option", input: "groupadd -z newgroup", expectedOutput: true }, // groupadd doesn't validate option names at syntax level
  { description: "groupadd with very long groupname", input: "groupadd verylonggroupnamexxxxxxxxxxxxxxxxxxxxxxxxx", expectedOutput: true },
  { description: "groupadd with numeric groupname", input: "groupadd 123456", expectedOutput: true },
  { description: "groupadd with underscore in groupname", input: "groupadd new_group", expectedOutput: true },
  { description: "groupadd with all possible options", input: "groupadd -f -K PASS_MAX_DAYS=99999 -g 1001 -o -r newgroup", expectedOutput: true },
  { description: "Invalid: groupadd with option after groupname", input: "groupadd newgroup -f", expectedOutput: false },
  { description: "groupadd with long option requiring value", input: "groupadd --gid 1001 newgroup", expectedOutput: true },
  { description: "groupadd with long option not requiring value", input: "groupadd --force newgroup", expectedOutput: true },
  { description: "groupadd with multiple key=value options", input: "groupadd -K PASS_MAX_DAYS=99999 -K PASS_MIN_DAYS=0 newgroup", expectedOutput: true },
];