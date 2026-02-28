// apexLimitsChecker.js
import { LightningElement, track } from 'lwc';

const LIMITS = {
    sync: [
        { id:'soql',       name:'SOQL Queries',        icon:'🔍', max:100,  unit:'queries',   warnAt:80,  context:'Per transaction',      tip:'Use selective queries, avoid queries in loops. Consider SOQL For Loops for large datasets.' },
        { id:'soql_rows',  name:'SOQL Rows Retrieved',  icon:'📄', max:50000,unit:'rows',      warnAt:80,  context:'Per transaction',      tip:'Add WHERE clauses and LIMIT to reduce rows. Use aggregate queries where possible.' },
        { id:'dml',        name:'DML Statements',       icon:'💾', max:150,  unit:'statements', warnAt:80, context:'Per transaction',      tip:'Bulkify DML operations — use collections. Avoid DML inside loops.' },
        { id:'dml_rows',   name:'DML Rows Processed',   icon:'📝', max:10000,unit:'rows',      warnAt:80,  context:'Per transaction',      tip:'Process records in collections. Consider Batch Apex for large volumes.' },
        { id:'cpu',        name:'CPU Time',             icon:'⚡', max:10000,unit:'ms',        warnAt:75,  context:'Per transaction (sync)', tip:'Avoid expensive loops. Cache results. Use Maps for lookups instead of nested loops.' },
        { id:'heap',       name:'Heap Size',            icon:'🧠', max:6000000,unit:'bytes',   warnAt:80,  context:'Sync (6 MB)',           tip:'Avoid storing large data in variables. Clear collections when no longer needed.' },
        { id:'callouts',   name:'Callouts',             icon:'🌐', max:100,  unit:'callouts',  warnAt:80,  context:'Per transaction',      tip:'Use Queueable or Future methods. Combine callouts where possible using composite APIs.' },
        { id:'email',      name:'Email Invocations',    icon:'✉️', max:10,   unit:'invocations',warnAt:80, context:'Per transaction',      tip:'Use single sendEmail() call with list of messages instead of multiple calls.' },
    ],
    async: [
        { id:'soql',       name:'SOQL Queries',        icon:'🔍', max:200,  unit:'queries',   warnAt:80,  context:'Per transaction',      tip:'Async context doubles most query limits.' },
        { id:'soql_rows',  name:'SOQL Rows Retrieved', icon:'📄', max:50000,unit:'rows',      warnAt:80,  context:'Per transaction',      tip:'Same row limit applies in async contexts.' },
        { id:'dml',        name:'DML Statements',      icon:'💾', max:150,  unit:'statements', warnAt:80,  context:'Per transaction',      tip:'Same DML limit applies in async.' },
        { id:'dml_rows',   name:'DML Rows Processed',  icon:'📝', max:10000,unit:'rows',      warnAt:80,  context:'Per transaction',      tip:'Same DML rows limit.' },
        { id:'cpu',        name:'CPU Time',            icon:'⚡', max:60000,unit:'ms',        warnAt:75,  context:'Per transaction (async)', tip:'Async transactions get 60s CPU time — 6× more than sync.' },
        { id:'heap',       name:'Heap Size',           icon:'🧠', max:12000000,unit:'bytes',  warnAt:80,  context:'Async (12 MB)',         tip:'Async heap is doubled to 12 MB.' },
        { id:'callouts',   name:'Callouts',            icon:'🌐', max:100,  unit:'callouts',  warnAt:80,  context:'Per transaction',      tip:'Same callout limit as sync.' },
        { id:'email',      name:'Email Invocations',   icon:'✉️', max:10,   unit:'invocations',warnAt:80, context:'Per transaction',      tip:'Same email invocation limit.' },
    ],
};

const REF_TABLE = [
    { id:1,  name:'SOQL Queries',            sync:'100',      async:'200',    notes:'Applies to all SOQL queries including sub-queries',    highlight:false },
    { id:2,  name:'SOQL Rows Retrieved',     sync:'50,000',   async:'50,000', notes:'Total rows across all SOQL queries',                   highlight:false },
    { id:3,  name:'DML Statements',          sync:'150',      async:'150',    notes:'INSERT, UPDATE, DELETE, UPSERT, MERGE, CONVERT each count', highlight:false },
    { id:4,  name:'DML Rows Processed',      sync:'10,000',   async:'10,000', notes:'Total records affected by all DML statements',         highlight:false },
    { id:5,  name:'CPU Time',                sync:'10,000ms', async:'60,000ms',notes:'Wall-clock time used by Apex code only',              highlight:true  },
    { id:6,  name:'Heap Size',               sync:'6 MB',     async:'12 MB',  notes:'Memory used by all variables in transaction',          highlight:true  },
    { id:7,  name:'Callouts (HTTP/SOAP)',     sync:'100',      async:'100',    notes:'External callouts per transaction',                    highlight:false },
    { id:8,  name:'Email Invocations',        sync:'10',       async:'10',     notes:'Messaging.sendEmail() calls',                          highlight:false },
    { id:9,  name:'Future Calls',             sync:'50',       async:'0',      notes:'@future method invocations per transaction',           highlight:false },
    { id:10, name:'Queueable Jobs',           sync:'50',       async:'1',      notes:'System.enqueueJob() calls per transaction',            highlight:false },
    { id:11, name:'Batch Apex Submissions',   sync:'100',      async:'100',    notes:'Database.executeBatch() per transaction',              highlight:false },
    { id:12, name:'SOSL Queries',             sync:'20',       async:'20',     notes:'FIND [...] searches per transaction',                  highlight:false },
    { id:13, name:'Describe Calls',           sync:'100',      async:'100',    notes:'sObject & field describe operations',                  highlight:false },
    { id:14, name:'Push Notification Requests',sync:'10',      async:'10',     notes:'Mobile push notifications per transaction',            highlight:false },
    { id:15, name:'Record Lock Limit',        sync:'10',       async:'10',     notes:'FOR UPDATE SOQL locks per transaction',                highlight:false },
];

export default class ApexLimitsChecker extends LightningElement {

    @track mode    = 'sync';
    @track usedMap = {};
    @track showRef = false;

    // ── Mode ──────────────────────────────────────────────────
    get syncBtnClass()  { return this.mode==='sync'  ? 'mode-btn mode-btn--on' : 'mode-btn'; }
    get asyncBtnClass() { return this.mode==='async' ? 'mode-btn mode-btn--on' : 'mode-btn'; }
    setSync()  { this.mode = 'sync';  this.usedMap = {}; }
    setAsync() { this.mode = 'async'; this.usedMap = {}; }

    // ── Cards ─────────────────────────────────────────────────
    get limitCards() {
        return LIMITS[this.mode].map(lim => {
            const used    = Number(this.usedMap[lim.id] || 0);
            const pct     = Math.min(100, Math.round((used / lim.max) * 100));
            const remaining = lim.max - used;
            const status  = pct >= 90 ? 'CRITICAL' : pct >= lim.warnAt ? 'WARNING' : 'OK';
            const color   = pct >= 90 ? '#FF4757' : pct >= lim.warnAt ? '#FFA500' : '#00E676';
            const barGrad = pct >= 90
                ? `linear-gradient(90deg, #FF4757, #FF6B6B)`
                : pct >= lim.warnAt
                ? `linear-gradient(90deg, #FFA500, #FFD700)`
                : `linear-gradient(90deg, #00B894, #00E676)`;

            const maxLabel = lim.id === 'heap'
                ? (lim.max >= 1000000 ? `${lim.max/1000000} MB` : `${lim.max/1000} KB`)
                : lim.max.toLocaleString();

            const remainLabel = lim.id === 'heap'
                ? (remaining >= 1000000 ? `${(remaining/1000000).toFixed(1)} MB` : remaining >= 1000 ? `${(remaining/1000).toFixed(0)} KB` : `${remaining} B`)
                : remaining.toLocaleString();

            return {
                ...lim,
                used,
                pct,
                maxVal   : lim.max,
                maxLabel,
                remaining: remainLabel,
                status,
                iconBg   : `background:${color}18; border-color:${color}44;`,
                badgeStyle: `background:${color}22; color:${color}; border-color:${color}44;`,
                cardClass : status === 'CRITICAL' ? 'limit-card limit-card--crit'
                          : status === 'WARNING'  ? 'limit-card limit-card--warn'
                          : 'limit-card',
                barStyle  : `width:${pct}%; background:${barGrad}; box-shadow:0 0 8px ${color}66;`,
                tickStyle : `left:${lim.warnAt}%;`,
                showWarning: pct >= lim.warnAt,
                warningText: pct >= 90
                    ? `🚨 CRITICAL — approaching limit! Refactor immediately.`
                    : `⚠ ${100-pct}% remaining — review usage soon.`,
            };
        });
    }

    // ── Overall health ─────────────────────────────────────────
    get healthPct() {
        const cards = this.limitCards;
        const avg   = cards.reduce((a, c) => a + c.pct, 0) / cards.length;
        return `${Math.round(100 - avg)}% Safe`;
    }
    get healthFillStyle() {
        const cards = this.limitCards;
        const avg   = cards.reduce((a, c) => a + c.pct, 0) / cards.length;
        const safe  = Math.round(100 - avg);
        const color = safe < 30 ? '#FF4757' : safe < 60 ? '#FFA500' : '#00E676';
        return `width:${safe}%; background:linear-gradient(90deg, ${color}, ${color}CC); box-shadow:0 0 10px ${color}66;`;
    }
    get healthPctStyle() {
        const cards = this.limitCards;
        const avg   = cards.reduce((a, c) => a + c.pct, 0) / cards.length;
        const safe  = Math.round(100 - avg);
        return `color:${safe < 30 ? '#FF4757' : safe < 60 ? '#FFA500' : '#00E676'}`;
    }
    get healthStatus() {
        const cards = this.limitCards;
        const crit  = cards.filter(c => c.status === 'CRITICAL').length;
        const warn  = cards.filter(c => c.status === 'WARNING').length;
        return crit > 0 ? `${crit} CRITICAL` : warn > 0 ? `${warn} WARNING` : 'ALL CLEAR';
    }
    get healthStatusStyle() {
        const cards = this.limitCards;
        const crit  = cards.filter(c => c.status === 'CRITICAL').length;
        const warn  = cards.filter(c => c.status === 'WARNING').length;
        return `color:${crit > 0 ? '#FF4757' : warn > 0 ? '#FFA500' : '#00E676'}; font-weight:700;`;
    }

    // ── Ref table ─────────────────────────────────────────────
    get refRows() {
        return REF_TABLE.map(r => ({ ...r, rowClass: r.highlight ? 'ref-row ref-row--hl' : 'ref-row' }));
    }
    toggleRef() { this.showRef = !this.showRef; }

    // ── Handlers ──────────────────────────────────────────────
    onUsedChange(e) {
        const id  = e.currentTarget.dataset.id;
        const val = Math.max(0, Number(e.target.value) || 0);
        this.usedMap = { ...this.usedMap, [id]: val };
    }

    resetAll() { this.usedMap = {}; }
}