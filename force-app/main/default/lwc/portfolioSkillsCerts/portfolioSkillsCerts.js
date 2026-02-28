// portfolioSkillsCerts.js
import { LightningElement, wire, track } from 'lwc';
import getSkills         from '@salesforce/apex/PortfolioSkillsController.getSkills';
import getCertifications from '@salesforce/apex/PortfolioSkillsController.getCertifications';

// Official Salesforce cert logo URLs (Trailhead CDN)
const CERT_LOGOS = {
    'Salesforce Certified Administrator'    : 'https://dragonslayer.salesforce.com/resource/1666125682000/SalesforceAdmin',
    'Salesforce Platform Developer I'       : 'https://dragonslayer.salesforce.com/resource/1666125682000/PlatformDeveloperI',
    'Salesforce Data Cloud Consultant'      : 'https://dragonslayer.salesforce.com/resource/1666125682000/DataCloudConsultant',
    'Salesforce Platform App Builder'       : 'https://dragonslayer.salesforce.com/resource/1666125682000/PlatformAppBuilder',
    'Salesforce Certified AI Associate'     : 'https://dragonslayer.salesforce.com/resource/1666125682000/AIAssociate',
    'Salesforce Certified AI Specialist'    : 'https://dragonslayer.salesforce.com/resource/1666125682000/AISpecialist',
};

// Fallback emoji per cert when image fails to load
const CERT_EMOJI_FALLBACK = {
    'Administrator'  : '🛡️',
    'Developer'      : '⚡',
    'Data Cloud'     : '📦',
    'App Builder'    : '🏗️',
    'AI Associate'   : '🤖',
    'Agentforce Specialist'  : '🧠',
};

const CATEGORY_COLORS = {
    'Languages'      : '#FF6B6B',
    'Salesforce'     : '#0070D2',
    'Integration'    : '#9B59B6',
    'DevOps'         : '#27AE60',
    'Database'       : '#E67E22',
    'Tools'          : '#16A085',
};

export default class PortfolioSkillsCerts extends LightningElement {

    // ── Tab state ──────────────────────────────────────────────
    @track activeTab    = 'skills';   // 'skills' | 'certs'

    // ── Skills state ───────────────────────────────────────────
    _skills             = null;
    @track skillsError  = false;
    @track activeCategory = 'all';

    // ── Certs state ────────────────────────────────────────────
    _certs              = null;
    @track certsError   = false;

    // ── Wire: Skills ───────────────────────────────────────────
    @wire(getSkills)
    wiredSkills({ error, data }) {
        if (data)  { this._skills = data; this.skillsError = false; }
        if (error) { this.skillsError = true; }
    }

    // ── Wire: Certifications ───────────────────────────────────
    @wire(getCertifications)
    wiredCerts({ error, data }) {
        if (data)  { this._certs = data; this.certsError = false; }
        if (error) { this.certsError = true; }
    }

    // ── Tab getters ────────────────────────────────────────────
    get isSkillsActive() { return this.activeTab === 'skills'; }
    get isCertsActive()  { return this.activeTab === 'certs';  }

    get skillsTabClass() {
        return this.activeTab === 'skills' ? 'tab-btn tab-btn--active' : 'tab-btn';
    }
    get certsTabClass() {
        return this.activeTab === 'certs' ? 'tab-btn tab-btn--active' : 'tab-btn';
    }

    // ── Loading getters ────────────────────────────────────────
    get skillsLoading() { return this._skills === null && !this.skillsError; }
    get certsLoading()  { return this._certs  === null && !this.certsError;  }

    // ── Skills getters ─────────────────────────────────────────
    get categories() {
        if (!this._skills) return [];
        const cats = [...new Set(this._skills.map(s => s.Category__c))];
        return cats.map((c, i) => ({
            id       : i,
            name     : c,
            pillClass: this.activeCategory === c ? 'cat-pill cat-pill--active' : 'cat-pill',
            pillStyle: this.activeCategory === c
                ? `background:${CATEGORY_COLORS[c] || '#0070D2'};color:white;border-color:${CATEGORY_COLORS[c] || '#0070D2'}`
                : `border-color:${CATEGORY_COLORS[c] || '#0070D2'};color:${CATEGORY_COLORS[c] || '#0070D2'}`
        }));
    }

    get allPillClass() {
        return this.activeCategory === 'all' ? 'cat-pill cat-pill--active cat-pill--all' : 'cat-pill cat-pill--all';
    }

    get filteredSkills() {
        if (!this._skills) return [];
        const src = this.activeCategory === 'all'
            ? this._skills
            : this._skills.filter(s => s.Category__c === this.activeCategory);
        return src.map(s => {
            const color = CATEGORY_COLORS[s.Category__c] || '#0070D2';
            const pct   = s.Proficiency_Percent__c || 80;
            return {
                ...s,
                cardStyle: `border-left: 3px solid ${color}`,
                catStyle : `color: ${color}; background: ${color}22`,
                pctStyle : `color: ${color}`,
                barStyle : `width: ${pct}%; background: linear-gradient(90deg, ${color}99, ${color})`
            };
        });
    }

    // ── Certifications getter ──────────────────────────────────
    get certifications() {
        if (!this._certs) return [];
        return this._certs.map(c => {
            const color = c.Badge_Color__c || '#0070D2';
            return {
                ...c,
                stripStyle : `background: linear-gradient(90deg, ${color}, ${color}88)`,
                logoBgStyle: `background: ${color}11; border-color: ${color}33`,
            };
        });
    }

    // ── Tab actions ────────────────────────────────────────────
    switchToSkills() { this.activeTab = 'skills'; }
    switchToCerts()  { this.activeTab = 'certs';  }

    // ── Category filter ────────────────────────────────────────
    filterAll()      { this.activeCategory = 'all'; }
    filterCategory(event) {
        this.activeCategory = event.currentTarget.dataset.cat;
    }

    // ── Cert logo fallback ─────────────────────────────────────
    handleLogoError(event) {
        // Replace broken img with emoji fallback text
        const img      = event.target;
        const certName = img.dataset.fallback || '';
        const match    = Object.keys(CERT_EMOJI_FALLBACK).find(k => certName.includes(k));
        const emoji    = match ? CERT_EMOJI_FALLBACK[match] : '🎓';
        const span     = document.createElement('span');
        span.textContent   = emoji;
        span.style.cssText = 'font-size:2.5rem;line-height:1;';
        img.parentNode.replaceChild(span, img);
    }
}