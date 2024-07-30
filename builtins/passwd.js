import { BaseFSM } from "../base-fsm.js";

export class PasswdFSM extends BaseFSM {
  constructor() {
    super();
    this.state = "start";
    this.optionSeen = false;
    this.usernameSeen = false;
    this.states = {
      start: this.handleStart.bind(this),
      passwd: this.handlePasswd.bind(this),
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
    return char === 'p' ? "passwd" : "invalid";
  }

  handlePasswd(char) {
    if ("asswd".indexOf(char) !== -1) return "passwd";
    if (char === ' ' || char === '\t') return "space";
    if (char === undefined) return "valid";
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
    if (char === undefined) return "valid";
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

export const passwdTestCases = [
    { description: "Basic passwd (change own password)", input: "passwd", expectedOutput: true },
    { description: "passwd for specific user", input: "passwd username", expectedOutput: true },
    { description: "passwd with -l option (lock account)", input: "passwd -l username", expectedOutput: true },
    { description: "passwd with -u option (unlock account)", input: "passwd -u username", expectedOutput: true },
    { description: "passwd with -d option (delete password)", input: "passwd -d username", expectedOutput: true },
    { description: "passwd with -e option (expire password)", input: "passwd -e username", expectedOutput: true },
    { description: "passwd with -n option (set minimum days)", input: "passwd -n 30 username", expectedOutput: true },
    { description: "passwd with -x option (set maximum days)", input: "passwd -x 90 username", expectedOutput: true },
    { description: "passwd with -w option (set warning days)", input: "passwd -w 7 username", expectedOutput: true },
    { description: "passwd with -i option (set inactive days)", input: "passwd -i 30 username", expectedOutput: true },
    { description: "passwd with -S option (status)", input: "passwd -S username", expectedOutput: true },
    { description: "passwd with multiple options", input: "passwd -l -S username", expectedOutput: true },
    { description: "passwd with long options", input: "passwd --lock --status username", expectedOutput: true },
    { description: "passwd for all users", input: "passwd -a", expectedOutput: true },
    { description: "passwd with invalid option", input: "passwd -z username", expectedOutput: true }, // passwd doesn't validate option names at syntax level
    { description: "passwd with extremely long input", input: "passwd " + "-S ".repeat(50) + "username", expectedOutput: true },
    { description: "passwd with quoted username containing spaces", input: "passwd 'user name with spaces'", expectedOutput: true },
    { description: "passwd with stdin redirection (not recommended but syntactically valid)", input: "passwd username < password_file", expectedOutput: true },
  ];