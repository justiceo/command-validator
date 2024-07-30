import { cdTestCases } from "./builtins/cd.js";
import { chgrpTestCases } from "./builtins/chgrp.js";
import { chmodTestCases } from "./builtins/chmod.js";
import { chownTestCases } from "./builtins/chown.js";
import { cpTestCases } from "./builtins/cp.js";
import { lnTestCases } from "./builtins/ln.js";
import { lsTestCases } from "./builtins/ls.js";
import { mkdirTestCases } from "./builtins/mkdir.js";
import { mvTestCases } from "./builtins/mv.js";
import { rmTestCases } from "./builtins/rm.js";
import { rmdirTestCases } from "./builtins/rmdir.js";
import { touchTestCases } from "./builtins/touch.js";
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

[
  cdTestCases,
  chgrpTestCases,
  chmodTestCases,
  chownTestCases,
  cpTestCases,
  lnTestCases,
  lsTestCases,
  mkdirTestCases,
  mvTestCases,
  rmTestCases,
  rmdirTestCases,
  touchTestCases,
].forEach((testCase) => {
  console.log(`\n\n=========================`);
  runTestCase(testCase);
});

// TODO: Actually execute the commands and verify the test cases are correct.
