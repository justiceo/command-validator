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
import { catTestCases } from "./builtins/cat.js";
import { emacsTestCases } from "./builtins/emacs.js";
import { headTestCases } from "./builtins/head.js";
import { lessTestCases } from "./builtins/less.js";
import { moreTestCases } from "./builtins/more.js";
import { nanoTestCases } from "./builtins/nano.js";
import { tailTestCases } from "./builtins/tail.js";
import { viTestCases } from "./builtins/vi.js";
import { vimTestCases } from "./builtins/vim.js";
import { groupaddTestCases } from "./builtins/groupadd.js";
import { groupdelTestCases } from "./builtins/groupdel.js";
import { groupmodTestCases } from "./builtins/groupmod.js";
import { groupsTestCases } from "./builtins/groups.js";
import { idTestCases } from "./builtins/id.js";
import { killTestCases } from "./builtins/kill.js";
import { killallTestCases } from "./builtins/killall.js";
import { niceTestCases } from "./builtins/nice.js";
import { nohupTestCases } from "./builtins/nohup.js";
import { passwdTestCases } from "./builtins/passwd.js";
import { pkillTestCases } from "./builtins/pkill.js";
import { psTestCases } from "./builtins/ps.js";
import { reniceTestCases } from "./builtins/renice.js";
import { suTestCases } from "./builtins/su.js";
import { sudoTestCases } from "./builtins/sudo.js";
import { unameTestCases } from "./builtins/uname.js";
import { useraddTestCases } from "./builtins/useradd.js";
import { userdelTestCases } from "./builtins/userdel.js";
import { usermodTestCases } from "./builtins/usermod.js";
import { whichTestCases } from "./builtins/which.js";
import { whereisTestCases } from "./builtins/whereis.js";
import { whoamiTestCases } from "./builtins/whoami.js";

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
