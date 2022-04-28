# Falco Add-on

## What is Falco?

The Falco Project is an open-source runtime security tool originally built by [Sysdig, Inc](https://sysdig.com), and donated to the CNCF. Currently, it is a [CNCF incubating project](https://www.cncf.io/blog/2020/01/08/toc-votes-to-move-falco-into-cncf-incubator/).

Falco uses system calls to secure and monitor a system, by:

 - Parsing the Linux system calls from the kernel at runtime
 - Asserting the stream against a powerful rules engine
 - Alerting when a rule is violated

From a high-level perspective, you can find two main components: 

- Falco Rules
- Falco Alerts

A **rule** is a definition against which the stream of events from the kernel is observed. It defines which conditions an event has to meet to trigger the alert. An **alert** is the output of a rule. Whenever one rule is triggered, Falco notifies you about it using channels defined by you. 

## Falco Rules

Falco ships with a default set of rules that check the *kernel* for unusual behaviour such as:

 - Privilege escalation using privileged containers
 - Namespace changes using tools like *setns*
 - Read/Writes to well-known directories such as */etc*, */usr/bin*, */usr/sbin*, etc
 - Creating symlinks
 - Ownership and Mode changes
 - Unexpected network connections or socket mutations
 - Spawned processes using *execve*
 - Executing shells such as *sh*, *bash*, *csh*, *zsh*, etc

## Usage

```typescript
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';

const app = new cdk.App();

const addOn = new blueprints.addons.FalcoAddOn();

const blueprint = blueprints.EksBlueprint.builder()
  .addOns(addOn)
  .build(app, 'my-stack-name');
```

## Configuration Options

- `version`: Version for the Helm Chart to be used to install Falco
- `kubernetesSupportEnabled`: Enable Kubernetes meta data collection via a connection to the Kubernetes API server. Set to true by default. 
- `falcoSidekickEnabled`: Enable falcosidekick deployment. This is set to false by default but we recommend enabling it for additional security configuration options. 
- `values`: Arbitrary values to pass to the chart. Refer to the [Falco Helm Chart documentation](https://github.com/falcosecurity/charts/tree/master/falco#configuration) for additional details

If you would like to configure additional parameters of the Falco helm chart, those parameters can be found [here](https://github.com/falcosecurity/charts/tree/master/falco#configuration)

## Validation

To validate that Falco is installed properly in the cluster, check that the Falco deployments are running in the cluster. 

**Note that Falco is installed in its own `Falco` namespace**

```bash
  kubectl get all -n falco
```

Output should be something like the following:

```bash
NAME          READY   STATUS             RESTARTS   AGE
falco-4l6t9   1/1     Running            0          4m8s
falco-kjlxp   1/1     Running            0          4m8s
```

## Falco Rules Overview

Before you dive into the details of each of those, you need to know the structure of the *Falco* config files. You might be familiar with the structure based on other cloud-native security tools that you may have used in the past. 


## Falco config files

By default, rules are located under `/etc/falco/`.

```bash
$ tree /etc/falco/
/etc/falco/
├── falco_rules.local.yaml
├── falco_rules.yaml
├── falco.yaml
├── k8s_audit_rules.yaml
├── rules.available
│   └── application_rules.yaml
└── rules.d
2 directories, 5 files
```

The purpose of each of these files is:

 - **falco_rules.yaml**: Community updated Falco rules for general hosts and containers, overwritten on Falco upgrade.
 - **falco_rules.local.yaml**: Your own rules, preserved when upgrading Falco version, put your rules here.
 - **k8s_audit_rules.yaml**: Community updated Falco rules for Kubernetes audit, overwritten on Falco upgrade.
 - **falco.yaml**: General Falco configuration.
 - **rules.available/application_rules.yaml**: Move to rules.d to activate.
 - **rules.d/**: files in this directory will be processed as rules in alphabetical order.

The [Cloud Native Security Hub](https://securityhub.dev/) is a source for community updated Falco rules for many applications and environments.


## Falco Rules Linting

You will touch on a number of these files as you progress through the workshop. So it is a good practice to know how to check its syntax:

```BASH
$ falco -L
Tue Jun  1 10:34:50 2021: Falco version 0.28.2 (driver version 13ec67ebd23417273275296813066e07cb85bc91)
Tue Jun  1 10:34:50 2021: Falco initialized with configuration file /etc/falco/falco.yaml
Tue Jun  1 10:34:50 2021: Loading rules from file /etc/falco/falco_rules.yaml:
Tue Jun  1 10:34:50 2021: Loading rules from file /etc/falco/falco_rules.local.yaml:
Tue Jun  1 10:34:50 2021: Loading rules from file /etc/falco/k8s_audit_rules.yaml:

Rule                                               Description
----                                               -----------
Outbound or Inbound Traffic not to Authorized Server Process and Port Detect traffic that is not to authorized server process and port.
(...)
```

Here you can see information in your current instance of Falco:

- Falco and driver versiones
- Configuration and rule files
- A list with all the rules defined and their descriptions.

If any syntax errors were made to any of your rule files, you'll be notified:

```log
Tue Jun  1 10:37:03 2021: Runtime error: Could not load rules file /etc/falco/falco_rules.yaml: 1 errors:
```

It is recommended to use the linter any time you edit any of the rule files while using Falco.


## Rules versioning

Rule files include a `required_engine_version: N` that specifies the minimum engine version required (if not included, no check is performed). This identifier is useful to know when a `falco_rules` definition file is compatible with your current version of *Falco*.

## Using Falco on EKS

What happens when the k8s cluster is a managed k8s service like AWS EKS? *You have no direct access to the Audit logs, so there is no direct way to inspect the EKS Audit Logs with Falco!*

Luckily, there is an alternative: you can choose to forward the Audit Logs from [EKS to CloudWatch](https://docs.aws.amazon.com/eks/latest/userguide/logging-monitoring.html). This service provides access from CloudWatch to a record of actions taken by a user, role, or an AWS service in Amazon EKS. Once the logs are sent to CloudWatch, you can use [*ekscloudwatch*](https://github.com/sysdiglabs/ekscloudwatch) to read EKS Kubernetes audit logs and forward them to Falco.