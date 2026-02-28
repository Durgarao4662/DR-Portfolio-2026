# ⚡ Durgarao Telagareddi — Salesforce Experience Cloud Portfolio

> A fully custom-built public portfolio website powered by **Salesforce Experience Cloud**, built with Lightning Web Components (LWC), Agentforce AI, and Apex — featuring interactive games, a skills showcase, and an AI-powered chat assistant.

[![Salesforce](https://img.shields.io/badge/Salesforce-Experience%20Cloud-00A1E0?logo=salesforce&logoColor=white)](https://www.salesforce.com)
[![LWC](https://img.shields.io/badge/LWC-API%2059.0-0070D2?logo=salesforce&logoColor=white)](https://developer.salesforce.com/docs/component-library)
[![Apex](https://img.shields.io/badge/Apex-Salesforce-032D60)](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/)
[![Agentforce](https://img.shields.io/badge/Agentforce-AI%20Agent-9B59B6)](https://www.salesforce.com/agentforce/)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFD700)](LICENSE)

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
- [Deployment Guide](#-deployment-guide)
- [Static Resources Setup](#-static-resources-setup)
- [Custom Metadata Setup](#-custom-metadata-setup)
- [Guest User & Public Access](#-guest-user--public-access)
- [CSP Trusted Sites](#-csp-trusted-sites)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🌐 Project Overview

This portfolio is built entirely on the **Salesforce platform** — no external hosting, no WordPress, no third-party CMS. Every page, game, form, and animation is a native Salesforce Lightning Web Component deployed to an Experience Cloud public site.

**Live features:**
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

---

## 🏗 Architecture

```
Experience Cloud (Public Site)
│
├── Experience Builder Pages
│   ├── Home           → portfolioHero + portfolioSkillsCerts
│   ├── Projects       → portfolioProjects
│   ├── Games          → portfolioGames + memoryMatch + soqlSnake + sfQuiz + trailheadTrivia
│   └── Contact        → submitRequest
│
├── Global (Theme Layout)
│   └── portfolioAgentWidget  ← appears on all pages
│
├── Apex Controllers
│   ├── PortfolioSkillsController   ← reads Custom Metadata
│   └── SubmitRequestController     ← inserts Portfolio_Request__c
│
├── Custom Metadata Types
│   ├── Portfolio_Skill__mdt
│   └── Portfolio_Certification__mdt
│
├── Custom Object
│   └── Portfolio_Request__c
│
└── Static Resources
    ├── durgarao_image   (profile photo)
    └── Durgarao_Resume  (PDF resume)
```

---

## ✅ Global Prerequisites

Before deploying any component, ensure the following are in place.

### Salesforce Org Requirements
- Salesforce org with **Experience Cloud** enabled (Developer Edition or above)
- **Digital Experiences** feature activated: Setup → Digital Experiences → Settings → Enable
- **Salesforce CLI (`sf`)** installed: https://developer.salesforce.com/tools/salesforcecli
- **VS Code** with the **Salesforce Extension Pack** installed

### Local Machine Requirements
- Node.js 18+ (for SFDX tooling)
- Git 2.x+
- A GitHub account with this repository cloned locally

### Check your CLI version
```bash
sf version
# Should show @salesforce/cli/2.x.x or higher
```

### Authenticate VS Code to your org
```bash
sf org login web --alias portfolio-org
sf config set target-org portfolio-org
```

---

## 📦 Global Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| Salesforce CLI | 2.x+ | Deploy & retrieve metadata |
| LWC API | 59.0 | All components use `lwc:if`, no `if:true` |
| Apex API | 59.0 | Apex controllers |
| Google Fonts (CDN) | — | `Syne`, `DM Sans`, `Orbitron`, `Nunito`, `Exo 2` |
| Experience Cloud | Winter '24+ | Public site hosting |
| Agentforce | Spring '25+ | AI agent (component 10 only) |

> **Font note:** All Google Fonts are loaded via `@import` in each component's CSS. Add `https://fonts.googleapis.com` and `https://fonts.gstatic.com` to CSP Trusted Sites.

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
        │   └── portfolioAgentWidget/
        │
        ├── classes/
        │   ├── PortfolioSkillsController.cls
        │   ├── PortfolioSkillsController.cls-meta.xml
        │   ├── SubmitRequestController.cls
        │   └── SubmitRequestController.cls-meta.xml
        │
        ├── customMetadata/
        │   ├── Portfolio_Skill__mdt.*.md-meta.xml
        │   └── Portfolio_Certification__mdt.*.md-meta.xml
        │
        └── objects/
            └── Portfolio_Request__c/
                ├── Portfolio_Request__c.object-meta.xml
                └── fields/
```

---

## 🧩 Components

---

### 1. `portfolioHero`

**Purpose:** Full-width hero section at the top of the portfolio homepage. Displays profile photo, name (typewriter animation), job title, location, profile summary, stat counters, and CTA buttons.

#### Prerequisites
- Two Static Resources uploaded (see [Static Resources Setup](#-static-resources-setup)):
  - `durgarao_image` — profile photo (PNG/JPG, Cache Control = Public)
  - `Durgarao_Resume` — resume PDF (Cache Control = Public)

#### Dependencies
- No Apex controller required
- Google Fonts: `Syne`, `DM Sans`

#### Configurable Properties (Experience Builder)

| Property | Type | Default | Description |
|---|---|---|---|
| `profileName` | String | Durgarao Telagareddi | Full name (typewriter animated) |
| `profileTitle` | String | Senior Salesforce Developer | Subtitle below name |
| `yearsExp` | Integer | 6 | Years shown in gold badge |
| `location` | String | Hyderabad, India | Shown in meta line |
| `email` | String | tmdurgarao@gmail.com | Clickable email link |
| `profileSummary` | String | (long text) | Summary paragraph in glass card |

#### Manual Steps
1. Upload `durgarao_image` as a Static Resource (Setup → Static Resources → New)
2. Upload `Durgarao_Resume` as a Static Resource
3. Deploy the component
4. Drag onto the Home page in Experience Builder
5. Fill in the property panel on the right

#### What it does
- Animated gradient background (blue → navy, infinite loop)
- Floating circular profile image with glow pulse ring
- Typewriter effect writes the name on load
- Glassmorphism summary card with 4 stat counters (XP, Projects, Certs, Clients)
- Gold "Download Resume" button + frosted "View Projects" button

---

### 2. `portfolioProjects`

**Purpose:** Showcases key projects as cards pulled from a Salesforce data source (Custom Metadata or Custom Object).

#### Prerequisites
- Project data stored in `Portfolio_Project__mdt` (Custom Metadata) or a Custom Object
- Apex controller wired to the component

#### Dependencies
- Wire adapter to fetch project records
- Google Fonts: `Syne`, `DM Sans`

#### Manual Steps
1. Create the data source (Custom Metadata or Object) with fields: Project Name, Client, Tech Stack, Description, Image URL
2. Deploy the component
3. Add to the Projects page in Experience Builder

---

### 3. `portfolioGames`

**Purpose:** Landing page for the Games Lab section. Shows game cards linking to individual game components.

#### Prerequisites
- All game components deployed first (`memoryMatch`, `soqlSnake`, `sfQuiz`, `trailheadTrivia`)

#### Dependencies
- None (purely presentational)

#### Manual Steps
1. Deploy all game sub-components first
2. Deploy `portfolioGames`
3. Add to the Games page in Experience Builder

---

### 4. `portfolioSkillsCerts`

**Purpose:** A two-tab component. **Skills tab** shows filterable skill cards with animated progress bars pulled from Custom Metadata. **Certifications tab** shows certification cards with official Salesforce logo images and a verify link.

#### Prerequisites
- Two Custom Metadata Types must be created (see [Custom Metadata Setup](#-custom-metadata-setup)):
  - `Portfolio_Skill__mdt`
  - `Portfolio_Certification__mdt`
- Apex controller deployed: `PortfolioSkillsController`
- Guest User Profile must have Apex class access to `PortfolioSkillsController`
- CSP Trusted Site added for `https://trailhead.salesforce.com` (cert logo images)

#### Dependencies
| Dependency | Why |
|---|---|
| `PortfolioSkillsController.cls` | Queries both Custom Metadata types |
| `Portfolio_Skill__mdt` | Stores skill name, category, proficiency % |
| `Portfolio_Certification__mdt` | Stores cert name, logo URL, credential ID |
| Google Fonts: `Syne`, `DM Sans` | Typography |

#### Custom Metadata: `Portfolio_Skill__mdt`
| Field API Name | Type | Example Value |
|---|---|---|
| `Skill_Name__c` | Text(255) | Apex |
| `Category__c` | Text(100) | Languages |
| `Proficiency__c` | Text(50) | Expert |
| `Proficiency_Percent__c` | Number(3,0) | 95 |
| `Icon_Emoji__c` | Text(10) | ⚡ |
| `Category_Color__c` | Text(10) | #FF6B6B |
| `Sort_Order__c` | Number(3,0) | 1 |

#### Custom Metadata: `Portfolio_Certification__mdt`
| Field API Name | Type | Example Value |
|---|---|---|
| `Cert_Name__c` | Text(255) | Salesforce Certified Administrator |
| `Issuer__c` | Text(100) | Salesforce |
| `Credential_ID__c` | Text(100) | 22893898 |
| `Issue_Date__c` | Text(50) | Jan 2022 |
| `Logo_URL__c` | URL | https://trailhead.salesforce.com/assets/... |
| `Badge_Color__c` | Text(10) | #00A1E0 |
| `Cert_URL__c` | URL | https://trailhead.salesforce.com/credentials/... |
| `Sort_Order__c` | Number(3,0) | 1 |

#### Official Salesforce Cert Logo URLs
```
Admin:        https://trailhead.salesforce.com/assets/certification-site/images/certifications/administrator.png
Developer I:  https://trailhead.salesforce.com/assets/certification-site/images/certifications/platform_developer_i.png
Data Cloud:   https://trailhead.salesforce.com/assets/certification-site/images/certifications/data_cloud_consultant.png
App Builder:  https://trailhead.salesforce.com/assets/certification-site/images/certifications/platform_app_builder.png
AI Associate: https://trailhead.salesforce.com/assets/certification-site/images/certifications/ai_associate.png
AI Specialist:https://trailhead.salesforce.com/assets/certification-site/images/certifications/ai_specialist.png
```

#### Manual Steps
1. Create both Custom Metadata Types in Setup
2. Add all field API names exactly as listed above
3. Insert your data records (Setup → Custom Metadata Types → Manage Records)
4. Deploy `PortfolioSkillsController.cls`
5. Grant Guest User Profile access to the Apex class
6. Add `https://trailhead.salesforce.com` to CSP Trusted Sites
7. Deploy the LWC component
8. Add to the Home or Skills page in Experience Builder

#### How Tabs Work
- Clicking **Skills** sets `activeTab = 'skills'` — only the Skills panel renders via `lwc:if`
- Clicking **Certifications** sets `activeTab = 'certs'` — only the Certs panel renders
- The other panel is completely removed from the DOM (not just hidden)

---

### 5. `memoryMatch`

**Purpose:** A fully playable memory card matching game with a Salesforce cloud theme, 3D flip animations, move counter, timer, and win screen.

#### Prerequisites
- No Apex, no Custom Metadata, no Static Resources required
- Self-contained — all game data is hardcoded in JS

#### Dependencies
- Google Fonts: `Orbitron`, `Rajdhani`
- No external libraries

#### Configurable Options (in-game)
| Option | Values | Default |
|---|---|---|
| Difficulty | Easy (4×3) / Hard (4×4) | Easy |

#### Manual Steps
1. Deploy the component (4 files: html, js, css, xml)
2. Add to the Games page in Experience Builder — no further configuration needed

#### How it works
- 12 Salesforce-themed card pairs (Sales Cloud, Service Cloud, Apex, etc.)
- CSS `rotateY(180deg)` + `preserve-3d` for true 3D flip effect
- Timer starts on first card flip, stops on win
- Star rating based on move efficiency
- Confetti burst on win screen

---

### 6. `soqlSnake`

**Purpose:** A canvas-based snake game where the player eats SOQL keyword tokens in order to build a valid SOQL query. Speed increases per level.

#### Prerequisites
- No Apex, no Custom Metadata required
- Uses `lwc:ref` to access the `<canvas>` element — requires **LWC API 59.0+**

#### Dependencies
- Google Fonts: `Orbitron`, `Share Tech Mono`
- Browser Canvas 2D API (supported in all modern browsers)

#### Manual Steps
1. Deploy the component
2. Add to the Games page in Experience Builder
3. The canvas auto-sizes to 480×480px on desktop, 320×320px on mobile

#### Controls
| Input | Action |
|---|---|
| Arrow keys / WASD | Move snake |
| P or Escape | Pause / Resume |
| D-Pad buttons | Mobile touch controls |

#### SOQL Sequences (built-in)
The snake eats tokens in sequence to complete real SOQL queries:
```sql
SELECT Id FROM Account
SELECT Id,Name FROM Contact WHERE IsActive=true
SELECT COUNT() FROM Opportunity WHERE StageName='Closed Won'
SELECT Id,Name FROM Lead ORDER BY CreatedDate DESC LIMIT 10
```

---

### 7. `sfQuiz`

**Purpose:** A timed multiple-choice quiz with 4 Salesforce categories, 3 difficulty levels, countdown timer ring, answer feedback, and a badge/results system.

#### Prerequisites
- No Apex, no Custom Metadata required
- Self-contained — 32 questions hardcoded in JS

#### Dependencies
- Google Fonts: `Exo 2`, `DM Sans`

#### Categories & Question Count
| Category | Questions | Topics |
|---|---|---|
| 🛡️ Admin | 8 | Sharing, Flows, Reports, Profiles |
| ⚡ Apex | 8 | Governor Limits, Async, SOQL, Annotations |
| ⚙️ LWC | 8 | Decorators, Lifecycle, Directives, Events |
| 🔗 Integration | 8 | REST, Bulk API, Auth Flows, Platform Events |

#### Difficulty Settings
| Level | Timer | Points per Question |
|---|---|---|
| Easy | 30s | 10 pts |
| Medium | 20s | 20 pts |
| Hard | 15s | 30 pts |

> **Score bonus:** Faster answers earn extra points based on remaining time (`timeLeft × 0.5`)

#### Earnable Badges
| Badge | Condition |
|---|---|
| 🎯 Sharp Shooter | Perfect score |
| 🔥 On Fire | Streak of 3+ correct |
| ⚡ Lightning Fast | 80%+ score |
| 🏆 Champion | Perfect score with 5+ questions |
| 💎 Diamond Mind | 90%+ score |

#### Manual Steps
1. Deploy the component
2. Add to the Games page in Experience Builder

---

### 8. `trailheadTrivia`

**Purpose:** A Trailhead-style trail-based trivia game with XP progression, badge collection, streak bonuses, hints, and 5 rank tiers.

#### Prerequisites
- No Apex, no Custom Metadata required
- Self-contained — 24 questions across 4 trails hardcoded in JS

#### Dependencies
- Google Fonts: `Nunito`, `Fira Code`

#### Trails
| Trail | Level | Questions | Badge |
|---|---|---|---|
| 🛡️ Admin Basics | Beginner | 6 | Admin Trailblazer |
| ⚡ Apex Hero | Intermediate | 6 | Apex Champion |
| 🤖 AI Pioneer | Advanced | 6 | AI Trailblazer |
| 📊 Data Ranger | Intermediate | 6 | Data Ranger |

#### XP & Rank System
| Rank | XP Required |
|---|---|
| Trailblazer Novice | 0–499 |
| Explorer | 500–999 |
| Ranger | 1,000–1,999 |
| Trail Boss | 2,000–3,499 |
| Legend | 3,500+ |

**XP Earning Rules:**
- Correct answer: **+50 XP**
- Streak bonus: **+20 XP × (streak − 1)**
- Hint used: **−5 XP**
- Perfect trail: **+100 XP bonus**

#### Manual Steps
1. Deploy the component
2. Add to the Games page in Experience Builder
3. No further setup needed — XP and badges persist in the browser session

---

### 9. `submitRequest`

**Purpose:** A floating "Submit a Request" trigger button that opens a premium dark modal form. On submission, saves a record to `Portfolio_Request__c` and plays a full-screen circular rocket launch animation.

#### Prerequisites
- Custom Object `Portfolio_Request__c` must be created (see below)
- Apex class `SubmitRequestController` must be deployed
- Guest User Profile must have:
  - **Create** permission on `Portfolio_Request__c`
  - **Apex Class Access** to `SubmitRequestController`

#### Dependencies
| Dependency | Purpose |
|---|---|
| `SubmitRequestController.cls` | Inserts the request record |
| `Portfolio_Request__c` | Stores submitted requests |
| Google Fonts: `Syne`, `DM Sans` | Typography |

#### Custom Object: `Portfolio_Request__c`
| Field Label | API Name | Type | Notes |
|---|---|---|---|
| Request Type | `Request_Type__c` | Picklist | Recruitment, Career Help, Referral, Other |
| Email | `Email__c` | Email | |
| Comment | `Comment__c` | Long Text Area (32768) | |
| Status | `Status__c` | Picklist | New, In Review, Closed |
| Submitted Date | `Submitted_Date__c` | Date | Auto-set to today() |

#### Manual Steps
1. Create the `Portfolio_Request__c` custom object with all fields above
2. Deploy `SubmitRequestController.cls`
3. Grant Guest User Profile Create access to `Portfolio_Request__c`
4. Grant Guest User Profile Apex Class access to `SubmitRequestController`
5. Deploy the LWC component (4 files)
6. Add to any page in Experience Builder — the button is `display: inline-block` and works anywhere

#### Rocket Animation Sequence
When Send is clicked and the record saves successfully:
1. Modal closes instantly
2. Full-screen dark overlay appears with blur
3. 12 confetti dots burst outward in random directions
4. 3 expanding ring pulses radiate from centre
5. A 🚀 emoji orbits the centre in a 400° arc with a glowing exhaust flame
6. "Request Sent! 🎉" message pops in at centre
7. Overlay fades out after ~3 seconds

---

### 10. `portfolioAgentWidget`

**Purpose:** A custom floating action button (FAB) that wraps the Salesforce Messaging for Web (Agentforce) chat widget. Provides branded styling, a tooltip, unread message badge, and clean open/close toggle — replacing the default Salesforce chat bubble.

#### Prerequisites
- An **Agentforce agent** already created in Setup → Agent Studio
- A **Messaging for Web Channel** created and linked to the agent (Setup → Messaging for Web)
- The Messaging for Web **JS deployment snippet** added to Experience Builder Head Markup
- All 5 **CSP Trusted Sites** for Salesforce chat domains added (see [CSP Trusted Sites](#-csp-trusted-sites))
- **CORS** allowed origin set for your site URL

#### Dependencies
| Dependency | Required? | Purpose |
|---|---|---|
| Messaging for Web Channel | ✅ Yes | Routes chat to Agentforce |
| JS Snippet in Head Markup | ✅ Yes | Loads `embeddedservice_bootstrap` |
| CSP Trusted Sites | ✅ Yes | Allows browser to load chat scripts |
| Agentforce Agent (active) | ✅ Yes | Responds to visitor messages |

#### Configurable Properties (Experience Builder)
| Property | Type | Default |
|---|---|---|
| `agentName` | String | Ask Durgarao's AI |
| `welcomeHint` | String | Ask me about Durgarao's projects & skills! |
| `showOnMobile` | Boolean | true |

#### Manual Steps
1. Create Messaging for Web Channel in Setup and link to your agent
2. Copy the generated JS snippet
3. Open Experience Builder → Settings (⚙) → Advanced → Edit Head Markup → paste snippet
4. Add all 5 CSP Trusted Sites (see section below)
5. Deploy `portfolioAgentWidget` component
6. Add to **Theme Layout** in Experience Builder (so it appears on every page automatically)
7. Publish the site

#### How the FAB Works
- On load: polls every 500ms until `embeddedservice_bootstrap` is available
- At 3s: auto-shows a tooltip with the welcome hint
- Click: calls `embeddedservice_bootstrap.utilAPI.launchChat()` or `closeChat()`
- Listens to `onEmbeddedMessagingWindowOpened/Closed` events to sync the icon state
- Unread badge increments on `onEmbeddedMessagingNewMessageReceived` when chat is closed
- The default Salesforce chat button is hidden via CSS

---

## 🚀 Deployment Guide

### Deploy All Components at Once
```bash
# Authenticate (first time only)
sf org login web --alias portfolio-org

# Set default org
sf config set target-org portfolio-org

# Deploy everything
sf project deploy start --source-dir force-app/main/default

# Check status
sf project deploy report
```

### Deploy a Specific Component
```bash
# Single LWC
sf project deploy start --source-dir force-app/main/default/lwc/portfolioHero

# Single Apex class
sf project deploy start --source-dir force-app/main/default/classes/SubmitRequestController.cls

# All LWCs only
sf project deploy start --source-dir force-app/main/default/lwc
```

### Retrieve Latest From Org
```bash
sf project retrieve start --metadata LightningComponentBundle ApexClass CustomObject CustomMetadata
```

### Recommended Deploy Order
> Always deploy in this order to avoid dependency errors:

```
1. Apex Classes          (PortfolioSkillsController, SubmitRequestController)
2. Custom Objects         (Portfolio_Request__c)
3. Custom Metadata Types  (Portfolio_Skill__mdt, Portfolio_Certification__mdt)
4. LWC Components         (all)
5. Static Resources       (durgarao_image, Durgarao_Resume) — via UI
```

---

## 🖼 Static Resources Setup

Two static resources must be uploaded manually via the Salesforce UI (they cannot be deployed via CLI easily due to binary file format).

| Resource Name | File Type | Cache Control | Used By |
|---|---|---|---|
| `durgarao_image` | PNG / JPG | **Public** | `portfolioHero` |
| `Durgarao_Resume` | PDF | **Public** | `portfolioHero` |

**Steps:**
1. Setup → Static Resources → **New**
2. Name: `durgarao_image` (must match exactly — case-sensitive)
3. Upload your photo file
4. Cache Control: **Public** ← critical for guest user access
5. Save
6. Repeat for `Durgarao_Resume`

> ⚠️ If Cache Control is set to **Private**, guest/public users will get a 403 error and the image/PDF won't load.

---

## 🗃 Custom Metadata Setup

Custom Metadata records are the "database" for Skills and Certifications. They are queryable by Apex and work with the Guest User without any sharing rules.

### Create `Portfolio_Skill__mdt`
1. Setup → Custom Metadata Types → **New**
2. Label: `Portfolio Skill` | Plural: `Portfolio Skills` | API Name: `Portfolio_Skill__mdt`
3. Add all fields from the [portfolioSkillsCerts](#4-portfolioskillscerts) section
4. Click **Manage Records** → add one record per skill

### Create `Portfolio_Certification__mdt`
1. Setup → Custom Metadata Types → **New**
2. Label: `Portfolio Certification` | API Name: `Portfolio_Certification__mdt`
3. Add all fields
4. Click **Manage Records** → add one record per certification

> 💡 Custom Metadata records can also be deployed via CLI by placing them in `force-app/main/default/customMetadata/` as XML files.

---

## 👤 Guest User & Public Access

For any unauthenticated visitor to see data or submit forms, the Guest User Profile needs specific permissions.

### Find Your Guest Profile
Setup → Digital Experiences → All Sites → **[Your Site]** → Workspaces → Administration → Guest User Profile (click the profile name)

### Required Permissions

| Permission | Where | Required For |
|---|---|---|
| Read on `Portfolio_Skill__mdt` | Object Settings | Skills tab |
| Read on `Portfolio_Certification__mdt` | Object Settings | Certs tab |
| Create on `Portfolio_Request__c` | Object Settings | Submit Request form |
| Apex: `PortfolioSkillsController` | Apex Class Access | Skills & Certs data |
| Apex: `SubmitRequestController` | Apex Class Access | Request form submit |
| Messaging for Web permission | Connected Apps | Agentforce chat |

---

## 🔒 CSP Trusted Sites

Add these in Setup → Security → **CSP Trusted Sites** → New. Check **all Allow checkboxes** for each.

| Site Name | URL | Required For |
|---|---|---|
| `GoogleFonts_API` | `https://fonts.googleapis.com` | All component fonts |
| `GoogleFonts_Static` | `https://fonts.gstatic.com` | Font files |
| `Trailhead_CDN` | `https://trailhead.salesforce.com` | Cert logo images |
| `SF_Embedded_Chat` | `https://[yourorg].my.salesforce.com` | Agentforce chat |
| `SF_SCRT2` | `https://[yourorg].my.salesforce-scrt.com` | Chat transport |
| `SF_LiveAgent` | `https://[yourorg].salesforce-live-agent.com` | Live agent fallback |
| `SF_CDN_Static` | `https://static.salesforceliveagent.com` | Chat UI assets |

> Replace `[yourorg]` with your actual Salesforce org subdomain.

---

## 🐛 Troubleshooting

### Component not showing in Experience Builder
- Confirm `<target>lightningCommunity__Default</target>` is in the `.js-meta.xml`
- Redeploy the component and hard-refresh Experience Builder

### Profile image not loading for guest users
- Check Static Resource Cache Control = **Public**
- Verify `@salesforce/resourceUrl/durgarao_image` spelling matches the Static Resource name exactly

### Skills/Certs showing empty
- Check the Guest User Profile has Apex Class access to `PortfolioSkillsController`
- Check Custom Metadata records exist (Setup → Custom Metadata Types → Manage Records)
- Open browser DevTools → Network tab → look for a 401 or 403 error on the Apex call

### LWC deploy error: `if:true is not supported`
- Your component is using the old `if:true={condition}` directive
- Replace with `lwc:if={condition}`, `lwc:elseif={condition}`, `lwc:else`
- Set API version to 59.0 in the `.js-meta.xml`

### Agentforce chat button not appearing
- Check the JS snippet is in Experience Builder → Head Markup
- Check all CSP Trusted Sites are added
- Open browser Console → look for `initEmbeddedMessaging` errors

### Submit Request form saves but shows error
- Check `Portfolio_Request__c` object exists with all required fields
- Check Guest User Profile has **Create** permission on the object
- Check Apex class is whitelisted in Guest Profile

### Deploy fails with `Entity of type Metadata is not available`
- The target org may not have Experience Cloud enabled
- Or the API version in `sfdx-project.json` is mismatched — set `"sourceApiVersion": "59.0"`

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