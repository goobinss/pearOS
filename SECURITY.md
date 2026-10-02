# Security

Report vulnerabilities privately through [GitHub Security Advisories](https://github.com/goobinss/pearOS/security/advisories/new). If private reporting is unavailable, contact the repository owner through an established private channel. Do not put credentials or exploit details in public issues.

This repository is a public read-only application. Its server makes authenticated GETs to private Pear Core. It has no signing, payment sends, contract deployment or wallet connection. Backend credentials may only be used by the server-only client; never put them in NEXT_PUBLIC variables, fixtures, client props or logs.

Official terms, addresses and payout records require maintainer review and protected release branches. CI runs ordinary unprivileged pull_request events with contents:read and no production secrets. CODEOWNERS alone is not access control or branch protection.

If a credential leak is found in files or reachable Git history, report its location without reproducing the credential and revoke/rotate it. Do not silently remove evidence or rewrite history. Local ignored environment files must not be included in source archives. This code has focused security checks, not an independent audit.
