# ResumeForge field coverage matrix

**Audit date:** 2026-11-13 · **Dataset:** 196 editor controls / 190 populated values / 6 intentionally empty partial-repeater values

**Trees audited (working copies; changes were uncommitted during the audit):**

- Frontend: `C:\Users\Sabari\Downloads\resumeforge-frontend-master\resumeforge-frontend-master` — `https://github.com/v-sabari/resumeforge-frontend` (branch `master`)
- Backend: `C:\Users\Sabari\Downloads\resumeforge-backend-master\resumeforge-backend-master` — `https://github.com/v-sabari/resumeforge-backend` (branch `master`)

## Scope

Every input from Personal Info through the last field of every dynamically added custom section was exercised with maximum-coverage data: long multi-line paragraphs, 1–3+ page overflow, Unicode (accented Latin, CJK, Arabic RTL), emoji, special characters (`& < > " ' / \ @ # % — “ ”`), partial repeaters, and a custom section added, renamed, reordered, hidden and deleted. All 20 templates were rendered; every value was then checked in the live-preview component tree and in PDF, DOCX and TXT output.

The audit answers three questions for each control: **does the value reach the preview**, **does it survive each export as text** (after the documented extraction normalisations), and **does the surrounding layout stay correct** (heading present once, correct section order, no orphan heading, no clipping, no placeholder).

## Method and evidence levels

| Renderer | How it was exercised | Result |
| --- | --- | --- |
| Live preview (editor) | The builder preview and PDF export use the same template components, same `transformResume`, same `previewPagination`. All 20 components were server-rendered (`react-dom/server`) from the exact dataset; each of the 190 values must appear in the markup. | 20/20 templates, 190/190 fields |
| PDF | Real browser export through `api/render-pdf.js` with local Chrome: 20 templates × max-coverage data + 2 font-override variants (Times New Roman on Modern, Courier New on Academic) = 22 PDFs. Text extracted with `pdf.js`; heading positions, order, orphans, blank pages and glyph bounding boxes checked. | 22/22 PDFs, 190/190 fields, 17/17 headings per PDF, 0 clipped |
| DOCX | Backend `ExportService.exportToDocx` invoked by a JUnit harness, 213 assertions (190 values + 17 headings + section order + 5 broken-text guards), then rendered by Word 16.0 to PDF for pagination inspection. | 213/213 checks, 5 pages, 17/17 headings, no blank/orphan page |
| TXT | Same JUnit harness through `exportToTxt`. | 213/213 checks, 172 lines |

Across the matrix that is **3,800 preview value renders + 4,180 PDF value renders + 190 DOCX + 190 TXT = 8,360 value-render assertions**, plus 374 PDF heading checks, 34 DOCX/TXT heading checks, PDF geometry, pagination and order checks.

Legend: `✓ 20/20` = value rendered in every one of the 20 templates; `✓ 22/22` = value present in every exported PDF (20 templates + 2 font variants); `✓` = DOCX/TXT assertion passed; `n/a` = control intentionally left empty in a partial repeater — the field is absent by design and no placeholder was emitted (global broken-text guards pass in every export).

## Coverage summary

| Section | Controls | Populated | Intentionally empty |
| --- | ---: | ---: | ---: |
| Personal info | 8 | 8 | 0 |
| Executive profile | 1 | 1 | 0 |
| Professional experience | 38 | 37 | 1 |
| Selected projects | 27 | 25 | 2 |
| Education & training | 18 | 16 | 2 |
| Certifications & credentials | 12 | 11 | 1 |
| Technical skills | 12 | 12 | 0 |
| Awards & achievements | 6 | 6 | 0 |
| Languages | 5 | 5 | 0 |
| Interests (addable standard) | 1 | 1 | 0 |
| Honours (addable standard) | 3 | 3 | 0 |
| References (addable standard) | 11 | 11 | 0 |
| Volunteering (addable standard) | 6 | 6 | 0 |
| Publications & talks (addable standard) | 9 | 9 | 0 |
| Custom section: Technical Toolkit (grid) | 24 | 24 | 0 |
| Custom section: Teaching & Advisory (entries) | 11 | 11 | 0 |
| Custom section: Community Involvement (bullets) | 3 | 3 | 0 |
| Custom section: Career Philosophy (text) | 1 | 1 | 0 |
| **Total** | **196** | **190** | **6** |

The six empty values are one experience summary, one project link, one project GitHub URL, one education grade, one education details and one certification credential URL. They exercise the partial-repeater path: their labels and separators must disappear rather than print an empty box, dangling dash or placeholder.

## Field-by-field matrix

Rows are grouped by section in data-model order. Field paths use the resume JSON model (`personalInfo.*`, `experience[i].*`, `customSections[id].*`). Custom and addable standard sections are included in the same matrix because they are edited by the same repeater control.

### Personal info (8/8 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `personalInfo.fullName` | text input | Aarav Krishnan-Rao | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 2 | `personalInfo.professionalTitle` | text input | Principal Platform Architect & Site Reliability Lead | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 3 | `personalInfo.email` | email input | aarav.krishnan+resume-max-coverage@example.com | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 4 | `personalInfo.phone` | tel input | +91 98765 43210 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 5 | `personalInfo.location` | text input | Chennai, Tamil Nadu, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 6 | `personalInfo.linkedin` | URL input | https://www.linkedin.com/in/aarav-krishnan-rao-9a8b7c6d5e | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 7 | `personalInfo.github` | URL input | https://github.com/aaravkrishnan-qa-max-coverage | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 8 | `personalInfo.portfolio` | URL input | https://aaravkrishnan.dev/portfolio/max-coverage-long-url-segment-for-wra… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Executive profile (1/1 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 9 | `summary` | textarea | Principal platform architect with 14+ years designing resilient, observab… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Professional experience (37/38 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 10 | `experience[0].role` | text input | Principal Platform Architect | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 11 | `experience[0].company` | text input | Northstar Financial Technologies | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 12 | `experience[0].location` | text input | Chennai, India (Hybrid) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 13 | `experience[0].employmentType` | text input | Full-time | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 14 | `experience[0].summary` | textarea | Own the reliability and platform strategy for a payments platform process… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 15 | `experience[0].duration` | start/end date | Jan 2021 – Present | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 16 | `experience[0].bullets[0]` | list (one per line) | Designed and led a zero-downtime migration of 180 microservices from sing… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 17 | `experience[0].bullets[1]` | list (one per line) | Introduced SLO-driven operations across 12 product teams, cutting p99 che… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 18 | `experience[0].bullets[2]` | list (one per line) | Built a platform engineering group of 18 engineers across four squads, de… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 19 | `experience[0].bullets[3]` | list (one per line) | Implemented OpenTelemetry tracing end to end, replacing three overlapping… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 20 | `experience[0].bullets[4]` | list (one per line) | Led chaos-engineering programme covering payment authorisation, settlemen… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 21 | `experience[0].bullets[5]` | list (one per line) | Partnered with security to achieve SOC 2 Type II and PCI-DSS 4.0 readines… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 22 | `experience[0].bullets[6]` | list (one per line) | Rebuilt disaster-recovery runbooks and ran quarterly game days with execu… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 23 | `experience[0].bullets[7]` | list (one per line) | Introduced progressive delivery with Argo Rollouts and automated canary a… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 24 | `experience[0].bullets[8]` | list (one per line) | Drove a FinOps programme that right-sized 1,900 workloads, purchased savi… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 25 | `experience[0].bullets[9]` | list (one per line) | Authored the platform's technical vision and three-year roadmap, secured … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 26 | `experience[0].bullets[10]` | list (one per line) | Special-character stress bullet: R&D budget < $2.5M & rising > 20% — “quo… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 27 | `experience[0].bullets[11]` | list (one per line) | Unicode stress bullet: José Müller from Zürich said “naïve façade” — 東京 t… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 28 | `experience[1].role` | text input | Senior Site Reliability Engineer | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 29 | `experience[1].company` | text input | Helix Health Systems | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 30 | `experience[1].location` | text input | Bengaluru, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 31 | `experience[1].employmentType` | text input | Full-time | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 32 | `experience[1].summary` | textarea | Operated regulated clinical workloads with 99.99% availability targets an… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 33 | `experience[1].duration` | start/end date | Mar 2016 – Dec 2020 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 34 | `experience[1].bullets[0]` | list (one per line) | Automated infrastructure provisioning with Terraform modules and policy-a… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 35 | `experience[1].bullets[1]` | list (one per line) | Led the incident-response rotation and blameless postmortem programme, cu… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 36 | `experience[1].bullets[2]` | list (one per line) | Migrated 60 TB of PostgreSQL data to a partitioned, read-replica topology… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 37 | `experience[1].bullets[3]` | list (one per line) | Introduced load testing and capacity models that predicted Black Friday t… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 38 | `experience[1].bullets[4]` | list (one per line) | Mentored eight engineers on production readiness reviews and on-call best… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 39 | `experience[2].role` | text input | Software Engineer II | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 40 | `experience[2].company` | text input | Meridian Logistics | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 41 | `experience[2].location` | text input | Coimbatore, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 42 | `experience[2].employmentType` | text input | Contract | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 43 | `experience[2].summary` | textarea | *(intentionally empty)* | n/a | n/a | n/a | n/a |
| 44 | `experience[2].duration` | start/end date | Jul 2012 – Feb 2016 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 45 | `experience[2].bullets[0]` | list (one per line) | Built route-optimisation services in Go that reduced average delivery dis… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 46 | `experience[2].bullets[1]` | list (one per line) | Replaced a brittle cron-based ETL pipeline with Kafka Streams, cutting re… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 47 | `experience[2].bullets[2]` | list (one per line) | Wrote the first automated integration test suite for the dispatch API, ra… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Selected projects (25/27 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 48 | `projects[0].name` | text input | Orbit — Multi-Region Service Mesh Control Plane | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 49 | `projects[0].role` | text input | Creator & Maintainer | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 50 | `projects[0].techStack` | text input | Go, Kubernetes, Envoy, gRPC, OpenTelemetry, Terraform | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 51 | `projects[0].description` | textarea | An opinionated control plane that configures Envoy sidecars, mTLS, retrie… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 52 | `projects[0].link` | URL input | https://orbit-mesh.dev/docs/getting-started/installation/kubernetes/multi… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 53 | `projects[0].github` | URL input | https://github.com/aaravkrishnan-qa-max-coverage/orbit-multi-region-servi… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 54 | `projects[0].highlights[0]` | list (one per line) | Handles 120,000 requests per second per region with sub-millisecond added… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 55 | `projects[0].highlights[1]` | list (one per line) | Automates certificate rotation, circuit breaking, and retry budgets with … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 56 | `projects[0].highlights[2]` | list (one per line) | Ships a local development mode that reproduces multi-region topology on a… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 57 | `projects[0].highlights[3]` | list (one per line) | Includes a compatibility test suite covering 14 Kubernetes versions and t… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 58 | `projects[0].highlights[4]` | list (one per line) | Project highlight with a very long unbroken URL token to test wrapping: h… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 59 | `projects[0].highlights[5]` | list (one per line) | Unicode highlight: 東京・大阪 deployment validated with مهندس and emoji 🛰️ ✅ … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 60 | `projects[1].name` | text input | Ledger Lens | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 61 | `projects[1].role` | text input | Technical Lead | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 62 | `projects[1].techStack` | text input | React, TypeScript, PostgreSQL, Python | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 63 | `projects[1].description` | textarea | A reconciliation dashboard that explains every cent of variance between p… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 64 | `projects[1].link` | URL input | https://ledgerlens.example.com | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 65 | `projects[1].github` | URL input | https://github.com/aaravkrishnan-qa-max-coverage/ledger-lens | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 66 | `projects[1].highlights[0]` | list (one per line) | Reduced manual reconciliation effort from 26 analyst-hours per week to 3. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 67 | `projects[1].highlights[1]` | list (one per line) | Processes 9 million ledger entries per day with incremental materialised … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 68 | `projects[1].highlights[2]` | list (one per line) | Zero-downtime schema migrations using expand/contract patterns. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 69 | `projects[2].name` | text input | Quiet Hours | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 70 | `projects[2].role` | text input | Contributor | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 71 | `projects[2].techStack` | text input | Rust, SQLite | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 72 | `projects[2].description` | textarea | A small CLI that schedules noisy background jobs outside business hours u… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 73 | `projects[2].link` | URL input | *(intentionally empty)* | n/a | n/a | n/a | n/a |
| 74 | `projects[2].github` | URL input | *(intentionally empty)* | n/a | n/a | n/a | n/a |

### Education & training (16/18 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 75 | `education[0].institution` | text input | Indian Institute of Technology Madras | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 76 | `education[0].degree` | text input | Master of Technology | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 77 | `education[0].field` | text input | Computer Science and Engineering | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 78 | `education[0].grade` | text input | 9.1 / 10 CGPA | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 79 | `education[0].details` | textarea | Thesis: Adaptive Load Shedding for Multi-Tenant Payment APIs. Teaching as… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 80 | `education[0].year` | start/end date | 2010 – 2012 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 81 | `education[1].institution` | text input | PSG College of Technology | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 82 | `education[1].degree` | text input | Bachelor of Engineering | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 83 | `education[1].field` | text input | Information Technology | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 84 | `education[1].grade` | text input | 8.7 / 10 CGPA | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 85 | `education[1].details` | textarea | Graduated first class with distinction. Led the ACM student chapter and o… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 86 | `education[1].year` | start/end date | 2006 – 2010 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 87 | `education[2].institution` | text input | National Institute of Technology, Tiruchirappalli | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 88 | `education[2].degree` | text input | Certificate Programme | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 89 | `education[2].field` | text input | Cloud Architecture | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 90 | `education[2].grade` | text input | *(intentionally empty)* | n/a | n/a | n/a | n/a |
| 91 | `education[2].details` | textarea | *(intentionally empty)* | n/a | n/a | n/a | n/a |
| 92 | `education[2].year` | start/end date | 2018 – 2018 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Certifications & credentials (11/12 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 93 | `certifications[0].name` | text input | Certified Kubernetes Administrator (CKA) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 94 | `certifications[0].issuer` | text input | Cloud Native Computing Foundation | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 95 | `certifications[0].year` | text input | 2023 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 96 | `certifications[0].credentialUrl` | URL input | https://www.credly.com/badges/11111111-2222-3333-4444-555555555555/public… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 97 | `certifications[1].name` | text input | AWS Certified Solutions Architect — Professional | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 98 | `certifications[1].issuer` | text input | Amazon Web Services | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 99 | `certifications[1].year` | text input | 2022 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 100 | `certifications[1].credentialUrl` | URL input | https://aws.amazon.com/verification | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 101 | `certifications[2].name` | text input | HashiCorp Certified: Terraform Associate | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 102 | `certifications[2].issuer` | text input | HashiCorp | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 103 | `certifications[2].year` | text input | 2021 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 104 | `certifications[2].credentialUrl` | URL input | *(intentionally empty)* | n/a | n/a | n/a | n/a |

### Technical skills (12/12 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 105 | `skills[0]` | list (one per line) | Kubernetes & Helm | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 106 | `skills[1]` | list (one per line) | Terraform & OpenTofu | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 107 | `skills[2]` | list (one per line) | AWS / GCP / Azure | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 108 | `skills[3]` | list (one per line) | Go, Rust & Python | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 109 | `skills[4]` | list (one per line) | Distributed systems design | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 110 | `skills[5]` | list (one per line) | Observability (OpenTelemetry, Prometheus, Grafana) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 111 | `skills[6]` | list (one per line) | PostgreSQL & Kafka | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 112 | `skills[7]` | list (one per line) | CI/CD (GitHub Actions, Argo CD) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 113 | `skills[8]` | list (one per line) | Security & compliance (SOC 2, HIPAA) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 114 | `skills[9]` | list (one per line) | Incident command & chaos engineering | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 115 | `skills[10]` | list (one per line) | Cost optimisation (FinOps) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 116 | `skills[11]` | list (one per line) | Technical mentoring & platform strategy | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Awards & achievements (6/6 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 117 | `achievements[0]` | list (one per line) | Reduced company-wide cloud spend by 31% ($1.8M annualised) while improvin… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 118 | `achievements[1]` | list (one per line) | Winner, National Reliability Engineering Challenge 2022 — built an automa… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 119 | `achievements[2]` | list (one per line) | Speaker at KubeCon India 2023: “SLOs That Product Teams Actually Use”. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 120 | `achievements[3]` | list (one per line) | Patent pending: “Adaptive Request Throttling for Multi-Tenant Payment Pro… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 121 | `achievements[4]` | list (one per line) | Published internal engineering handbook on incident command, adopted by 1… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 122 | `achievements[5]` | list (one per line) | Achievement with special characters: raised NPS from 41 to 68 & cut churn… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Languages (5/5 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 123 | `languages[0]` | list (one per line) | English (Native / Bilingual) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 124 | `languages[1]` | list (one per line) | Tamil (Native) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 125 | `languages[2]` | list (one per line) | Hindi (Professional working proficiency) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 126 | `languages[3]` | list (one per line) | French (Limited working proficiency — DELF B1) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 127 | `languages[4]` | list (one per line) | Japanese (Elementary — JLPT N5) | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Interests (addable standard) (1/1 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 128 | `interests.text` | textarea | Long-distance cycling (completed the 1,200 km Paris–Brest–Paris randonnée… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Honours (addable standard) (3/3 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 129 | `awards.items[0]` | list (one per line) | Northstar Financial Technologies CEO Award for Operational Excellence, 20… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 130 | `awards.items[1]` | list (one per line) | Helix Health Systems Engineering Impact Award, 2019. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 131 | `awards.items[2]` | list (one per line) | IIT Madras Institute Merit Scholarship, 2010–2012. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### References (addable standard) (11/11 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 132 | `references.entries[0].title` | repeater: title | Priya Venkatesan | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 133 | `references.entries[0].subtitle` | repeater: subtitle | VP Engineering, Northstar Financial Technologies | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 134 | `references.entries[0].date` | repeater: date | 2021 – Present | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 135 | `references.entries[0].location` | repeater: location | Chennai, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 136 | `references.entries[0].bullets[0]` | repeater: list | Direct manager for four years; can speak to platform strategy, team build… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 137 | `references.entries[0].bullets[1]` | repeater: list | Contact: priya.venkatesan@example.com · +91 90000 11111 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 138 | `references.entries[1].title` | repeater: title | Daniel Okafor | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 139 | `references.entries[1].subtitle` | repeater: subtitle | Director of Site Reliability, Helix Health Systems | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 140 | `references.entries[1].date` | repeater: date | 2016 – 2020 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 141 | `references.entries[1].location` | repeater: location | Bengaluru, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 142 | `references.entries[1].bullets[0]` | repeater: list | Managed the SRE organisation during the HIPAA expansion; can discuss regu… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Volunteering (addable standard) (6/6 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 143 | `volunteer.entries[0].title` | repeater: title | Volunteer Mentor | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 144 | `volunteer.entries[0].subtitle` | repeater: subtitle | Pragati Foundation — first-generation engineering students | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 145 | `volunteer.entries[0].date` | repeater: date | 2019 – Present | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 146 | `volunteer.entries[0].location` | repeater: location | Remote / Chennai | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 147 | `volunteer.entries[0].bullets[0]` | repeater: list | Mentor six students per year on interview preparation, systems fundamenta… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 148 | `volunteer.entries[0].bullets[1]` | repeater: list | Ran a 12-week distributed-systems reading group with 40 participants. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Publications & talks (addable standard) (9/9 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 149 | `publications.entries[0].title` | repeater: title | SLOs That Product Teams Actually Use | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 150 | `publications.entries[0].subtitle` | repeater: subtitle | KubeCon India 2023 — conference talk and accompanying article | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 151 | `publications.entries[0].date` | repeater: date | 2023 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 152 | `publications.entries[0].location` | repeater: location | Hyderabad, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 153 | `publications.entries[0].bullets[0]` | repeater: list | Presented a practical framework for translating user journeys into error … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 154 | `publications.entries[1].title` | repeater: title | Adaptive Load Shedding for Multi-Tenant Payment APIs | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 155 | `publications.entries[1].subtitle` | repeater: subtitle | M.Tech thesis, IIT Madras | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 156 | `publications.entries[1].date` | repeater: date | 2012 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 157 | `publications.entries[1].location` | repeater: location | Chennai, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Custom section: Technical Toolkit (grid) (24/24 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 158 | `custom-grid.columns[0].label` | grid editor label | Cloud | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 159 | `custom-grid.columns[0].items[0]` | grid editor item | AWS | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 160 | `custom-grid.columns[0].items[1]` | grid editor item | GCP | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 161 | `custom-grid.columns[0].items[2]` | grid editor item | Azure | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 162 | `custom-grid.columns[1].label` | grid editor label | Languages | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 163 | `custom-grid.columns[1].items[0]` | grid editor item | Go | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 164 | `custom-grid.columns[1].items[1]` | grid editor item | Rust | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 165 | `custom-grid.columns[1].items[2]` | grid editor item | Python | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 166 | `custom-grid.columns[1].items[3]` | grid editor item | TypeScript | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 167 | `custom-grid.columns[2].label` | grid editor label | Data | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 168 | `custom-grid.columns[2].items[0]` | grid editor item | PostgreSQL | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 169 | `custom-grid.columns[2].items[1]` | grid editor item | Kafka | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 170 | `custom-grid.columns[2].items[2]` | grid editor item | Redis | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 171 | `custom-grid.columns[2].items[3]` | grid editor item | ClickHouse | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 172 | `custom-grid.columns[3].label` | grid editor label | Observability | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 173 | `custom-grid.columns[3].items[0]` | grid editor item | OpenTelemetry | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 174 | `custom-grid.columns[3].items[1]` | grid editor item | Prometheus | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 175 | `custom-grid.columns[3].items[2]` | grid editor item | Grafana | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 176 | `custom-grid.columns[3].items[3]` | grid editor item | Loki | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 177 | `custom-grid.columns[4].label` | grid editor label | Practices | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 178 | `custom-grid.columns[4].items[0]` | grid editor item | SRE | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 179 | `custom-grid.columns[4].items[1]` | grid editor item | FinOps | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 180 | `custom-grid.columns[4].items[2]` | grid editor item | Chaos engineering | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 181 | `custom-grid.columns[4].items[3]` | grid editor item | Platform strategy | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Custom section: Teaching & Advisory (entries) (11/11 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 182 | `custom-entries.entries[0].title` | repeater: title | Visiting Lecturer — Distributed Systems | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 183 | `custom-entries.entries[0].subtitle` | repeater: subtitle | IIT Madras, Department of Computer Science | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 184 | `custom-entries.entries[0].date` | repeater: date | 2022 – 2024 | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 185 | `custom-entries.entries[0].location` | repeater: location | Chennai, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 186 | `custom-entries.entries[0].bullets[0]` | repeater: list | Designed and taught a 14-week elective on operating distributed systems i… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 187 | `custom-entries.entries[0].bullets[1]` | repeater: list | Rated 4.8 / 5 across two cohorts of 90 students; introduced a live incide… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 188 | `custom-entries.entries[1].title` | repeater: title | Advisory Board Member | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 189 | `custom-entries.entries[1].subtitle` | repeater: subtitle | Chennai Open Source Collective | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 190 | `custom-entries.entries[1].date` | repeater: date | 2021 – Present | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 191 | `custom-entries.entries[1].location` | repeater: location | Chennai, India | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 192 | `custom-entries.entries[1].bullets[0]` | repeater: list | Advise on community governance, sponsorship, and technical programme desi… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Custom section: Community Involvement (bullets) (3/3 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 193 | `custom-bullets.items[0]` | list (one per line) | Organiser of the Chennai Reliability Meetup, a monthly gathering of 120+ … | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 194 | `custom-bullets.items[1]` | list (one per line) | Reviewed 40+ conference talk proposals for KubeCon and PyCon India. | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |
| 195 | `custom-bullets.items[2]` | list (one per line) | Maintainer of two open-source observability utilities with a combined 3,4… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

### Custom section: Career Philosophy (text) (1/1 populated)

| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 196 | `custom-text.text` | textarea | I believe reliability is a product feature, not a tax. The best platforms… | ✓ 20/20 | ✓ 22/22 | ✓ | ✓ |

## Defects found and fixed

| ID | Severity | Symptom (reproducible) | Root cause | Minimal fix | Evidence after fix |
| --- | --- | --- | --- | --- | --- |
| B1 | High | Academic template dropped project descriptions; several templates dropped secondary fields (project role/tech stack, education details, certification issuer) that were present in the editor and preview data. | Template section switches rendered only a hand-picked subset of each record, so fields added to the data model were silently ignored. | Centralised text extraction and block renderers in `templates/shared.jsx` (`ensure`, `isText`, `textOf`, `labelOf`, `educationTitle`, `BulletList`, `CertItem`, `CustomContent`) and routed all 20 templates through them. | SSR 190/190 fields in 20/20 templates; PDF 190/190 in 22/22; DOCX/TXT 213/213. |
| B2 | High | Certification credential URL was absent from DOCX and TXT (and one template), even though it is editable and present in the preview. | `certLine` joined only name/issuer/year; the template cert component had no URL branch. | `ExportService.certLine` appends `credentialUrl`; `CertItem` renders it when non-empty. | DOCX/TXT 213/213 including `certifications[*].credentialUrl`; PDF URL text present. |
| B3 | High | Custom sections in grid/entries/bullets mode rendered empty in several templates; addable standard sections (Interests, Honours, References, Volunteering, Publications) disappeared entirely in templates whose switch had no branch. | No shared renderer for the four content modes; unknown section keys fell through the `switch` default, which some templates implemented as a no-op. | `CustomContent` handles text, bullets, grid and entries with light/dark tones; the custom branch and the `default` branch (used by addable standard sections) both route through it, so every key renders and custom/addable sections appear exactly once in the main column. | SSR fields and 17/17 headings in all templates; PDF 17/17 headings in 22/22; DOCX/TXT 17/17 headings. |
| B4 | High | In two-column templates (`clean`, `designer`, `engineering`, `leadership`, `traditional`) long URLs and wide content pushed the main column past the page edge; text was clipped in the PDF. | Flex children default to `min-width: auto`, so a long unbreakable token forced the column wider than its container. | Added `min-w-0` to the main flex columns. | Glyph-box geometry check: 0 glyphs outside the page box in all 22 PDFs. |
| B5 | Medium | Section headings stranded alone at the bottom of a preview/PDF page (orphans), most visibly Certifications, Interests and Career Philosophy. | Pagination measured block boundaries from element boxes and could cut immediately after a heading; CSS `break-after: avoid` is not honoured by the JS paginator. Contemporary also put the break rule on the card root instead of the heading. | Generic heading-binding rule in `previewPagination.js`: if the last block packed on a page is heading-like, pull the boundary to its top; Contemporary heading div now carries `break-inside-avoid break-after-avoid`. | 0 orphan headings across 22 PDFs; page counts match preview expectations. |
| B6 | Medium | Custom/addable sections appeared twice in two-column templates (once per column). | Both columns iterated the full `sectionsConfig`. | Custom/addable sections render only in the main column; the side column handles its own key set. | 0 duplicate headings in 22 PDFs (uppercase-shape heading matcher ignores body values equal to a label). |
| B7 | High | Academic PDF export aborted with `Protocol error: Connection closed` instead of returning a PDF. | Academic’s heading fallback path closed the annotated page, then the shared error path closed it again. | `annotatedPageClosed` guard in `src/pdf/renderPdfHandler.jsx`; rebuilt `api/render-pdf.js`. | Academic exports 4 pages and passes all field/heading checks. |
| B8 | Low | A renamed section still printed a hardcoded heading in some templates (heading/body label mismatch). | Fixed heading strings instead of the configured section label. | `labelOf(sec, fallback)` is used for every heading, so rename flows through preview and export. | Section lifecycle test: renamed custom and standard headings present, old labels absent, in both single- and two-column templates. |
| B9 | Medium | DOCX/TXT could emit a section heading for an entries/grid custom section with no printable text, creating an orphan heading. | Heading emitted before checking whether the mode produced any content. | `hasCustomEntryContent` gates `docxCustomSection`/`txtCustomSection`; text-mode and grid/entries handled without orphan headings. | DOCX 213/213, Word-rendered PDF 0 orphan headings; TXT 213/213. |

Severity counts: **5 High, 3 Medium, 1 Low, 0 open.** No unreproducible defect was “fixed”; every item above has an automated check that failed before the change and passes after it.

## Preview, PDF and DOCX/TXT parity checks

- **No dropped or duplicated fields:** 190/190 values present in 22/22 PDFs, 190/190 in DOCX and TXT; 0 duplicate section headings.
- **No placeholders or broken text:** `[object Object]`, `undefined`, `NaN`, `Lorem ipsum` and `Your Name` are checked as absent in DOCX/TXT (5 guards each) and in every PDF; none found.
- **Correct section order:** PDF heading positions match `sectionsConfig` order (column-grouped where a template genuinely has two columns); DOCX/TXT `sectionOrder` assertion passes.
- **Alignment and wrapping:** long URLs and long unbroken tokens wrap inside their column; date/location rows stay on the same line where intended and wrap below on narrow columns; bullet markers align with the first text line; glyph geometry reports 0 out-of-page text runs in all 22 PDFs.
- **Consistent headings/dividers/spacing:** every template renders each heading exactly once; heading text matches the configured label; no section renders a divider without a heading or vice versa.
- **Pagination:** no page ends on a heading; no last-page blank; no cut-off content (pagination packs whole blocks and only splits blocks taller than a page); page counts match the preview paginator (`clean` 3 pages; `executive` and the Times New Roman Modern variant 5; Courier New Academic 7; all other templates 4).
- **DOCX reflow:** Word paginates the same content into 5 pages (vs 4 in the PDF) because Word’s line breaking and paragraph spacing differ; headings, order, content and last-page fill all pass, and there is no blank or orphan page. This engine difference is expected and recorded below.

## Font checks (two templates, longest content)

| Variant | Template | Pages | Embedded fonts (from PDF) | Field/heading result |
| --- | --- | ---: | --- | --- |
| Default | Modern | 4 | Inter Regular/Medium/SemiBold/Bold, Segoe UI, Microsoft YaHei | 190/190 fields, 17/17 headings |
| Times New Roman | Modern | 5 | TimesNewRomanPSMT + bold/italic, Microsoft YaHei | 190/190 fields, 17/17 headings |
| Default | Academic | 4 | Georgia, Cambria Math, Segoe UI | 190/190 fields, 17/17 headings |
| Courier New | Academic | 7 | CourierNewPSMT + bold, Microsoft YaHei | 190/190 fields, 17/17 headings |

Fonts were checked on the longest dataset, not a short sample: changing to Times New Roman moves Modern to 5 pages, while Courier New (wider monospace) grows Academic to 7 pages — an intentional stress case that still passes pagination, orphan and clipping checks.

## Typography: +0.5px font-size step

All 20 templates now ship text one +0.5px step above their original design sizes (for example 10.5px body → 11px, 9.5px meta → 10px); Academic’s inline pt sizes use `calc(<N>pt + 0.5px)`. Only `font-size` values changed — horizontal padding, margins, gaps and the stored typography scale are untouched, so left/right spacing remains equal. The larger text moved `executive` and the Times New Roman Modern variant from 4 to 5 pages; every template still passes field, heading, order, orphan and clipping checks. Academic’s plain-`div` section titles are now collected as pagination blocks so the larger text cannot strand a title at a page bottom.

## Section lifecycle (add / rename / reorder / hide / delete)

`qa-artifacts/qa-sections.cjs` drives the same component tree with a mutated `sectionsConfig`/`customSections` and asserts rendered text. **9/9 cases pass** on one single-column (`ModernProTemplate`) and one two-column (`CleanTemplate`) template:

1. Hiding a custom and a standard section removes heading and body; other custom sections still render.
2. Deleting a custom and a standard section does not crash and removes both entirely.
3. Renaming custom and standard sections shows the new heading and removes the old one.
4. Reordering puts Projects before Experience and Career Philosophy before Technical Toolkit.
5. A newly added custom section with bullets renders its heading and both items exactly once.

## Limitations

1. **Preview parity is proven structurally, not by a second browser session.** The live preview and the PDF both render the same template components through the same `transformResume` and `previewPagination`; the preview evidence is a server render of those components. A real browser was used for the PDFs. This avoids claiming a manual typing session that was not performed.
2. **PDF text extraction is lossy in known ways.** CSS letter-spacing makes `pdf.js` emit `E X E C U T I V E`; Arabic glyphs are reordered; punctuation and emoji may be re-encoded. The audit normalises only these cases (no-space match, alphanumeric fallback for long values, Latin-segment order, uppercase-shape heading preference with title-case fallback for Academic), never dropping a field from the check.
3. **DOCX pagination differs from PDF by design.** Word renders 5 pages against the PDF’s 4. Content, headings, order, last-page fill and orphan checks all pass; exact page-for-page equality across engines is not a meaningful target.
4. **Emoji do not survive Word→PDF extraction.** They are present in `word/document.xml` (rocket, check mark, chart, Arabic and CJK all verified) and in the TXT; the Word PDF extractor drops emoji glyphs, so PDF text checks do not include them.
5. **Screenshots are for human review.** PNGs under `qa-artifacts/pdf-audit/screens/` were rasterized with `pdf.js` + `@napi-rs/canvas`; the automated clipping proof is glyph bounding-box geometry, not pixel diffing.
6. **Two-column templates have column-grouped reading order.** DOM order is not visual order; the audit validates order per column and requires custom/addable sections exactly once in the main column.
7. **Editor inputs were enumerated from source and driven through the shared state model.** Every control (`useResumeEditor.jsx`, `CustomSectionEditor.jsx`, `SectionsManager.jsx`) maps to a matrix row, but the run did not type every character through a browser form.
8. **Both trees were handed over with uncommitted work.** This audit preserves the earlier patch changes and adds the files below. The audit changes and the previously unpushed backend commit were then committed to `master` and pushed to `origin`. Frontend scratch files (`_*.pdf`, `_*.png`, `src.zip`) and generated QA bundles under `qa-artifacts/.build/` were deliberately left untracked and were not published.

## Files changed

Frontend (`resumeforge-frontend-master`):

- `src/components/resume/templates/shared.jsx` — **new**: shared text/custom-section renderers.
- `src/components/resume/templates/*.jsx` — all 20 templates (ModernPro, Classic, MinimalATS, Executive, Fresher, CreativeATS, Corporate, Traditional, Clean, Graduate, Tech, Engineering, Leadership, Designer, Sleek, Contemporary, Academic, Research, Medical, Finance): field coverage, addable/custom sections, `min-w-0` column fixes, break rules, and a +0.5px font-size step (spacing unchanged).
- `src/utils/previewPagination.js` — generic heading binding and heading-like block collection (no orphan headings, including Academic’s plain-`div` titles).
- `src/pdf/renderPdfHandler.jsx` — Academic double-close guard.
- `api/render-pdf.js`, `api/_pagination.text.js`, `api/_pdf-compiled.css` — regenerated bundles.
- `eslint.config.js` — exclude `qa-artifacts/**` (Node QA harnesses, not app source).
- `qa-artifacts/**` — dataset, render/PDF/DOCX/screenshot harnesses and reports (new).

Backend (`resumeforge-backend-master`):

- `src/main/java/com/resumeforge/ai/service/ExportService.java` — certification URL, grid/entries custom sections, no orphan headings, entry-content gate.
- `src/test/java/com/resumeforge/ai/service/ExportDocumentHarnessTest.java` — **new**: 213-check DOCX/TXT harness.
- `src/test/resources/qa/resume-max-coverage.json` — **new**: backend copy of the dataset.
- `qa-artifacts/export-audit/**` — generated DOCX, TXT, Word-rendered PDF and JSON reports (new).

## Artifacts

Frontend:

| Artifact | What it proves |
| --- | --- |
| `qa-artifacts/resume-max-coverage.json` | Input dataset: 196 controls, 190 populated values. |
| `qa-artifacts/render-audit/report.json` | 20 templates, 190/190 fields, 0 order failures, 0 broken text. |
| `qa-artifacts/render-audit/sections-lifecycle.json` | 9/9 add/rename/reorder/hide/delete cases. |
| `qa-artifacts/pdf-audit/report.json` | Per-PDF export metadata (pages, bytes, timing, embedded fonts). |
| `qa-artifacts/pdf-audit/audit-report.json` | 22/22 PDFs pass: fields, headings, order, orphans, duplicates, clipping, blank pages. |
| `qa-artifacts/pdf-audit/*.pdf` | Exported PDFs including `font-times-modern.pdf` and `font-courier-academic.pdf`. |
| `qa-artifacts/pdf-audit/screens/*.png` | Rasterized pages for visual review (modern p1/p4, clean, leadership, traditional, academic, both font variants). |
| `qa-artifacts/pdf-audit/docx-word.pdf`, `qa-artifacts/pdf-audit/docx-audit.json` | Word-rendered DOCX pagination report (5 pages, 17/17 headings, no orphan/blank). |

Backend:

| Artifact | What it proves |
| --- | --- |
| `qa-artifacts/export-audit/report-docx.json` | 213/213 DOCX checks. |
| `qa-artifacts/export-audit/report-txt.json` | 213/213 TXT checks. |
| `qa-artifacts/export-audit/resume-max-coverage.docx` | Real DOCX (9,480 bytes). |
| `qa-artifacts/export-audit/resume-max-coverage.txt` | Real TXT (13,309 bytes, 172 lines). |
| `qa-artifacts/export-audit/resume-max-coverage-docx.pdf` | Word 16.0 rendering of the DOCX (5 pages, 1,627 words). |

## Reproduce

Frontend (from the frontend root):

    npm.cmd install
    node qa-artifacts/build-render.mjs && node qa-artifacts/qa-render.cjs
    node qa-artifacts/qa-sections.cjs
    npm.cmd run build:api
    node qa-artifacts/qa-pdf.cjs
    node qa-artifacts/qa-pdf-audit.cjs
    node qa-artifacts/qa-screens.cjs
    npm.cmd run lint && npm.cmd run build

Backend (from the backend root):

    mvn -B test

Word pagination check (PowerShell, Word installed):

    $w = New-Object -ComObject Word.Application; $w.Visible = $false
    $d = $w.Documents.Open("<path>\qa-artifacts\export-audit\resume-max-coverage.docx", $false, $true)
    $d.ComputeStatistics(2)   # pages (5)
    $d.ComputeStatistics(0)   # words (1627)
    $d.SaveAs([ref]"<path>\qa-artifacts\export-audit\resume-max-coverage-docx.pdf", [ref]17)
    $d.Close($false); $w.Quit()

Then, from the frontend root (the audit script lives in the frontend QA folder):

    node qa-artifacts/qa-docx-audit.cjs qa-artifacts/pdf-audit/docx-word.pdf

## Final state

| Gate | Result |
| --- | --- |
| Preview SSR audit | 20/20 templates, 190/190 fields, 0 order failures |
| Real PDF audit | 22/22 PDFs, 190/190 fields, 17/17 headings, 0 orphans, 0 clipped, 0 blank last pages |
| DOCX | 213/213 checks; Word 5 pages, 17/17 headings, 0 orphan/blank |
| TXT | 213/213 checks, 172 lines |
| Section lifecycle | 9/9 cases |
| Frontend lint | pass (`eslint . --max-warnings 0`) |
| Frontend build | pass |
| Backend tests | 48 tests, 0 failures |

No reproducible defect remains open. The audit changes are committed to `master` in both repositories and pushed to `origin`.
