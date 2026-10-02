# Release controls for the owner

Code pushes publish reviewed source to the existing repositories when the owner requests them. Hosting changes, token deployment and payments are separate manual actions. Keep Pear Core private.

Protect the release branch (normally main) in GitHub settings: require PRs, CODEOWNERS review, passing Public CI, resolved conversations, no force pushes/deletions and restrict direct/bypass pushes. Have a separate maintainer review official bounty/payout content, configuration/addresses, dependencies and workflows. Require the browser, content and secret checks. CODEOWNERS names the current repository owner from the existing setup; it neither enables these settings nor restricts read access.

Use environments with owner-controlled production deployment approval. Pull requests and previews get no production credentials or wallet access. Do not use pull_request_target to execute submitted code. Scope any optional GitHub read token to the configured public repository and the minimum read permission. Hosting configuration and recovery material stay outside public Git.

Before publication, review INTEGRATIONS.md blockers, exact passing verification results, secret findings and the artwork license. A fixture test cannot close a live integration blocker. After an authorized deployment, run an owner-controlled live smoke check with public read-only configuration.
