import { BaseFSM } from "../base-fsm.js";

export class GroupmodFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.groupnameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      groupmod: this.handleGroupmod.bind(this),
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
    return char === "g" ? "groupmod" : "invalid";
  }

  handleGroupmod(char) {
    if ("roupmod".indexOf(char) !== -1) return "groupmod";
    if (char === " " || char === "\t") return "space";
    return "invalid";
  }

  handleSpace(char) {
    if (char === " " || char === "\t") return "space";
    if (char === "-") return "option";
    if (!this.groupnameSeen) {
      this.groupnameSeen = true;
      return "groupname";
    }
    if (char === undefined) return "valid";
    return "invalid";
  }

  handleOption(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleOptionValue(char) {
    if (char === " " || char === "\t") {
      this.optionSeen = true;
      return "space";
    }
    if (char === undefined) return "invalid";
    return "optionValue";
  }

  handleGroupname(char) {
    if (char === " " || char === "\t") return "space";
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

export const groupmodTestCases = [
  {
    description: "Basic groupmod",
    input: "groupmod -n newname oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod changing GID",
    input: "groupmod -g 1001 testgroup",
    expectedOutput: true,
  },
  {
    description: "groupmod with long option",
    input: "groupmod --new-name newname oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod with multiple options",
    input: "groupmod -g 1001 -n newname oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod with non-unique GID",
    input: "groupmod -o -g 1001 testgroup",
    expectedOutput: true,
  },
  {
    description: "Invalid: groupmod without groupname",
    input: "groupmod -n newname",
    expectedOutput: false,
  },
  {
    description: "Invalid: groupmod with multiple groupnames",
    input: "groupmod -n newname group1 group2",
    expectedOutput: false,
  },
  {
    description: "Invalid: groupmod with invalid option",
    input: "groupmod -z testgroup",
    expectedOutput: true,
  }, // groupmod doesn't validate option names at syntax level
  {
    description: "groupmod with very long groupname",
    input: "groupmod -n newname verylonggroupnamexxxxxxxxxxxxxxxxxxxxxxxxx",
    expectedOutput: true,
  },
  {
    description: "groupmod with numeric groupname",
    input: "groupmod -g 1001 123456",
    expectedOutput: true,
  },
  {
    description: "groupmod with underscore in groupname",
    input: "groupmod -n new_name old_name",
    expectedOutput: true,
  },
  {
    description: "Invalid: groupmod with option after groupname",
    input: "groupmod oldname -n newname",
    expectedOutput: false,
  },
  {
    description: "groupmod with multiple spaces",
    input: "groupmod   -n   newname   oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod with tab character",
    input: "groupmod\t-n\tnewname\toldname",
    expectedOutput: true,
  },
  {
    description: "groupmod with mixed spaces and tabs",
    input: "groupmod \t -n \t newname \t oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod changing name and GID",
    input: "groupmod -g 1001 -n newname oldname",
    expectedOutput: true,
  },
  {
    description: "groupmod with long options",
    input: "groupmod --gid 1001 --new-name newname oldname",
    expectedOutput: true,
  },
  {
    description: "Invalid: groupmod without options",
    input: "groupmod testgroup",
    expectedOutput: false,
  },
  {
    description: "Invalid: groupmod with conflicting options",
    input: "groupmod -g 1001 -n newname -g 1002 oldname",
    expectedOutput: true,
  }, // This is syntactically valid but semantically incorrect
  {
    description: "groupmod with quoted new name",
    input: "groupmod -n 'new group name' oldname",
    expectedOutput: true,
  },
];
