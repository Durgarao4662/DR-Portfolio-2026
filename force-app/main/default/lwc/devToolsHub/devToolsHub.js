// devToolsHub.js
import { LightningElement, track } from 'lwc';

const TOOLS = [
    {
        id   : 'soql',
        name : 'SOQL Builder',
        icon : '🔍',
        desc : 'Visual query constructor',
        color: '#00FFD4',
        chips: ['12 objects', '5 patterns', 'Syntax highlight'],
        panelId: 'panel-soql',
    },
    {
        id   : 'limits',
        name : 'Limits Checker',
        icon : '⚡',
        desc : 'Governor limits monitor',
        color: '#FFB300',
        chips: ['8 limit types', 'Sync / Async', '15-row ref table'],
        panelId: 'panel-limits',
    },
    {
        id   : 'json',
        name : 'JSON → Apex',
        icon : '{ }',
        desc : 'Instant class generator',
        color: '#FF2D78',
        chips: ['Inner classes', 'Type mapping', 'parse() method'],
        panelId: 'panel-json',
    },
];

export default class DevToolsHub extends LightningElement {

    @track activeTool = 'soql';

    // ── Navigation ────────────────────────────────────────────
    get navTabs() {
        return TOOLS.map(t => ({
            ...t,
            isActive: this.activeTool === t.id,
            btnClass: this.activeTool === t.id
                ? 'nav-tab nav-tab--active'
                : 'nav-tab',
            iconBg: `--icon-color:${t.color}; background:${t.color}18; border-color:${t.color}35;`,
        }));
    }

    get showSoql()      { return this.activeTool === 'soql';   }
    get showLimits()    { return this.activeTool === 'limits'; }
    get showJsonToApex(){ return this.activeTool === 'json';   }

    selectTool(e) {
        this.activeTool = e.currentTarget.dataset.tool;
    }

    // ── Hero stats ────────────────────────────────────────────
    get heroStats() {
        return [
            { id:1, icon:'🛠', val:'3', lbl:'Tools' },
            { id:2, icon:'🔍', val:'12', lbl:'SOQL Objects' },
            { id:3, icon:'⚡', val:'15', lbl:'Limit Types' },
            { id:4, icon:'{ }', val:'∞', lbl:'JSON Conversions' },
        ];
    }
}