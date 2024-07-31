import { cdTestCases } from "../src/builtins/cd.js";
import { chgrpTestCases } from "../src/builtins/chgrp.js";
import { chmodTestCases } from "../src/builtins/chmod.js";
import { chownTestCases } from "../src/builtins/chown.js";
import { cpTestCases } from "../src/builtins/cp.js";
import { lnTestCases } from "../src/builtins/ln.js";
import { lsTestCases } from "../src/builtins/ls.js";
import { mkdirTestCases } from "../src/builtins/mkdir.js";
import { mvTestCases } from "../src/builtins/mv.js";
import { rmTestCases } from "../src/builtins/rm.js";
import { rmdirTestCases } from "../src/builtins/rmdir.js";
import { touchTestCases } from "../src/builtins/touch.js";
import { catTestCases } from "../src/builtins/cat.js";
import { emacsTestCases } from "../src/builtins/emacs.js";
import { headTestCases } from "../src/builtins/head.js";
import { lessTestCases } from "../src/builtins/less.js";
import { moreTestCases } from "../src/builtins/more.js";
import { nanoTestCases } from "../src/builtins/nano.js";
import { tailTestCases } from "../src/builtins/tail.js";
import { viTestCases } from "../src/builtins/vi.js";
import { vimTestCases } from "../src/builtins/vim.js";
import { groupaddTestCases } from "../src/builtins/groupadd.js";
import { groupdelTestCases } from "../src/builtins/groupdel.js";
import { groupmodTestCases } from "../src/builtins/groupmod.js";
import { groupsTestCases } from "../src/builtins/groups.js";
import { idTestCases } from "../src/builtins/id.js";
import { killTestCases } from "../src/builtins/kill.js";
import { killallTestCases } from "../src/builtins/killall.js";
import { niceTestCases } from "../src/builtins/nice.js";
import { nohupTestCases } from "../src/builtins/nohup.js";
import { passwdTestCases } from "../src/builtins/passwd.js";
import { pkillTestCases } from "../src/builtins/pkill.js";
import { psTestCases } from "../src/builtins/ps.js";
import { reniceTestCases } from "../src/builtins/renice.js";
import { suTestCases } from "../src/builtins/su.js";
import { sudoTestCases } from "../src/builtins/sudo.js";
import { unameTestCases } from "../src/builtins/uname.js";
import { useraddTestCases } from "../src/builtins/useradd.js";
import { userdelTestCases } from "../src/builtins/userdel.js";
import { usermodTestCases } from "../src/builtins/usermod.js";
import { whichTestCases } from "../src/builtins/which.js";
import { whereisTestCases } from "../src/builtins/whereis.js";
import { whoamiTestCases } from "../src/builtins/whoami.js";

import { CommandValidator } from "../src/cmd-validator.js";

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
  catTestCases,
  emacsTestCases,
  headTestCases,
  lessTestCases,
  moreTestCases,
  nanoTestCases,
  tailTestCases,
  viTestCases,
  vimTestCases,
  groupaddTestCases,
  groupdelTestCases,
  groupmodTestCases,
  groupsTestCases,
  idTestCases,
  killTestCases,
  killallTestCases,
  niceTestCases,
  nohupTestCases,
  passwdTestCases,
  pkillTestCases,
  psTestCases,
  reniceTestCases,
  suTestCases,
  sudoTestCases,
  unameTestCases,
  useraddTestCases,
  userdelTestCases,
  usermodTestCases,
  whichTestCases,
  whereisTestCases,
  whoamiTestCases,
].forEach((testCase) => {
  console.log(`\n\n=========================`);
  runTestCase(testCase);
});

// TODO: Actually execute the commands and verify the test cases are correct.
