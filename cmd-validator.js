import { LsFSM } from "./ls.js";
import { MkdirFSM } from "./mkdir.js";
import { CdFSM } from "./cd.js";

export class CommandValidator {
  constructor() {
    this.fsmMap = new Map([
      ["ls", new LsFSM()],
      ["mkdir", new MkdirFSM()],
      ["cd", new CdFSM()],
    ]);
  }

  validateCommand(commandString) {
    const command = commandString.trim().split(/\s+/)[0];
    const fsm = this.fsmMap.get(command);

    if (fsm) {
      return fsm.isValid(commandString);
    } else {
      // If no FSM exists for the command, consider it valid
      return true;
    }
  }
}

const simpleCommands = [
    // File and Directory Operations
    "cd",
    "ls",
    "mkdir",
    "rmdir",
    "cp",
    "mv",
    "rm",
    "touch",
    "ln",
    "chmod",
    "chown",
    "chgrp",
    // File Viewing and Editing
    "cat",
    "less",
    "more",
    "head",
    "tail",
    "nano",
    "vi",
    "vim",
    "emacs",
    // System Information
    "uname",
    "hostname",
    "whoami",
    "id",
    "groups",
    "which",
    "whereis",
    "type",
    // Process Management
    "ps",
    "top",
    "htop",
    "kill",
    "pkill",
    "killall",
    "nice",
    "renice",
    "nohup",
    // User Management
    "sudo",
    "su",
    "passwd",
    "useradd",
    "userdel",
    "usermod",
    "groupadd",
    "groupdel",
    "groupmod",
    // Network Commands
    "ping",
    "ifconfig",
    "ip",
    "netstat",
    "ss",
    "traceroute",
    "dig",
    "nslookup",
    "host",
    // Package Management (varies by distro, including common ones)
    "apt",
    "apt-get",
    "dpkg",
    "yum",
    "rpm",
    "dnf",
    "pacman",
    "zypper",
    // System Control
    "shutdown",
    "reboot",
    "poweroff",
    "systemctl",
    "service",
    // Text Processing
    "grep",
    "sort",
    "uniq",
    "wc",
    "cut",
    "paste",
    "tr",
    "sed",
    "awk",
    // Compression and Archiving
    "tar",
    "gzip",
    "gunzip",
    "zip",
    "unzip",
    "bzip2",
    "bunzip2",
    "xz",
    // Disk Usage and Management
    "df",
    "du",
    "fdisk",
    "mount",
    "umount",
    "fsck",
    // Shell Built-ins
    "echo",
    "printf",
    "read",
    "set",
    "unset",
    "export",
    "source",
    "alias",
    "unalias",
    // Miscellaneous
    "date",
    "cal",
    "bc",
    "expr",
    "true",
    "false",
    "yes",
    "tee",
  ];
  
  const complexCommands = [
    // Advanced Text Processing
    "awk",
    "sed",
    "perl",
    "python",
    "ruby",
    // Advanced File Operations
    "find",
    "xargs",
    "rsync",
    // Advanced Process Management
    "strace",
    "ltrace",
    "gdb",
    // Network Tools
    "curl",
    "wget",
    "ssh",
    "scp",
    "netcat",
    "socat",
    // System Monitoring and Performance
    "sar",
    "iostat",
    "vmstat",
    "mpstat",
    // Text Editors (when used with complex options)
    "vim",
    "emacs",
    // Version Control Systems
    "git",
    "svn",
    "mercurial",
    // Containerization and Virtualization
    "docker",
    "kubectl",
    "vagrant",
    // Database CLIs
    "mysql",
    "psql",
    "mongo",
    "redis-cli",
    // Build Tools
    "make",
    "cmake",
    "gcc",
    "g++",
    // System Configuration
    "iptables",
    "selinux",
    // Scripting Languages (when used as commands)
    "bash",
    "zsh",
    "fish",
    // Advanced Disk Operations
    "lvm",
    "cryptsetup",
    // Advanced Network Diagnostics
    "tcpdump",
    "wireshark",
    "nmap",
  ];
  
  