# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in ResumeForge AI, please **do not**
open a public GitHub issue.

Instead, report it privately:

- Email: **security@resumeforgeai.site** (replace with your real contact)
- Or use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) if enabled on this repo

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof of concept
- Any relevant logs, screenshots, or affected versions

We aim to acknowledge reports within 3 business days and to provide a fix or
mitigation timeline after triage.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅        |
| < 2.0   | ❌        |

## Scope Notes

- This repository is the **frontend only**. Report backend/API vulnerabilities
  through the same channel; we'll route them appropriately.
- Only the Razorpay **public key ID** should ever appear in this repo's
  environment variables. If you find a secret key, private credential, or
  token committed anywhere in this repo's history, please report it
  immediately as a high-priority issue.
