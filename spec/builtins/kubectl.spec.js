import { CommandValidator } from "../../src/cmd-validator.js";

describe("kubectl command validation", () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  test("Basic kubectl command", () => {
    expect(validator.validateCommand("kubectl")).toBe(true);
  });

  test("kubectl with log options", () => {
    expect(validator.validateCommand("kubectl --logtostderr=true")).toBe(true);
  });

  test("kubectl with API version option", () => {
    expect(validator.validateCommand("kubectl --api-version=v1")).toBe(true);
  });

  test("kubectl with certificate authority option", () => {
    expect(validator.validateCommand("kubectl --certificate-authority=/path/to/ca.pem")).toBe(true);
  });

  test("kubectl with client certificate option", () => {
    expect(validator.validateCommand("kubectl --client-certificate=/path/to/cert.pem")).toBe(true);
  });

  test("kubectl with context option", () => {
    expect(validator.validateCommand("kubectl --context=my-context")).toBe(true);
  });

  test("kubectl with insecure TLS verify", () => {
    expect(validator.validateCommand("kubectl --insecure-skip-tls-verify")).toBe(true);
  });

  test("kubectl with kubeconfig option", () => {
    expect(validator.validateCommand("kubectl --kubeconfig=/path/to/kubeconfig")).toBe(true);
  });

  test("kubectl with namespace option", () => {
    expect(validator.validateCommand("kubectl --namespace=default")).toBe(true);
  });

  test("kubectl with server option", () => {
    expect(validator.validateCommand("kubectl -s https://localhost:6443")).toBe(true);
  });

  test("kubectl with authentication token", () => {
    expect(validator.validateCommand("kubectl --token=my-token")).toBe(true);
  });

  test("kubectl with username and password", () => {
    expect(validator.validateCommand("kubectl --username=myuser --password=mypass")).toBe(true);
  });

  test("kubectl with log level option", () => {
    expect(validator.validateCommand("kubectl -v=4")).toBe(true);
  });

  test("kubectl with invalid option", () => {
    expect(validator.validateCommand("kubectl --invalid-option")).toBe(false);
  });

  test("kubectl with missing namespace", () => {
    expect(validator.validateCommand("kubectl get pods -n ")).toBe(false);
  });

  test("kubectl with incorrect command syntax", () => {
    expect(validator.validateCommand("kubectlget pods --all-namespaces --output= ")).toBe(false);
  });

  test("kubectl with space before option", () => {
    expect(validator.validateCommand(" kubectl --logtostderr")).toBe(true);
  });

  test("kubectl with multiple options", () => {
    expect(validator.validateCommand("kubectl --context=my-context --namespace=default")).toBe(true);
  });

  test("kubectl with quoted arguments", () => {
    expect(validator.validateCommand('kubectl --kubeconfig="/path/to/config"')).toBe(true);
  });

  test("kubectl with escaped characters", () => {
    expect(validator.validateCommand("kubectl --client-key=/path/to/key\\ file")).toBe(true);
  });

  test("kubectl with environment variable", () => {
    expect(validator.validateCommand("kubectl --kubeconfig=$HOME/.kube/config")).toBe(true);
  });
});