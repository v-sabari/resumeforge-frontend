# Contributing to ResumeForge AI

Thanks for taking the time to contribute. This guide covers how to get set up and how changes get merged.

## Getting Set Up

1. Fork and clone the repo
2. `npm install`
3. `cp .env.example .env` and fill in your local values
4. `npm run dev` to start the dev server

See the [README](./README.md) for full setup details.

## Branching

- Branch off `main`
- Use a descriptive prefix: `feat/…`, `fix/…`, `chore/…`, `docs/…`
- Keep branches focused on a single change

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add ATS score breakdown to resume preview
fix: correct PDF export margin on the second page
docs: update environment variable table
```

## Before Opening a PR

- [ ] `npm run lint` passes with no warnings
- [ ] `npm run build` completes successfully (this also verifies the PDF pipeline)
- [ ] New environment variables are documented in `.env.example` and the README
- [ ] No secrets, API keys, or `.env` files are included in the diff

## Pull Requests

- Fill out the PR template
- Link any related issue
- Keep PRs small and reviewable where possible
- A maintainer will review and may request changes before merging

## Code Style

- Functional React components with hooks
- Co-locate feature logic under `src/services`, `src/pages`, `src/components` following the existing structure
- Run `npm run lint` before pushing — ESLint is configured with `--max-warnings 0`

## Reporting Bugs / Requesting Features

Please use the issue templates under **Issues → New Issue**.

## Security Issues

Do not open a public issue for security vulnerabilities — see [SECURITY.md](./SECURITY.md).
