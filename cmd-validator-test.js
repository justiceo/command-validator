import { lsTestCases } from "./ls.js";
import { mkdirTestCases } from "./mkdir.js";
import { cdTestCases } from "./cd.js";
import { CommandValidator } from "./cmd-validator.js";

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
};

function runTestCase(testCase) {
  const validator = new CommandValidator();
  for (const { description, input, expectedOutput } of testCase) {
    const result = validator.validateCommand(input);
    const status = result === expectedOutput ? "PASS" : "FAIL";
    const color = result === expectedOutput ? colors.green : colors.red;
    console.log(
      `${color}${status}: ${description}${
        result === expectedOutput
          ? ""
          : `: "${input}", expected: ${expectedOutput}, got: ${result}`
      }${colors.reset}`
    );
  }
}

[lsTestCases, mkdirTestCases, cdTestCases].forEach((testCase) => {
  console.log(`\n\n=========================`);
  runTestCase(testCase);
});

// TODO: Actually execute the commands and verify the test cases are correct.