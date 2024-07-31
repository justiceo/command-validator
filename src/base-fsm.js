// Abstract base class for all command FSMs
export class BaseFSM {
  constructor() {
    if (this.constructor === BaseFSM) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  isValid(command) {
    throw new Error("Method 'isValidCommand()' must be implemented.");
  }
}
