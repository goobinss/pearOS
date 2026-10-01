# Security policy

Report vulnerabilities privately through [GitHub Security Advisories](https://github.com/goobinss/pearOS/security/advisories/new). Please do not open a public issue with exploit details or credentials.

This repository contains the public web app, read-only SDK, and intentionally public API types. Pear Core credentials, signing, storage, and privileged routes belong in the separate private repository. Never include a real secret or private key in an issue, PR, example, or test fixture.

If a credential is exposed, revoke or rotate it at its provider immediately. Removing the file from a later commit does not remove it from Git history.
