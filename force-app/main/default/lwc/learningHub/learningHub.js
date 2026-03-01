// learningHub.js
import { LightningElement, wire, track, api } from 'lwc';
import getMaterials from '@salesforce/apex/LearningHubController.getMaterials';

// ─────────────────────────────────────────────────
// public properties
// ─────────────────────────────────────────────────
// (moved into class declaration below to avoid decorator parsing error)

// ─────────────────────────────────────────────────
// Category definitions
// ─────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all',          name: 'All Resources',    icon: '📚', color: '#2563EB' },
    { id: 'salescloud',   name: 'Sales Cloud',      icon: '💼', color: '#0070D2' },
    { id: 'servicecloud', name: 'Service Cloud',    icon: '🎧', color: '#00A1E0' },
    { id: 'lwc',          name: 'LWC',              icon: '⚡', color: '#7C3AED' },
    { id: 'apex',         name: 'Apex',             icon: '🔷', color: '#1E3A5F' },
    { id: 'integration',  name: 'Integration',      icon: '🔗', color: '#C2410C' },
    { id: 'devops',       name: 'DevOps / Git',     icon: '🛠️', color: '#15803D' },
    { id: 'admin',        name: 'Admin',            icon: '🛡️', color: '#B91C1C' },
    { id: 'ai',           name: 'AI / Agentforce',  icon: '🤖', color: '#7E22CE' },
    { id: 'datacloud',    name: 'Data Cloud',       icon: '📊', color: '#1D4ED8' },
    { id: 'other',        name: 'Other Tools',      icon: '🔧', color: '#4B5563' },
];

// File type badge colours (bg / text)
const TYPE_COLOR = {
    PDF:   ['#FEF3C7', '#92400E'],
    DOCX:  ['#DBEAFE', '#1E40AF'],
    XLSX:  ['#D1FAE5', '#065F46'],
    PPTX:  ['#FCE7F3', '#9D174D'],
    VIDEO: ['#EDE9FE', '#5B21B6'],
    LINK:  ['#F3F4F6', '#374151'],
    MD:    ['#F0FDF4', '#166534'],
};

// Difficulty badge colours
const DIFF_COLOR = {
    Beginner:     ['#D1FAE5', '#065F46'],
    Intermediate: ['#FEF3C7', '#92400E'],
    Advanced:     ['#FEE2E2', '#991B1B'],
};

// Search bar placeholder cycling
const PLACEHOLDERS = [
    'Search LWC interview questions…',
    'Search Git & GitHub guide…',
    'Search Apex design patterns…',
    'Search Agentforce implementation…',
    'Search admin certification study…',
    'Search REST API integration…',
];

const PAGE_SIZE = 9;

// ─────────────────────────────────────────────────
// 30 pre-loaded materials (static fallback + demo)
// ─────────────────────────────────────────────────
const STATIC_MATERIALS = [

    // ── Sales Cloud ──────────────────────────────────────────────────────
    {
        id: 'sc1', category: 'salescloud', icon: '💼',
        title: 'Sales Cloud Implementation Guide',
        description: 'End-to-end implementation playbook covering lead management, opportunity pipeline, territory setup, forecasting, and CPQ integration best practices for enterprise orgs.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '4.2 MB',
        fileUrl: '#', tags: 'Sales Cloud,Implementation,CPQ,Forecasting',
        author: 'Salesforce Docs', downloads: 284, isFeatured: true, isActive: true, sortOrder: 1,
    },
    {
        id: 'sc2', category: 'salescloud', icon: '📐',
        title: 'Sales Cloud Object Model Reference',
        description: 'Complete data model diagram and field reference for all core Sales Cloud objects — Account, Contact, Opportunity, Lead, Campaign — with relationship maps.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '1.8 MB',
        fileUrl: '#', tags: 'Object Model,Data Model,Relationships',
        author: 'Salesforce', downloads: 197, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'sc3', category: 'salescloud', icon: '📋',
        title: 'CPQ Configuration Cheat Sheet',
        description: 'Quick reference for Salesforce CPQ — product rules, price rules, quote templates, approval workflows, and Multi-Dimensional Quoting (MDQ) setup in one page.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '2.1 MB',
        fileUrl: '#', tags: 'CPQ,Quote,Pricing,Rules',
        author: 'Durgarao T.', downloads: 156, isFeatured: false, isActive: true, sortOrder: 3,
    },

    // ── Service Cloud ────────────────────────────────────────────────────
    {
        id: 'svc1', category: 'servicecloud', icon: '🎧',
        title: 'Service Cloud Complete Setup Guide',
        description: 'Step-by-step guide covering Cases, Omni-Channel routing, Knowledge Base, Service Console, Live Agent, and Einstein Bots — from scratch to production.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '3.7 MB',
        fileUrl: '#', tags: 'Service Cloud,Cases,Omni-Channel,Knowledge',
        author: 'Salesforce Docs', downloads: 231, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'svc2', category: 'servicecloud', icon: '🔀',
        title: 'Omni-Channel Routing Deep Dive',
        description: 'Detailed walkthrough of queue-based, skills-based, and Einstein-based routing strategies with capacity plans, presence configurations, and troubleshooting tips.',
        difficulty: 'Advanced', fileType: 'DOCX', fileSize: '1.4 MB',
        fileUrl: '#', tags: 'Omni-Channel,Routing,Skills,Einstein',
        author: 'Durgarao T.', downloads: 118, isFeatured: false, isActive: true, sortOrder: 2,
    },

    // ── LWC ─────────────────────────────────────────────────────────────
    {
        id: 'lwc1', category: 'lwc', icon: '⚡',
        title: 'LWC Interview Questions — Top 100',
        description: 'Comprehensive interview prep covering all LWC topics: lifecycle hooks, @api/@track/@wire decorators, custom events, shadow DOM, slots, component communication, and performance tips.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '2.6 MB',
        fileUrl: '#', tags: 'LWC,Interview,Decorators,Events,Lifecycle',
        author: 'Durgarao T.', downloads: 542, isFeatured: true, isActive: true, sortOrder: 1,
    },
    {
        id: 'lwc2', category: 'lwc', icon: '📡',
        title: 'LWC Component Communication Guide',
        description: 'Complete reference for all LWC communication patterns — parent→child with @api, child→parent with CustomEvent, sibling-to-sibling via pubsub, and Lightning Message Channel.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '1.9 MB',
        fileUrl: '#', tags: 'LWC,Events,MessageChannel,pubsub',
        author: 'Durgarao T.', downloads: 327, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'lwc3', category: 'lwc', icon: '🚀',
        title: 'LWC Performance Optimisation Cookbook',
        description: 'Practical techniques: lazy loading, memoization with getter caching, conditional rendering best practices, wire adapter caching strategies, and reducing DOM node count.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '2.2 MB',
        fileUrl: '#', tags: 'LWC,Performance,Optimisation,Wire,Caching',
        author: 'Durgarao T.', downloads: 214, isFeatured: false, isActive: true, sortOrder: 3,
    },
    {
        id: 'lwc4', category: 'lwc', icon: '🔄',
        title: 'LWC vs Aura — Migration Guide',
        description: 'Side-by-side syntax comparison and migration patterns. Covers component conversion, event model changes, lifecycle hook mapping, and the most common migration gotchas.',
        difficulty: 'Intermediate', fileType: 'DOCX', fileSize: '1.5 MB',
        fileUrl: '#', tags: 'LWC,Aura,Migration,Comparison',
        author: 'Salesforce Docs', downloads: 189, isFeatured: false, isActive: true, sortOrder: 4,
    },

    // ── Apex ─────────────────────────────────────────────────────────────
    {
        id: 'apx1', category: 'apex', icon: '📏',
        title: 'Apex Governor Limits Quick Reference',
        description: 'Printable cheat sheet of all governor limits — sync/async SOQL rows, DML statements, CPU time, heap, callouts, and email limits — with practical tips to stay within bounds.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '0.8 MB',
        fileUrl: '#', tags: 'Apex,Governor Limits,SOQL,DML',
        author: 'Durgarao T.', downloads: 478, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'apx2', category: 'apex', icon: '🏗️',
        title: 'Apex Design Patterns Handbook',
        description: 'Production-grade patterns — Selector, Service layer, Domain layer, Unit of Work, Strategy, Decorator, and Singleton — with full code examples for each.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '3.4 MB',
        fileUrl: '#', tags: 'Apex,Design Patterns,Architecture,Best Practices',
        author: 'Durgarao T.', downloads: 312, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'apx3', category: 'apex', icon: '💬',
        title: 'Apex Interview Questions — Top 80',
        description: '80 must-know questions covering triggers, batch Apex, future methods, queueable Apex, platform events, custom exceptions, test class best practices, and limit management.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '2.1 MB',
        fileUrl: '#', tags: 'Apex,Interview,Triggers,Batch,Testing',
        author: 'Durgarao T.', downloads: 405, isFeatured: true, isActive: true, sortOrder: 3,
    },
    {
        id: 'apx4', category: 'apex', icon: '🔍',
        title: 'SOQL & SOSL Mastery Guide',
        description: 'Deep dive into SOQL and SOSL — aggregate functions, relationship queries, semi-joins, anti-joins, polymorphic fields, SOSL syntax, and query plan optimisation techniques.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '1.7 MB',
        fileUrl: '#', tags: 'SOQL,SOSL,Query,Optimisation',
        author: 'Durgarao T.', downloads: 289, isFeatured: false, isActive: true, sortOrder: 4,
    },

    // ── Integration ──────────────────────────────────────────────────────
    {
        id: 'int1', category: 'integration', icon: '🔗',
        title: 'Salesforce REST API Integration Guide',
        description: 'Comprehensive guide covering OAuth 2.0 flows, CRUD via REST, bulk queries, composite and batch APIs, and common integration patterns with external platforms.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '3.1 MB',
        fileUrl: '#', tags: 'REST API,OAuth,Integration,Composite API',
        author: 'Salesforce Docs', downloads: 267, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'int2', category: 'integration', icon: '📨',
        title: 'Platform Events & CDC Guide',
        description: 'Hands-on guide for Platform Events and Change Data Capture — architecture, event definitions, publish/subscribe patterns, replay IDs, and real-world integration scenarios.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '2.4 MB',
        fileUrl: '#', tags: 'Platform Events,CDC,Event Bus,Streaming',
        author: 'Durgarao T.', downloads: 198, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'int3', category: 'integration', icon: '🌐',
        title: 'MuleSoft + Salesforce Integration Patterns',
        description: 'Integration patterns between MuleSoft AnyPoint Platform and Salesforce — waterfall sync, event-driven sync, Connector configuration, error handling, and performance tuning.',
        difficulty: 'Advanced', fileType: 'DOCX', fileSize: '2.8 MB',
        fileUrl: '#', tags: 'MuleSoft,Integration,Patterns,AnyPoint',
        author: 'Durgarao T.', downloads: 143, isFeatured: false, isActive: true, sortOrder: 3,
    },

    // ── DevOps / Git ─────────────────────────────────────────────────────
    {
        id: 'dev1', category: 'devops', icon: '🌿',
        title: 'Git & GitHub Implementation Guide',
        description: 'Complete Git workflow guide for Salesforce teams — GitFlow vs trunk-based branching, PR templates, merge conflict resolution, and CI/CD pipeline setup with GitHub Actions.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '2.3 MB',
        fileUrl: '#', tags: 'Git,GitHub,Branching,CI/CD,DevOps',
        author: 'Durgarao T.', downloads: 356, isFeatured: true, isActive: true, sortOrder: 1,
    },
    {
        id: 'dev2', category: 'devops', icon: '💻',
        title: 'Salesforce DX (SFDX) Cheat Sheet',
        description: 'Quick reference for all essential SF CLI commands — project setup, org authentication, source deploy/retrieve, scratch org lifecycle, and debug log commands.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '0.9 MB',
        fileUrl: '#', tags: 'SFDX,CLI,Deployment,Scratch Org',
        author: 'Durgarao T.', downloads: 298, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'dev3', category: 'devops', icon: '⚙️',
        title: 'GitHub Actions for Salesforce CI/CD',
        description: 'Step-by-step guide for Salesforce CI/CD with GitHub Actions — automated deployments, Apex test execution, static code analysis with PMD, and multi-environment promotion.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '1.8 MB',
        fileUrl: '#', tags: 'GitHub Actions,CI/CD,PMD,Automation',
        author: 'Durgarao T.', downloads: 221, isFeatured: false, isActive: true, sortOrder: 3,
    },

    // ── Admin ────────────────────────────────────────────────────────────
    {
        id: 'adm1', category: 'admin', icon: '🛡️',
        title: 'Salesforce Admin Certification Study Guide',
        description: 'Complete study guide for the Admin cert — all 12 exam topics, formula field examples, workflow rules vs flows, sharing model deep dive, and 50+ practice questions.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '5.1 MB',
        fileUrl: '#', tags: 'Admin,Certification,Flows,Sharing,Study Guide',
        author: 'Salesforce Docs', downloads: 612, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'adm2', category: 'admin', icon: '🌊',
        title: 'Flow Builder Mastery Guide',
        description: 'Comprehensive Flow reference — record-triggered, scheduled, screen, autolaunched flows, subflows, loop patterns, roll-back on error, and performance best practices.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '3.2 MB',
        fileUrl: '#', tags: 'Flow,Automation,Triggers,Screen Flow',
        author: 'Durgarao T.', downloads: 387, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'adm3', category: 'admin', icon: '🔐',
        title: 'Salesforce Security & Sharing Model Guide',
        description: 'Complete reference for org-wide defaults, role hierarchy, profiles, permission sets, sharing rules, field-level security, and session-based permission sets.',
        difficulty: 'Intermediate', fileType: 'DOCX', fileSize: '2.6 MB',
        fileUrl: '#', tags: 'Security,Sharing,Profiles,Permission Sets,OWD',
        author: 'Durgarao T.', downloads: 274, isFeatured: false, isActive: true, sortOrder: 3,
    },

    // ── AI / Agentforce ──────────────────────────────────────────────────
    {
        id: 'ai1', category: 'ai', icon: '🤖',
        title: 'Agentforce Implementation Guide',
        description: 'End-to-end Agentforce guide — Agent Studio configuration, topic definitions, actions, guardrails, testing with the Agentforce Tester, and deploying AI agents to Experience Cloud.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '2.9 MB',
        fileUrl: '#', tags: 'Agentforce,AI,Agent Studio,Actions,LLM',
        author: 'Durgarao T.', downloads: 318, isFeatured: true, isActive: true, sortOrder: 1,
    },
    {
        id: 'ai2', category: 'ai', icon: '✨',
        title: 'Einstein AI Features Reference',
        description: 'Overview of all Einstein AI features — Einstein GPT, Prediction Builder, Einstein Discovery, Next Best Action, and Einstein for Service with setup and configuration guidance.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '2.2 MB',
        fileUrl: '#', tags: 'Einstein,AI,Prediction,GPT,Machine Learning',
        author: 'Salesforce Docs', downloads: 245, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'ai3', category: 'ai', icon: '💬',
        title: 'Prompt Engineering for Salesforce AI',
        description: 'Practical guide to writing effective prompts for Einstein GPT and Agentforce — prompt templates, grounding techniques, chain-of-thought patterns, and output formatting strategies.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '1.6 MB',
        fileUrl: '#', tags: 'Prompt Engineering,Einstein GPT,Agentforce',
        author: 'Durgarao T.', downloads: 187, isFeatured: false, isActive: true, sortOrder: 3,
    },

    // ── Data Cloud ───────────────────────────────────────────────────────
    {
        id: 'dc1', category: 'datacloud', icon: '📊',
        title: 'Data Cloud Architecture & Setup Guide',
        description: 'Comprehensive Salesforce Data Cloud guide — data streams, data model objects, identity resolution, calculated insights, activations, and connecting to Marketing Cloud and CRM.',
        difficulty: 'Advanced', fileType: 'PDF', fileSize: '4.6 MB',
        fileUrl: '#', tags: 'Data Cloud,CDP,Identity Resolution,Insights',
        author: 'Salesforce Docs', downloads: 203, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'dc2', category: 'datacloud', icon: '💡',
        title: 'Data Cloud Interview Questions',
        description: '30 in-depth interview questions covering data streams, unified profiles, segmentation queries, activation targets, Data Cloud for Marketing, and the Consent API.',
        difficulty: 'Intermediate', fileType: 'PDF', fileSize: '1.3 MB',
        fileUrl: '#', tags: 'Data Cloud,Interview,CDP,Segmentation',
        author: 'Durgarao T.', downloads: 167, isFeatured: false, isActive: true, sortOrder: 2,
    },

    // ── Other Tools ──────────────────────────────────────────────────────
    {
        id: 'oth1', category: 'other', icon: '🖥️',
        title: 'VS Code for Salesforce — Power User Guide',
        description: 'Essential VS Code setup for Salesforce devs — top extensions (SFDX, Apex PMD, ESLint), keyboard shortcuts, multi-root workspaces, and debugging launch configurations.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '1.4 MB',
        fileUrl: '#', tags: 'VS Code,IDE,Extensions,Debugging',
        author: 'Durgarao T.', downloads: 332, isFeatured: false, isActive: true, sortOrder: 1,
    },
    {
        id: 'oth2', category: 'other', icon: '📮',
        title: 'Postman for Salesforce API Testing',
        description: 'Complete Postman guide for Salesforce — environment setup, OAuth 2.0 authentication flow, environment variables, collection structure, and automated test scripts.',
        difficulty: 'Beginner', fileType: 'PDF', fileSize: '1.7 MB',
        fileUrl: '#', tags: 'Postman,API,Testing,OAuth,REST',
        author: 'Durgarao T.', downloads: 276, isFeatured: false, isActive: true, sortOrder: 2,
    },
    {
        id: 'oth3', category: 'other', icon: '📋',
        title: 'JIRA for Salesforce Project Management',
        description: 'Practical JIRA setup for Salesforce teams — board configuration, story templates, sprint ceremonies, linking GitHub commits to JIRA tickets, and release management.',
        difficulty: 'Beginner', fileType: 'DOCX', fileSize: '1.1 MB',
        fileUrl: '#', tags: 'JIRA,Project Management,Agile,Sprints',
        author: 'Durgarao T.', downloads: 198, isFeatured: false, isActive: true, sortOrder: 3,
    },
];

// ─────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────
export default class LearningHub extends LightningElement {
    @api pageTitle;


    @track _materials       = [];
    @track activeCategory   = 'all';
    @track searchTerm       = '';
    @track sortMode         = 'default';
    @track isLoading        = true;
    @track _page            = 1;

    skeletonList = [1, 2, 3, 4, 5, 6];

    _placeholderIdx   = 0;
    _placeholderTimer = null;
    @track searchPlaceholder = PLACEHOLDERS[0];

    // ── Wire: fetch from Apex, fall back to static ──────────
    @wire(getMaterials)
    wiredMaterials({ data, error }) {
        if (data && data.length > 0) {
            this._materials = this._mapFromApex(data);
        } else {
            this._materials = STATIC_MATERIALS;
        }
        this.isLoading = false;
    }

    connectedCallback() {
        // Show static data immediately — wire result replaces it when ready
        if (this._materials.length === 0) {
            this._materials = STATIC_MATERIALS;
            this.isLoading  = false;
        }
        this._startPlaceholderCycle();
    }

    disconnectedCallback() {
        if (this._placeholderTimer) clearInterval(this._placeholderTimer);
    }

    _startPlaceholderCycle() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._placeholderTimer = setInterval(() => {
            this._placeholderIdx = (this._placeholderIdx + 1) % PLACEHOLDERS.length;
            this.searchPlaceholder = PLACEHOLDERS[this._placeholderIdx];
        }, 3500);
    }

    _mapFromApex(records) {
        return records.map(r => ({
            id          : r.Id || r.DeveloperName,
            title       : r.Title__c        || '',
            description : r.Description__c  || '',
            category    : r.Category__c     || 'other',
            icon        : r.Icon_Emoji__c   || '📄',
            difficulty  : r.Difficulty__c   || 'Beginner',
            fileType    : r.File_Type__c    || 'PDF',
            fileSize    : r.File_Size__c    || '',
            fileUrl     : r.File_URL__c     || '#',
            tags        : r.Tags__c         || '',
            author      : r.Author__c       || '',
            downloads   : Number(r.Download_Count__c) || 0,
            isFeatured  : !!r.Is_Featured__c,
            isActive    : r.Is_Active__c !== false,
            sortOrder   : Number(r.Sort_Order__c) || 99,
        }));
    }

    // ── Derived: active + filtered list ─────────────────────
    get _activeList() {
        let list = this._materials.filter(m => m.isActive);

        if (this.activeCategory !== 'all') {
            list = list.filter(m => m.category === this.activeCategory);
        }

        if (this.searchTerm.trim()) {
            const q = this.searchTerm.toLowerCase();
            list = list.filter(m =>
                m.title.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q) ||
                m.tags.toLowerCase().includes(q) ||
                m.author.toLowerCase().includes(q) ||
                m.category.toLowerCase().includes(q)
            );
        }

        const ord = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        if (this.sortMode === 'alpha')      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        if (this.sortMode === 'category')   list = [...list].sort((a, b) => a.category.localeCompare(b.category));
        if (this.sortMode === 'difficulty') list = [...list].sort((a, b) => (ord[a.difficulty] || 0) - (ord[b.difficulty] || 0));

        return list;
    }

    get filteredCount()  { return this._activeList.length; }
    get hasResults()     { return !this.isLoading && this.filteredCount > 0; }
    get noResults()      { return !this.isLoading && this.filteredCount === 0; }
    get pluralS()        { return this.filteredCount === 1 ? '' : 's'; }
    get totalCount()     { return this._materials.filter(m => m.isActive).length; }
    get remainingCount() { return Math.max(0, this.filteredCount - this._page * PAGE_SIZE); }
    get showLoadMore()   { return this.remainingCount > 0; }

    // ── Displayed materials with computed style props ────────
    get displayedMaterials() {
        return this._activeList.slice(0, this._page * PAGE_SIZE).map(m => {
            const cat  = CATEGORIES.find(c => c.id === m.category) || CATEGORIES[0];
            const tc   = TYPE_COLOR[m.fileType] || TYPE_COLOR['LINK'];
            const tags = m.tags.split(',').map(t => t.trim()).filter(Boolean);
            return {
                ...m,
                catLabel     : cat.name,
                tagList      : tags.slice(0, 4),
                hasTags      : tags.length > 0,
                cardClass    : `lh-card${m.isFeatured ? ' lh-card--feat' : ''}`,
                cardStyle    : `--cat-clr: ${cat.color};`,
                stripeStyle  : `background: ${cat.color};`,
                iconWrapStyle: `background: ${cat.color}18; border-color: ${cat.color}30; color: ${cat.color};`,
                catChipStyle : `background: ${cat.color}18; color: ${cat.color}; border-color: ${cat.color}35;`,
                typeStyle    : `background: ${tc[0]}; color: ${tc[1]};`,
                dlBtnStyle   : `background: ${cat.color};`,
                diffClass    : `chip chip-diff chip-diff--${(m.difficulty || 'beginner').toLowerCase()}`,
                dlLabel      : `${m.downloads} downloads`,
            };
        });
    }

    // ── Category tabs with live counts ───────────────────────
    get categoryTabs() {
        const allActive = this._materials.filter(m => m.isActive);
        return CATEGORIES.map(cat => {
            const count    = cat.id === 'all'
                ? allActive.length
                : allActive.filter(m => m.category === cat.id).length;
            const isActive = this.activeCategory === cat.id;
            return {
                ...cat,
                count,
                isActive,
                btnClass : `cat-btn${isActive ? ' cat-btn--on' : ''}`,
                btnStyle : isActive
                    ? `--cat-clr: ${cat.color}; border-color: ${cat.color}; color: ${cat.color}; background: ${cat.color}12;`
                    : `--cat-clr: ${cat.color};`,
                cntStyle : isActive
                    ? `background: ${cat.color}; color: #fff;`
                    : '',
            };
        });
    }

    // ── Hero stats row ───────────────────────────────────────
    get heroStats() {
        const active   = this._materials.filter(m => m.isActive);
        const cats     = new Set(active.map(m => m.category)).size;
        const totalDl  = active.reduce((s, m) => s + (m.downloads || 0), 0);
        const types    = new Set(active.map(m => m.fileType)).size;
        return [
            { id: 1, val: active.length,              lbl: 'Resources'  },
            { id: 2, val: cats,                        lbl: 'Categories' },
            { id: 3, val: totalDl.toLocaleString(),    lbl: 'Downloads'  },
            { id: 4, val: types,                       lbl: 'File Types' },
        ];
    }

    // ── Featured item ────────────────────────────────────────
    get featuredItem() {
        const mat = this._activeList.find(m => m.isFeatured);
        if (!mat) return null;
        const cat  = CATEGORIES.find(c => c.id === mat.category) || CATEGORIES[0];
        const tags = mat.tags.split(',').map(t => t.trim()).filter(Boolean);
        return {
            ...mat,
            catLabel : cat.name,
            catColor : cat.color,
            tagList  : tags.slice(0, 5),
            diffClass: `chip chip-diff chip-diff--${(mat.difficulty || 'beginner').toLowerCase()}`,
        };
    }

    get showFeatured() {
        return !this.searchTerm && this.activeCategory === 'all'
            && !!this.featuredItem && !this.isLoading;
    }

    // Featured computed styles
    get featuredBorderStyle() {
        return this.featuredItem ? `--feat-clr: ${this.featuredItem.catColor};` : '';
    }
    get featCatStyle() {
        const fi = this.featuredItem;
        if (!fi) return '';
        return `background: ${fi.catColor}18; color: ${fi.catColor}; border-color: ${fi.catColor}35;`;
    }
    get featIconRingStyle() {
        const fi = this.featuredItem;
        if (!fi) return '';
        return `background: ${fi.catColor}15; border-color: ${fi.catColor}30; color: ${fi.catColor};`;
    }
    get featDlBtnStyle() {
        return this.featuredItem ? `background: ${this.featuredItem.catColor};` : '';
    }

    // ── Event handlers ───────────────────────────────────────
    onCatSelect(e)  { this.activeCategory = e.currentTarget.dataset.cat; this._page = 1; }
    onSearch(e)     { this.searchTerm = e.target.value; this._page = 1; }
    clearSearch()   { this.searchTerm = ''; this._page = 1; }
    onSortChange(e) { this.sortMode = e.target.value; this._page = 1; }
    resetFilters()  { this.activeCategory = 'all'; this.searchTerm = ''; this.sortMode = 'default'; this._page = 1; }
    loadMore()      { this._page += 1; }

    onDownload(e) {
        const id  = e.currentTarget.dataset.id;
        const idx = this._materials.findIndex(m => m.id === id);
        if (idx > -1) {
            this._materials = this._materials.map((m, i) =>
                i === idx ? { ...m, downloads: (m.downloads || 0) + 1 } : m
            );
        }
    }
}