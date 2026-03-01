# ⚡ Durgarao Telagareddi — Salesforce Experience Cloud Portfolio

> A fully custom-built public portfolio website powered by **Salesforce Experience Cloud**, built with Lightning Web Components (LWC), Agentforce AI, and Apex — featuring interactive games, a skills showcase, an AI-powered chat assistant, and a suite of developer productivity tools.

[![Salesforce](https://img.shields.io/badge/Salesforce-Experience%20Cloud-00A1E0?logo=salesforce&logoColor=white)](https://www.salesforce.com)
[![LWC](https://img.shields.io/badge/LWC-API%2059.0-0070D2?logo=salesforce&logoColor=white)](https://developer.salesforce.com/docs/component-library)
[![Apex](https://img.shields.io/badge/Apex-Salesforce-032D60)](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/)
[![Agentforce](https://img.shields.io/badge/Agentforce-AI%20Agent-9B59B6)](https://www.salesforce.com/agentforce/)
[![Components](https://img.shields.io/badge/Components-16%20LWC-FFD700)](https://developer.salesforce.com/docs/component-library)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Global Prerequisites](#-global-prerequisites)
- [Global Dependencies](#-global-dependencies)
- [Repository Structure](#-repository-structure)
- [Components](#-components)
  - [1. portfolioHero](#1-portfoliohero)
  - [2. portfolioProjects](#2-portfolioprojects)
  - [3. portfolioGames](#3-portfoliogames)
  - [4. portfolioSkillsCerts](#4-portfolioskillscerts)
  - [5. memoryMatch](#5-memorymatch)
  - [6. soqlSnake](#6-soqlsnake)
  - [7. sfQuiz](#7-sfquiz)
  - [8. trailheadTrivia](#8-trailheadtrivia)
  - [9. submitRequest](#9-submitrequest)
  - [10. portfolioAgentWidget](#10-portfolioagentwidget)
  - [11. portfolioAchievements](#11-portfolioachievements)
  - [12. devToolsHub](#12-devtoolshub)
  - [13. soqlBuilder](#13-soqlbuilder)
  - [14. apexLimitsChecker](#14-apexlimitschecker)
  - [15. jsonToApex](#15-jsontoapex)
  - [16. learningHub](#16-learninghub)
- [Deployment Guide](#-deployment-guide)
- [Static Resources Setup](#-static-resources-setup)
- [Custom Metadata Setup](#-custom-metadata-setup)
- [Guest User & Public Access](#-guest-user--public-access)
- [CSP Trusted Sites](#-csp-trusted-sites)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🌐 Project Overview

This portfolio is built entirely on the **Salesforce platform** — no external hosting, no WordPress, no third-party CMS. Every page, game, form, animation, and developer tool is a native Salesforce Lightning Web Component deployed to an Experience Cloud public site.

**16 LWC components · 4 Apex controllers · 4 Custom Metadata types · 1 Custom Object · 0 external servers**

| Feature | Component | Type |
|---|---|---|
| Hero section with profile & summary | `portfolioHero` | LWC |
| Projects showcase | `portfolioProjects` | LWC + Wire |
| Skills & Certifications tabs | `portfolioSkillsCerts` | LWC + Custom Metadata |
| Memory Match game | `memoryMatch` | LWC Canvas Game |
| SOQL Snake game | `soqlSnake` | LWC Canvas Game |
| Salesforce Quiz | `sfQuiz` | LWC Game |
| Trailhead Trivia | `trailheadTrivia` | LWC Game |
| Games landing page | `portfolioGames` | LWC |
| Submit a Request form | `submitRequest` | LWC + Apex |
| Agentforce AI chat widget | `portfolioAgentWidget` | LWC + Messaging for Web |
| Achievements & Recognition | `portfolioAchievements` | LWC + Custom Metadata |
| Developer Tools Hub | `devToolsHub` | LWC (parent container) |
| SOQL Query Builder | `soqlBuilder` | LWC (child tool) |
| Governor Limits Checker | `apexLimitsChecker` | LWC (child tool) |
| JSON → Apex Generator | `jsonToApex` | LWC (child tool) |
| Learning Materials Hub | `learningHub` | LWC + Apex + Custom Metadata |

---

## 🏗 Architecture

```
Experience Cloud (Public Site)
│
├── Experience Builder Pages
│   ├── Home           → portfolioHero + portfolioSkillsCerts
│   ├── Projects       → portfolioProjects
│   ├── Games          → portfolioGames → memoryMatch, soqlSnake, sfQuiz, trailheadTrivia
│   ├── Achievements   → portfolioAchievements
│   ├── Dev Tools      → devToolsHub → soqlBuilder, apexLimitsChecker, jsonToApex
│   ├── Learning Hub   → learningHub
│   └── Contact        → submitRequest
│
├── Global (Theme Layout — appears on all pages)
│   └── portfolioAgentWidget
│
├── Apex Controllers
│   ├── PortfolioSkillsController        ← queries Portfolio_Skill__mdt + Portfolio_Certification__mdt
│   ├── SubmitRequestController          ← inserts Portfolio_Request__c records
│   ├── PortfolioAchievementsController  ← queries Portfolio_Achievement__mdt
│   └── LearningHubController            ← queries Learning_Material__mdt
│
├── Custom Metadata Types
│   ├── Portfolio_Skill__mdt
│   ├── Portfolio_Certification__mdt
│   ├── Portfolio_Achievement__mdt
│   └── Learning_Material__mdt           ← stores all learning resources
│
├── Custom Object
│   └── Portfolio_Request__c
│
└── Static Resources
    ├── durgarao_image   (profile photo — Cache Control: Public)
    └── Durgarao_Resume  (PDF resume   — Cache Control: Public)
```

---

## ✅ Global Prerequisites

### Salesforce Org Requirements
- Salesforce org with **Experience Cloud** enabled (Developer Edition or above)
- **Digital Experiences** feature activated: Setup → Digital Experiences → Settings → Enable
- **Salesforce CLI (`sf`)** installed: https://developer.salesforce.com/tools/salesforcecli
- **VS Code** with the **Salesforce Extension Pack** installed

### Local Machine Requirements
- Node.js 18+
- Git 2.x+

### Authenticate to your org
```bash
sf org login web --alias portfolio-org
sf config set target-org portfolio-org
```

---

## 📦 Global Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| Salesforce CLI | 2.x+ | Deploy & retrieve metadata |
| LWC API | 59.0 | All components use `lwc:if` — not the deprecated `if:true` |
| Apex API | 59.0 | All Apex controllers |
| Experience Cloud | Winter '24+ | Public site hosting |
| Agentforce | Spring '25+ | AI agent (component 10 only) |

**Google Fonts used across all components:**

| Component(s) | Fonts |
|---|---|
| portfolioHero, submitRequest | `Syne`, `DM Sans` |
| sfQuiz | `Exo 2`, `DM Sans` |
| trailheadTrivia | `Nunito`, `Fira Code` |
| memoryMatch | `Orbitron`, `Rajdhani` |
| soqlSnake | `Orbitron`, `Share Tech Mono` |
| portfolioAchievements | `Playfair Display`, `Jost` |
| soqlBuilder | `Fira Code`, `IBM Plex Sans` |
| apexLimitsChecker | `Rajdhani`, `Share Tech Mono`, `IBM Plex Sans` |
| jsonToApex | `JetBrains Mono`, `Outfit` |
| learningHub | `Cormorant Garamond`, `Plus Jakarta Sans`, `Space Mono` |
| devToolsHub | `Syne`, `Manrope` |

> All fonts load via `@import` in each component's CSS. Add `https://fonts.googleapis.com` and `https://fonts.gstatic.com` to CSP Trusted Sites.

---

## 📁 Repository Structure

```
force-app/
└── main/
    └── default/
        ├── lwc/
        │   ├── portfolioHero/
        │   │   ├── portfolioHero.html
        │   │   ├── portfolioHero.js
        │   │   ├── portfolioHero.css
        │   │   └── portfolioHero.js-meta.xml
        │   ├── portfolioProjects/
        │   ├── portfolioGames/
        │   ├── portfolioSkillsCerts/
        │   ├── memoryMatch/
        │   ├── soqlSnake/
        │   ├── sfQuiz/
        │   ├── trailheadTrivia/
        │   ├── submitRequest/
        │   ├── portfolioAgentWidget/
        │   ├── portfolioAchievements/
        │   ├── soqlBuilder/            ← deploy BEFORE devToolsHub
        │   ├── apexLimitsChecker/      ← deploy BEFORE devToolsHub
        │   ├── jsonToApex/             ← deploy BEFORE devToolsHub
        │   ├── devToolsHub/            ← deploy LAST among dev tools
        │   └── learningHub/
        │
        ├── classes/
        │   ├── PortfolioSkillsController.cls
        │   ├── PortfolioSkillsController.cls-meta.xml
        │   ├── SubmitRequestController.cls
        │   ├── SubmitRequestController.cls-meta.xml
        │   ├── PortfolioAchievementsController.cls
        │   ├── PortfolioAchievementsController.cls-meta.xml
        │   ├── LearningHubController.cls
        │   └── LearningHubController.cls-meta.xml
        │
        ├── customMetadata/
        │   ├── Portfolio_Skill__mdt.*.md-meta.xml
        │   ├── Portfolio_Certification__mdt.*.md-meta.xml
        │   ├── Portfolio_Achievement__mdt.*.md-meta.xml
        │   └── Learning_Material__mdt.*.md-meta.xml
        │
        └── objects/
            └── Portfolio_Request__c/
                ├── Portfolio_Request__c.object-meta.xml
                └── fields/
```

> Each LWC folder contains 4 files: `.html`, `.js`, `.css`, `.js-meta.xml`

---

## 🧩 Components

---

### 1. `portfolioHero`

**Purpose:** Full-width hero section. Displays profile photo, animated name typewriter, job title, location, profile summary, stat counters, and CTA buttons.

#### Prerequisites
- Static Resources uploaded (Cache Control = **Public**):
  - `durgarao_image` — profile photo
  - `Durgarao_Resume` — resume PDF

#### Dependencies
- No Apex required
- Google Fonts: `Syne`, `DM Sans`

#### Configurable Properties (Experience Builder)

| Property | Type | Default |
|---|---|---|
| `profileName` | String | Durgarao Telagareddi |
| `profileTitle` | String | Senior Salesforce Developer |
| `yearsExp` | Integer | 6 |
| `location` | String | Hyderabad, India |
| `email` | String | tmdurgarao@gmail.com |
| `profileSummary` | String | (long text) |

#### Manual Steps
1. Upload both Static Resources (Cache Control: **Public**)
2. Deploy the component
3. Drag onto the Home page in Experience Builder and fill in properties

---

### 2. `portfolioProjects`

**Purpose:** Showcases Salesforce projects as data-driven cards.

#### Prerequisites
- Project data stored in Custom Metadata or Custom Object
- Apex controller wired to the component

#### Manual Steps
1. Create data source with fields: Name, Client, Tech Stack, Description, Image URL
2. Deploy the component and add to the Projects page

---

### 3. `portfolioGames`

**Purpose:** Landing page for the Games Lab. Shows game cards linking to individual game components.

#### Prerequisites
- All 4 game components deployed first

#### Manual Steps
1. Deploy `memoryMatch`, `soqlSnake`, `sfQuiz`, `trailheadTrivia`
2. Deploy `portfolioGames` and add to the Games page

---

### 4. `portfolioSkillsCerts`

**Purpose:** Two-tab component. **Skills** tab shows filterable cards with animated progress bars from `Portfolio_Skill__mdt`. **Certifications** tab shows cert cards with official Salesforce logo images and verify links.

#### Prerequisites
- Custom Metadata Types: `Portfolio_Skill__mdt` and `Portfolio_Certification__mdt`
- Apex class `PortfolioSkillsController` deployed
- Guest User has Apex class access
- CSP Trusted Site for `https://trailhead.salesforce.com`

#### Custom Metadata: `Portfolio_Skill__mdt`
| Field API Name | Type | Example |
|---|---|---|
| `Skill_Name__c` | Text(255) | Apex |
| `Category__c` | Text(100) | Languages |
| `Proficiency__c` | Text(50) | Expert |
| `Proficiency_Percent__c` | Number(3,0) | 95 |
| `Icon_Emoji__c` | Text(10) | ⚡ |
| `Category_Color__c` | Text(10) | #FF6B6B |
| `Sort_Order__c` | Number(3,0) | 1 |

#### Custom Metadata: `Portfolio_Certification__mdt`
| Field API Name | Type | Example |
|---|---|---|
| `Cert_Name__c` | Text(255) | Salesforce Certified Administrator |
| `Issuer__c` | Text(100) | Salesforce |
| `Credential_ID__c` | Text(100) | 22893898 |
| `Issue_Date__c` | Text(50) | Jan 2022 |
| `Logo_URL__c` | URL | https://trailhead.salesforce.com/... |
| `Badge_Color__c` | Text(10) | #00A1E0 |
| `Cert_URL__c` | URL | https://trailhead.salesforce.com/credentials/... |
| `Sort_Order__c` | Number(3,0) | 1 |

#### Official Salesforce Cert Logo URLs
```
Admin:          https://trailhead.salesforce.com/assets/certification-site/images/certifications/administrator.png
Developer I:    https://trailhead.salesforce.com/assets/certification-site/images/certifications/platform_developer_i.png
Data Cloud:     https://trailhead.salesforce.com/assets/certification-site/images/certifications/data_cloud_consultant.png
App Builder:    https://trailhead.salesforce.com/assets/certification-site/images/certifications/platform_app_builder.png
AI Associate:   https://trailhead.salesforce.com/assets/certification-site/images/certifications/ai_associate.png
AI Specialist:  https://trailhead.salesforce.com/assets/certification-site/images/certifications/ai_specialist.png
```

#### Manual Steps
1. Create both Custom Metadata Types with all fields
2. Add records via Manage Records
3. Deploy `PortfolioSkillsController.cls`
4. Grant Guest User Profile Apex Class access
5. Add `https://trailhead.salesforce.com` to CSP Trusted Sites
6. Deploy the LWC and add to the Home page

---

### 5. `memoryMatch`

**Purpose:** Playable 3D memory card matching game with a Salesforce cloud theme, move counter, timer, star rating, and confetti win screen.

#### Prerequisites
- No Apex, no metadata required — fully self-contained

#### Dependencies
- Google Fonts: `Orbitron`, `Rajdhani`

#### How it works
- 12 Salesforce-themed card pairs (Sales Cloud, Service Cloud, Apex, LWC, etc.)
- CSS `rotateY(180deg)` + `preserve-3d` for true 3D flip
- Difficulty: Easy (4×3) or Hard (4×4)
- Confetti burst on win screen

#### Manual Steps
1. Deploy (4 files) and add to the Games page

---

### 6. `soqlSnake`

**Purpose:** Canvas-based snake game. Eat SOQL keyword tokens in order to build valid SOQL queries. Speed increases per level.

#### Prerequisites
- No Apex required; uses `lwc:ref` — requires **LWC API 59.0+**

#### Dependencies
- Google Fonts: `Orbitron`, `Share Tech Mono`
- Browser Canvas 2D API

#### Controls
| Input | Action |
|---|---|
| Arrow keys / WASD | Move |
| P or Escape | Pause / Resume |
| On-screen D-Pad | Mobile touch |

#### Manual Steps
1. Deploy and add to the Games page

---

### 7. `sfQuiz`

**Purpose:** Timed multiple-choice quiz. 4 Salesforce categories, 3 difficulty levels, SVG countdown timer ring, badge rewards.

#### Prerequisites
- No Apex required — 32 questions hardcoded in JS

#### Dependencies
- Google Fonts: `Exo 2`, `DM Sans`

#### Categories
| Category | Questions |
|---|---|
| 🛡️ Admin | 8 |
| ⚡ Apex | 8 |
| ⚙️ LWC | 8 |
| 🔗 Integration | 8 |

#### Difficulty
| Level | Timer | Points |
|---|---|---|
| Easy | 30s | 10 pts |
| Medium | 20s | 20 pts |
| Hard | 15s | 30 pts |

#### Manual Steps
1. Deploy and add to the Games page

---

### 8. `trailheadTrivia`

**Purpose:** Trailhead-style trail trivia game with XP progression, badge collection, streak bonuses, hints, and 5 rank tiers.

#### Prerequisites
- No Apex required — 24 questions across 4 trails hardcoded in JS

#### Dependencies
- Google Fonts: `Nunito`, `Fira Code`

#### Trails
| Trail | Level | Questions |
|---|---|---|
| 🛡️ Admin Basics | Beginner | 6 |
| ⚡ Apex Hero | Intermediate | 6 |
| 🤖 AI Pioneer | Advanced | 6 |
| 📊 Data Ranger | Intermediate | 6 |

#### XP & Ranks
| Rank | XP |
|---|---|
| Trailblazer Novice | 0–499 |
| Explorer | 500–999 |
| Ranger | 1,000–1,999 |
| Trail Boss | 2,000–3,499 |
| Legend | 3,500+ |

#### Manual Steps
1. Deploy and add to the Games page

---

### 9. `submitRequest`

**Purpose:** Floating "Submit a Request" button that opens a premium dark modal form. Saves to `Portfolio_Request__c` and plays a full-screen rocket launch animation on success.

#### Prerequisites
- Custom Object `Portfolio_Request__c` created
- Apex class `SubmitRequestController` deployed
- Guest User has Create on `Portfolio_Request__c` + Apex class access

#### Custom Object: `Portfolio_Request__c`
| Field Label | API Name | Type |
|---|---|---|
| Request Type | `Request_Type__c` | Picklist: Recruitment, Career Help, Referral, Other |
| Email | `Email__c` | Email |
| Comment | `Comment__c` | Long Text Area (32768) |
| Status | `Status__c` | Picklist: New, In Review, Closed |
| Submitted Date | `Submitted_Date__c` | Date |

#### Rocket Animation Sequence
1. Modal closes → full-screen overlay fades in (94% opacity, 12px blur)
2. 12 confetti dots burst outward with staggered delays
3. 3 expanding ring pulses radiate from centre
4. 🚀 emoji orbits 400° with a glowing exhaust trail
5. "Request Sent! 🎉" message appears at centre
6. Overlay fades out at ~2.4s, DOM removed at 3s

#### Manual Steps
1. Create `Portfolio_Request__c` with all fields
2. Deploy `SubmitRequestController.cls`
3. Grant Guest User permissions
4. Deploy LWC and add to Contact page

---

### 10. `portfolioAgentWidget`

**Purpose:** Custom floating AI chat button (FAB) wrapping Salesforce Messaging for Web (Agentforce). Provides branded styling, welcome tooltip, unread badge, and clean open/close toggle.

#### Prerequisites
- Agentforce agent created and active in Setup → Agent Studio
- Messaging for Web Channel created and linked to the agent
- JS deployment snippet added to Experience Builder Head Markup
- All Salesforce chat CSP Trusted Sites added

#### Configurable Properties
| Property | Type | Default |
|---|---|---|
| `agentName` | String | Ask Durgarao's AI |
| `welcomeHint` | String | Ask me about Durgarao's projects & skills! |
| `showOnMobile` | Boolean | true |

#### How the FAB Works
- Polls every 500ms until `embeddedservice_bootstrap` is available in `window`
- At 3s: auto-shows tooltip with welcome hint
- Click: calls `embeddedservice_bootstrap.utilAPI.launchChat()` or `closeChat()`
- Listens to `onEmbeddedMessagingWindowOpened/Closed` events for state sync
- Unread badge increments on `onEmbeddedMessagingNewMessageReceived` when minimised
- Default Salesforce chat bubble is hidden via CSS injection

#### Manual Steps
1. Create Messaging for Web Channel and link to Agentforce agent
2. Copy JS snippet → Experience Builder → Head Markup
3. Add all 5 Salesforce chat CSP Trusted Sites
4. Deploy component and add to **Theme Layout** (appears on every page)
5. Publish the site

---

### 11. `portfolioAchievements`

**Purpose:** Full-page "Hall of Fame" showcasing Awards, Certifications, and Goodies driven by `Portfolio_Achievement__mdt`. Features live category filter tabs, featured spotlight cards, cert mosaic grid, and goodies grid. Zero code changes needed to add new entries.

#### Aesthetic
Luxury Trophy Cabinet — `Playfair Display` + `Jost` on deep midnight navy, burnished gold accents, grain texture overlay.

#### Prerequisites
- Custom Metadata Type `Portfolio_Achievement__mdt` created
- Apex class `PortfolioAchievementsController` deployed
- Guest User has Apex class access

#### Custom Metadata Type: `Portfolio_Achievement__mdt`

| Field Label | API Name | Type | Required | Notes |
|---|---|---|---|---|
| Title | `Title__c` | Text(255) | ✅ | Display name |
| Issuer | `Issuer__c` | Text(255) | ✅ | e.g. "Salesforce" |
| Year | `Year__c` | Text(10) | ✅ | e.g. "2024" |
| Description | `Description__c` | Long Text(32768) | — | Card detail |
| Category | `Category__c` | Picklist | ✅ | `Award` \| `Certificate` \| `Goodie` |
| Icon Emoji | `Icon_Emoji__c` | Text(10) | — | e.g. `🏆`, `🎓`, `🎁` |
| Badge Color | `Badge_Color__c` | Text(10) | — | Hex e.g. `#FFD700` |
| Is Featured | `Is_Featured__c` | Checkbox | — | Large spotlight card in Awards |
| Is Active | `Is_Active__c` | Checkbox | ✅ | `false` = hidden |
| Detail URL | `Detail_URL__c` | URL | — | "Verify ↗" link |
| Sort Order | `Sort_Order__c` | Number(3,0) | — | Display order |

#### Pre-loaded Award Records
| Title | Issuer | Year | Icon | Color | Featured |
|---|---|---|---|---|---|
| Winner of Salesforce Developer Program | Salesforce | 2021 | 🏆 | `#FFD700` | ✅ |
| Q2 SPOT Award | Verticurl | 2022 | ⭐ | `#00A1E0` | ✅ |
| Transformer of the Month Award | Verticurl | 2024 | 🚀 | `#9B59B6` | ✅ |

#### How to Add a New Achievement (Zero Code)
1. Setup → Custom Metadata Types → Portfolio Achievement → Manage Records → **New**
2. Fill in Title, Issuer, Year, Category, Icon, Color
3. Set `Is_Active__c = true`, save — auto-appears on next page load

#### Manual Steps
1. Create `Portfolio_Achievement__mdt` with all 11 fields
2. Add `Category__c` picklist values: `Award`, `Certificate`, `Goodie`
3. Insert records via Manage Records
4. Deploy `PortfolioAchievementsController.cls`
5. Grant Guest User Apex class access
6. Deploy LWC, create Achievements page, drag component, publish

---

### 12. `devToolsHub`

**Purpose:** Parent container that hosts all three developer tools in a single polished interface. Renders a **Holographic Command Centre** with animated plasma orbs, glassmorphism navigation cards, and smooth tool-switching animations.

#### Aesthetic
Deep space navy with drifting plasma orbs (cyan, magenta, amber), `Syne` display font, `Manrope` body text. Each nav card has a per-tool animated gradient border.

#### Prerequisites
- **`soqlBuilder`, `apexLimitsChecker`, and `jsonToApex` must be deployed first**
- No Apex, no Custom Metadata required

#### Dependencies
| Dependency | How Used |
|---|---|
| `soqlBuilder` LWC | Embedded as `<c-soql-builder>` |
| `apexLimitsChecker` LWC | Embedded as `<c-apex-limits-checker>` |
| `jsonToApex` LWC | Embedded as `<c-json-to-apex>` |
| Google Fonts: `Syne`, `Manrope` | Typography |

#### Navigation Behaviour
- Three cards rendered from a static `TOOLS` array in `devToolsHub.js`
- Add a 4th tool: add one object to `TOOLS` and deploy the child component
- Only the active tool is in the DOM (`lwc:if` mounts/unmounts panels)
- Entry animation: `translateY(14px) scale(0.99)` → normal on tool switch

#### Manual Steps
1. Deploy `soqlBuilder`, `apexLimitsChecker`, `jsonToApex`
2. Deploy `devToolsHub`
3. Create a **Developer Tools** page in Experience Builder
4. Drag `devToolsHub` onto the page and publish

---

### 13. `soqlBuilder`

**Purpose:** Interactive visual SOQL query constructor. Pick an object, toggle fields, add WHERE conditions, configure ORDER BY/LIMIT/OFFSET — live syntax-highlighted output with one-click copy.

#### Aesthetic
Hacker Terminal IDE — pitch black `#0D1117`, neon cyan `#00FFD4`, `Fira Code` monospace, macOS window chrome dots, scanline overlay.

#### Prerequisites
- No Apex, no Custom Metadata — fully self-contained

#### Dependencies
- Google Fonts: `Fira Code`, `IBM Plex Sans`
- Browser Clipboard API

#### Supported Objects (10)
Account · Contact · Opportunity · Lead · Case · Task · User · Campaign · Product2 · Order

#### WHERE Operators
`=` · `!=` · `<` · `<=` · `>` · `>=` · `LIKE` · `IN` · `NOT IN`

#### Quick Patterns
| Pattern | Object | Pre-built Condition |
|---|---|---|
| 🕐 Last 7 Days | Account | `CreatedDate > LAST_N_DAYS:7` |
| 💰 Open Opportunities | Opportunity | `IsClosed = false` |
| 🎯 Active Leads | Lead | `IsConverted = false` |
| 📋 Open Cases | Case | `IsClosed = false` |
| ✅ My Tasks | Task | `Status != 'Completed'` |

#### Manual Steps
1. Deploy (4 files)
2. Use standalone on any page, or nested inside `devToolsHub`

---

### 14. `apexLimitsChecker`

**Purpose:** Real-time Governor Limits monitoring dashboard. Enter current usage per limit — get instant colour-coded health bars, CRITICAL alerts, system health strip, and a 15-row reference table.

#### Aesthetic
Mission Control Dashboard — amber `#FFB300` on midnight navy `#080C14`, dot-grid, `Rajdhani` display font, `Share Tech Mono` for numbers. Critical cards pulse with a red blink.

#### Prerequisites
- No Apex, no Custom Metadata — fully self-contained

#### Dependencies
- Google Fonts: `Rajdhani`, `Share Tech Mono`, `IBM Plex Sans`

#### Tracked Limits

| Limit | Sync | Async |
|---|---|---|
| SOQL Queries | 100 | 200 |
| SOQL Rows Retrieved | 50,000 | 50,000 |
| DML Statements | 150 | 150 |
| DML Rows Processed | 10,000 | 10,000 |
| CPU Time | 10,000 ms | 60,000 ms |
| Heap Size | 6 MB | 12 MB |
| Callouts | 100 | 100 |
| Email Invocations | 10 | 10 |

#### Colour Thresholds
| Usage | Status | Colour |
|---|---|---|
| 0–79% | OK | 🟢 Green |
| 80–89% | WARNING | 🟠 Amber |
| 90–100% | CRITICAL | 🔴 Red — card blinks |

#### Key Features
- Sync / Async toggle — limits update instantly
- System Health strip — aggregate safe-percentage across all limits
- 80% threshold tick marker on every progress bar
- Best-practice tip per card
- 15-row collapsible reference table
- Reset button

#### Manual Steps
1. Deploy (4 files)
2. Use standalone or nested inside `devToolsHub`

---

### 15. `jsonToApex`

**Purpose:** Cyberpunk split-editor that converts any valid JSON object to a production-ready Apex class — with inner classes, `List<T>` generics, `@JsonAccess` annotation, and `parse()` / `toJson()` methods.

#### Aesthetic
Cyberpunk Split Editor — deep violet/black `#0A0B14`, magenta `#FF2D78`, `JetBrains Mono` code font, `Outfit` UI font, animated gradient border cycling magenta→cyan→violet.

#### Prerequisites
- No Apex, no Custom Metadata — pure client-side

#### Dependencies
- Google Fonts: `JetBrains Mono`, `Outfit`
- Browser Clipboard API

#### Type Mapping
| JSON Type | Apex Type |
|---|---|
| `"string"` | `String` |
| `123` (whole) | `Integer` |
| `1.5` (decimal) | `Decimal` |
| `true` / `false` | `Boolean` |
| `null` | `Object` |
| `{ }` object | Inner class (PascalCase from key) |
| `[{ }]` array of objects | `List<InnerClassItem>` + inner class |
| `["a","b"]` string array | `List<String>` |
| `[1,2]` number array | `List<Integer>` or `List<Decimal>` |

#### Generated Apex Structure
```apex
@JsonAccess(serializable='always' deserializable='always')
public with sharing class AccountWrapper {

    public String id;
    public Decimal annualRevenue;
    public Boolean isActive;
    public Address address;              // inner class
    public List<ContactsItem> contacts;  // list + inner class
    public List<String> tags;

    public static AccountWrapper parse(String jsonStr) {
        return (AccountWrapper) JSON.deserialize(jsonStr, AccountWrapper.class);
    }

    public String toJson() {
        return JSON.serialize(this);
    }

    public class Address { ... }
    public class ContactsItem { ... }
}
```

#### Key Features
- Live line numbers on both panes
- Real-time JSON validation with inline error message
- Configurable class name (auto-sanitised)
- Toggles: `@JsonAccess` annotation, `with sharing` / `without sharing`
- Load Sample — realistic multi-nested JSON (Account + Address + Contacts array)
- Full Apex syntax highlighting
- Copy with 2-second confirmation state
- Type mapping legend

#### Manual Steps
1. Deploy (4 files)
2. Use standalone or nested inside `devToolsHub`

---

### 16. `learningHub`

**Purpose:** A full-featured Learning Materials Hub that stores, categorises, and serves downloadable learning resources — guides, cheat sheets, interview prep, implementation docs, and more. Visitors can search, filter by category, sort, and download any resource directly. All data is managed via a `Learning_Material__mdt` Custom Metadata Type — no code changes needed to add new materials.

#### Aesthetic
**Stellar Archive** — deepest navy `#04060F` background with two concentric pulsing rings and a dot-grid overlay, creating a deep-space observatory atmosphere. `Cormorant Garamond` italic serif for the gradient hero title, `Plus Jakarta Sans` for all UI text, `Space Mono` for file metadata chips and monospace data. Each of the 10 categories has its own accent colour; the category colour drives the card top border, icon background tint, badge chip, and download button. This gives the page a lively, colour-coded "library shelf" feel while staying cohesive on the dark canvas.

#### Prerequisites
- Custom Metadata Type `Learning_Material__mdt` must be created (see field table below)
- Apex class `LearningHubController` must be deployed
- Guest User Profile must have **Apex Class Access** to `LearningHubController`
- No Static Resources required

> **Self-contained fallback:** The component ships with 30 pre-loaded static materials hardcoded in JS (`STATIC_MATERIALS` array). If the Apex wire call fails or the CMT has no records yet, the static data renders immediately — the component is fully usable out of the box without any Salesforce setup.

#### Dependencies
| Dependency | Purpose |
|---|---|
| `LearningHubController.cls` | Queries `Learning_Material__mdt` records via `@wire` |
| `Learning_Material__mdt` | Stores all learning resource metadata |
| Google Fonts: `Cormorant Garamond`, `Plus Jakarta Sans`, `Space Mono` | Stellar Archive typography |
| Browser Clipboard / `<a href target="_blank">` | Download links |

#### Custom Metadata Type: `Learning_Material__mdt`

| Field Label | API Name | Type | Required | Notes |
|---|---|---|---|---|
| Title | `Title__c` | Text(255) | ✅ | Display title of the resource |
| Description | `Description__c` | Long Text Area | ✅ | 2–4 sentence description shown on the card |
| Category | `Category__c` | Text(100) | ✅ | Must match a category `id` from the JS CATEGORIES array |
| Icon Emoji | `Icon_Emoji__c` | Text(10) | — | e.g. `📄`, `⚡`, `🔍` |
| Difficulty | `Difficulty__c` | Picklist | — | `Beginner` \| `Intermediate` \| `Advanced` |
| File Type | `File_Type__c` | Picklist | — | `PDF` \| `DOCX` \| `XLSX` \| `PPTX` \| `VIDEO` \| `LINK` \| `MD` |
| File Size | `File_Size__c` | Text(20) | — | e.g. `2.3 MB` |
| File URL | `File_URL__c` | URL | ✅ | Direct download URL or Salesforce File/CRM Content link |
| Tags | `Tags__c` | Text(255) | — | Comma-separated tags e.g. `LWC,Events,Wire` |
| Author | `Author__c` | Text(255) | — | Author name shown in card footer |
| Download Count | `Download_Count__c` | Number(6,0) | — | Cumulative download count displayed on card |
| Is Featured | `Is_Featured__c` | Checkbox | — | `true` = shown in the highlighted featured banner at top |
| Is Active | `Is_Active__c` | Checkbox | ✅ | `false` = hidden from UI without deleting the record |
| Sort Order | `Sort_Order__c` | Number(3,0) | — | Ascending display order within each category |

#### Supported Categories

| Category ID | Display Name | Icon | Accent Colour |
|---|---|---|---|
| `salescloud` | Sales Cloud | 💼 | `#0070D2` |
| `servicecloud` | Service Cloud | 🛎 | `#00A1E0` |
| `lwc` | LWC | ⚡ | `#7B2FFF` |
| `apex` | Apex | 🔷 | `#032D60` |
| `integration` | Integration | 🔗 | `#E8820C` |
| `devops` | DevOps / Git | 🛠 | `#2B9A66` |
| `admin` | Admin | 🛡 | `#C23934` |
| `ai` | AI / Agentforce | 🤖 | `#9B59B6` |
| `datacloud` | Data Cloud | 📊 | `#0D6EFD` |
| `other` | Other Tools | 🔧 | `#6B7280` |

#### Pre-loaded Static Materials (30 resources across all categories)

| # | Title | Category | Type | Difficulty |
|---|---|---|---|---|
| 1 | Sales Cloud Implementation Guide | salescloud | PDF | Intermediate |
| 2 | Sales Cloud Object Model Reference | salescloud | PDF | Beginner |
| 3 | CPQ Configuration Cheat Sheet | salescloud | PDF | Advanced |
| 4 | Service Cloud Complete Setup Guide | servicecloud | PDF | Intermediate |
| 5 | Omni-Channel Routing Deep Dive | servicecloud | DOCX | Advanced |
| 6 | LWC Interview Questions — Top 100 ⭐ | lwc | PDF | Intermediate |
| 7 | LWC Component Communication Guide | lwc | PDF | Intermediate |
| 8 | LWC Performance Optimisation Cookbook | lwc | PDF | Advanced |
| 9 | LWC vs Aura: Migration Guide | lwc | DOCX | Intermediate |
| 10 | Apex Governor Limits Quick Reference | apex | PDF | Beginner |
| 11 | Apex Design Patterns Handbook | apex | PDF | Advanced |
| 12 | Apex Interview Questions — Top 80 ⭐ | apex | PDF | Intermediate |
| 13 | SOQL & SOSL Mastery Guide | apex | PDF | Intermediate |
| 14 | Salesforce REST API Integration Guide | integration | PDF | Intermediate |
| 15 | Platform Events & CDC Guide | integration | PDF | Advanced |
| 16 | MuleSoft + Salesforce Integration Patterns | integration | DOCX | Advanced |
| 17 | Git & GitHub Implementation Guide ⭐ | devops | PDF | Intermediate |
| 18 | Salesforce DX (SFDX) Cheat Sheet | devops | PDF | Beginner |
| 19 | GitHub Actions for Salesforce CI/CD | devops | PDF | Advanced |
| 20 | Salesforce Admin Certification Study Guide | admin | PDF | Beginner |
| 21 | Flow Builder Mastery Guide | admin | PDF | Intermediate |
| 22 | Salesforce Security & Sharing Model Guide | admin | DOCX | Intermediate |
| 23 | Agentforce Implementation Guide ⭐ | ai | PDF | Intermediate |
| 24 | Einstein AI Features Reference | ai | PDF | Beginner |
| 25 | Prompt Engineering for Salesforce AI | ai | PDF | Intermediate |
| 26 | Data Cloud Architecture & Setup Guide | datacloud | PDF | Advanced |
| 27 | Data Cloud Interview Questions | datacloud | PDF | Intermediate |
| 28 | VS Code for Salesforce — Power User Guide | other | PDF | Beginner |
| 29 | Postman for Salesforce API Testing | other | PDF | Beginner |
| 30 | JIRA for Salesforce Project Management | other | DOCX | Beginner |

> ⭐ = `Is_Featured__c = true` — these rotate in the featured banner at the top of the page.

#### UI Features

- **Search** — real-time filtering across title, description, tags, author, and category. Placeholder cycles through sample queries every 3.5 seconds.
- **10 category filter tabs** — sticky at top with scrollable overflow for mobile. Each tab shows a live count badge. The active tab highlights in the category's accent colour.
- **Sort modes** — Default order, A→Z alphabetical, by Category, or by Difficulty (Beginner first).
- **Featured banner** — the first `Is_Featured__c = true` resource in the active filter renders as a large premium banner card above the grid (hidden during search/category filter).
- **Material cards** — category-coloured top border, emoji icon, difficulty badge, description (3-line clamp), comma-separated tag chips, file type badge, file size, author, and colour-matched download button.
- **Download counter** — each card shows cumulative download count as a floating badge. Clicking Download increments the local count.
- **Pagination** — 9 cards per page, "Load more" button reveals the next page of results.
- **Skeleton loader** — animated shimmer placeholders shown while the Apex wire resolves.
- **Empty state** — friendly message with "Clear all filters" button when no results match.
- **Fully responsive** — 3-column grid on desktop → 2-column on tablet → 1-column on mobile.

#### How to Add a New Learning Material (No Code Required)
1. Setup → Custom Metadata Types → **Learning Material** → Manage Records → **New**
2. Fill in: Title, Description, Category (must match a category ID), File URL
3. Set `Is_Active__c = true`
4. Optionally set `Is_Featured__c = true` to show in the featured banner
5. Save — the component picks it up on the next page load

#### Hosting Files on Salesforce (Recommended)
To host the actual downloadable files on Salesforce:
1. **Files / ContentVersion:** Upload the file via Salesforce Files. Get the public download URL:
   `https://[yourorg].my.salesforce.com/sfc/p/[suffix]/a/[recordId]/[hash]`
2. **Static Resources:** For files that don't change, upload as a Static Resource and use `@salesforce/resourceUrl/YourResourceName` in Apex to build the URL. Pass it into `File_URL__c`.
3. **External hosting:** You can also set `File_URL__c` to any external URL (Google Drive, SharePoint, S3 with public access, etc.)

#### Manual Steps
1. Create `Learning_Material__mdt` in Setup with all 14 fields
2. Add `Difficulty__c` picklist values: `Beginner`, `Intermediate`, `Advanced`
3. Add `File_Type__c` picklist values: `PDF`, `DOCX`, `XLSX`, `PPTX`, `VIDEO`, `LINK`, `MD`
4. Insert records via Manage Records (or skip — the static JS data renders immediately)
5. Deploy `LearningHubController.cls`
6. Grant Guest User Profile Apex Class access to `LearningHubController`
7. Deploy the LWC component (4 files)
8. Create a **Learning Hub** page in Experience Builder
9. Drag `learningHub` onto the page and publish

---

## 🚀 Deployment Guide

### Deploy All at Once
```bash
sf project deploy start --source-dir force-app/main/default
```

### Deploy a Specific Component
```bash
# LWC component
sf project deploy start --source-dir force-app/main/default/lwc/soqlBuilder

# Apex class
sf project deploy start --source-dir force-app/main/default/classes/PortfolioAchievementsController.cls
```

### Retrieve From Org
```bash
sf project retrieve start --metadata LightningComponentBundle ApexClass CustomObject CustomMetadata
```

### Recommended Deploy Order

```
Step 1 — Apex Classes
   PortfolioSkillsController
   SubmitRequestController
   PortfolioAchievementsController
   LearningHubController

Step 2 — Custom Objects
   Portfolio_Request__c

Step 3 — Custom Metadata Types
   Portfolio_Skill__mdt
   Portfolio_Certification__mdt
   Portfolio_Achievement__mdt
   Learning_Material__mdt

Step 4 — LWC Child Tools  ← must come BEFORE devToolsHub
   soqlBuilder
   apexLimitsChecker
   jsonToApex

Step 5 — All Other LWC Components
   portfolioHero, portfolioProjects, portfolioGames, portfolioSkillsCerts
   memoryMatch, soqlSnake, sfQuiz, trailheadTrivia
   submitRequest, portfolioAgentWidget, portfolioAchievements
   learningHub

Step 6 — LWC Hub  ← must come AFTER its child tools
   devToolsHub

Step 7 — Static Resources (upload via Salesforce UI)
   durgarao_image
   Durgarao_Resume
```

> ⚠️ `devToolsHub` depends on `soqlBuilder`, `apexLimitsChecker`, and `jsonToApex`. Deploying the hub before its children will fail with a missing component reference error.

---

## 🖼 Static Resources Setup

| Resource Name | File Type | Cache Control | Used By |
|---|---|---|---|
| `durgarao_image` | PNG / JPG | **Public** | `portfolioHero` |
| `Durgarao_Resume` | PDF | **Public** | `portfolioHero` |

**Steps:**
1. Setup → Static Resources → **New**
2. Name exactly as above (case-sensitive)
3. Upload file → Cache Control: **Public** → Save

> ⚠️ Cache Control = **Private** will cause a 403 for all guest users.

---

## 🗃 Custom Metadata Setup

### Create `Portfolio_Skill__mdt`
1. Setup → Custom Metadata Types → New
2. Label: `Portfolio Skill` · API Name: `Portfolio_Skill__mdt`
3. Add all 7 fields from the [portfolioSkillsCerts](#4-portfolioskillscerts) table
4. Manage Records → add one record per skill

### Create `Portfolio_Certification__mdt`
1. Setup → Custom Metadata Types → New
2. Label: `Portfolio Certification` · API Name: `Portfolio_Certification__mdt`
3. Add all 8 fields from the [portfolioSkillsCerts](#4-portfolioskillscerts) table
4. Manage Records → add one record per certification

### Create `Portfolio_Achievement__mdt`
1. Setup → Custom Metadata Types → New
2. Label: `Portfolio Achievement` · API Name: `Portfolio_Achievement__mdt`
3. Add all 11 fields from the [portfolioAchievements](#11-portfolioachievements) table
4. Add `Category__c` picklist values: `Award`, `Certificate`, `Goodie` (exact capitalisation)
5. Manage Records → add records, set `Is_Active__c = true` on each

### Create `Learning_Material__mdt`
1. Setup → Custom Metadata Types → New
2. Label: `Learning Material` · Plural: `Learning Materials` · API Name: `Learning_Material__mdt`
3. Add all 14 fields from the [learningHub](#16-learninghub) field table
4. Add `Difficulty__c` picklist values: `Beginner`, `Intermediate`, `Advanced`
5. Add `File_Type__c` picklist values: `PDF`, `DOCX`, `XLSX`, `PPTX`, `VIDEO`, `LINK`, `MD`
6. Manage Records → add your resources (or skip — the component renders static demo data immediately)
7. Set `Is_Active__c = true` on every record to display, `Is_Featured__c = true` for the featured banner

> 💡 Metadata records can also be deployed via CLI using XML files in `force-app/main/default/customMetadata/`.

---

## 👤 Guest User & Public Access

### Find Your Guest Profile
Setup → Digital Experiences → All Sites → **[Your Site]** → Workspaces → Administration → Guest User Profile

### Required Permissions

| Permission | Location | Required For |
|---|---|---|
| Read on `Portfolio_Skill__mdt` | Object Settings | Skills tab |
| Read on `Portfolio_Certification__mdt` | Object Settings | Certs tab |
| Read on `Portfolio_Achievement__mdt` | Object Settings | Achievements |
| Create on `Portfolio_Request__c` | Object Settings | Submit form |
| Apex: `PortfolioSkillsController` | Apex Class Access | Skills/Certs data |
| Apex: `SubmitRequestController` | Apex Class Access | Form submission |
| Apex: `PortfolioAchievementsController` | Apex Class Access | Achievements data |
| Apex: `LearningHubController` | Apex Class Access | Learning materials data |
| Messaging for Web | Connected Apps | Agentforce chat |

---

## 🔒 CSP Trusted Sites

Setup → Security → CSP Trusted Sites → New. Check **all Allow** checkboxes for each.

| Site Name | URL | Required For |
|---|---|---|
| `GoogleFonts_API` | `https://fonts.googleapis.com` | All component fonts |
| `GoogleFonts_Static` | `https://fonts.gstatic.com` | Font files |
| `Trailhead_CDN` | `https://trailhead.salesforce.com` | Cert logo images |
| `SF_Embedded_Chat` | `https://[yourorg].my.salesforce.com` | Agentforce chat |
| `SF_SCRT2` | `https://[yourorg].my.salesforce-scrt.com` | Chat transport |
| `SF_LiveAgent` | `https://[yourorg].salesforce-live-agent.com` | Live agent |
| `SF_CDN_Static` | `https://static.salesforceliveagent.com` | Chat UI assets |

> Replace `[yourorg]` with your org subdomain (visible in Setup → My Domain).

---

## 🐛 Troubleshooting

### Component not showing in Experience Builder
- Confirm `.js-meta.xml` has `<target>lightningCommunity__Default</target>`
- Redeploy and hard-refresh Experience Builder (Ctrl+Shift+R)

### Profile image not loading for guest users
- Check Static Resource Cache Control = **Public**
- Verify `@salesforce/resourceUrl/durgarao_image` matches the resource name exactly

### Skills / Certs showing empty
- Confirm Guest User Profile has Apex Class access to `PortfolioSkillsController`
- Confirm Custom Metadata records exist and are active
- DevTools → Network → look for 401/403 on the Apex wire call

### Achievements section showing empty
- Check `Is_Active__c = true` on records
- Verify `Category__c` values are exactly `Award`, `Certificate`, `Goodie` (case-sensitive)
- Confirm Guest User has Apex Class access to `PortfolioAchievementsController`

### Achievements in wrong section
- Check `Category__c` value on the record — no trailing spaces, exact capitalisation
- Valid: `Award`, `Certificate`, `Goodie` (not `award`, `AWARD`, etc.)

### Dev Tools Hub — child panel blank
- Deploy `soqlBuilder`, `apexLimitsChecker`, `jsonToApex` **before** `devToolsHub`
- Browser Console → look for `Unknown custom element` errors

### SOQL Builder — no query output
- Select both an **object** AND at least **one field** — both required
- ORDER BY dropdown only shows fields already selected in SELECT

### JSON → Apex — no output
- Input must be a valid JSON **object** `{ }` — root-level arrays not supported
- Check the red error message under the input pane
- JSON must use double-quoted keys

### JSON → Apex — inner class missing
- Inner classes only generate for **object values** `{ }` and **arrays of objects** `[{ }]`
- Arrays of primitives correctly produce `List<String>` etc. — no inner class needed

### LWC deploy error: `if:true is not supported`
- Replace `if:true={x}` with `lwc:if={x}`
- Set `<apiVersion>59.0</apiVersion>` in `.js-meta.xml`

### Agentforce chat not appearing
- Confirm JS snippet is in Experience Builder → Head Markup
- Confirm all CSP Trusted Sites are added
- Browser Console → look for `initEmbeddedMessaging` errors

### Submit Request shows error after saving
- Confirm `Portfolio_Request__c` exists with all required fields
- Confirm Guest User has Create permission and `SubmitRequestController` Apex access

### Deploy fails: `Entity of type Metadata is not available`
- Experience Cloud may not be enabled in the target org
- Set `"sourceApiVersion": "59.0"` in `sfdx-project.json`

### Learning Hub — no materials showing (blank grid)
- The component falls back to 30 static materials if Apex fails — if even those are missing, check browser Console for JS errors
- Confirm Guest User Profile has Apex Class access to `LearningHubController`
- Open browser DevTools → Network → look for a 401/403 on the `getMaterials` wire call
- Check `Learning_Material__mdt` records have `Is_Active__c = true`

### Learning Hub — Apex returns data but cards are empty
- Confirm the metadata record `Category__c` field value matches exactly one of the 10 category IDs in the JS `CATEGORIES` array (`salescloud`, `servicecloud`, `lwc`, `apex`, `integration`, `devops`, `admin`, `ai`, `datacloud`, `other`)
- Check `File_URL__c` is a valid URL (including `http://` or `https://`)

### Learning Hub — download button doesn't work
- If `File_URL__c` is set to a Salesforce File URL, confirm the Guest User has access to the ContentDocument record via sharing rules or a public link
- For Static Resources used as file hosts, ensure Cache Control = **Public** on the resource
- For external URLs (Google Drive, S3, etc.), ensure the URL is a direct download link rather than a sharing/preview page

---

## 👨‍💻 Author

**Durgarao Telagareddi**
Senior Salesforce Developer · 6+ Years Experience

[![Email](https://img.shields.io/badge/Email-tmdurgarao%40gmail.com-0070D2?logo=gmail&logoColor=white)](mailto:tmdurgarao@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![Trailhead](https://img.shields.io/badge/Trailhead-Profile-00A1E0?logo=salesforce&logoColor=white)](https://trailhead.salesforce.com/en/me/yourprofile)
[![Location](https://img.shields.io/badge/Location-Hyderabad%2C%20India-27AE60)](https://maps.google.com/?q=Hyderabad,India)

---

*Built with ❤️ on the Salesforce Platform · No external hosting · 100% native Salesforce*