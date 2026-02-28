// portfolioAchievements.js
import { LightningElement, wire, track } from 'lwc';
import getAchievements from '@salesforce/apex/PortfolioAchievementsController.getAchievements';

// Category constants — must match Picklist values in org
const CAT_AWARD       = 'Award';
const CAT_CERTIFICATE = 'Certificate';
const CAT_GOODIE      = 'Goodie';

const FILTER_ALL   = 'all';
const FILTER_MAP   = {
    all        : 'All',
    Award      : 'Awards',
    Certificate: 'Certifications',
    Goodie     : 'Goodies',
};

const FILTER_ICONS = {
    all        : '✦',
    Award      : '🏆',
    Certificate: '🎓',
    Goodie     : '🎁',
};

// Default card colour when Badge_Color__c is empty
const DEFAULT_COLOR = '#B8860B';

export default class PortfolioAchievements extends LightningElement {

    // ── Wire data ──────────────────────────────────────────────
    _rawData  = null;
    _wireError = null;

    @wire(getAchievements)
    wiredData({ data, error }) {
        if (data)  { this._rawData = data;  this._wireError = null; }
        if (error) { this._wireError = error; this._rawData = null; }
    }

    // ── Active filter ──────────────────────────────────────────
    @track activeFilter = FILTER_ALL;

    // ── State getters ──────────────────────────────────────────
    get isLoading() { return this._rawData === null && this._wireError === null; }
    get hasError()  { return this._wireError !== null; }
    get hasData()   { return this._rawData !== null && this._rawData.length > 0; }

    // ── Enriched data (add CSS variables per record) ───────────
    get _enriched() {
        if (!this._rawData) return [];
        return this._rawData.map(r => {
            const color = r.Badge_Color__c || DEFAULT_COLOR;
            return {
                ...r,
                cardVars   : `--accent:${color};--accent-dim:${color}22;--accent-glow:${color}44`,
                compactVars: `--accent:${color}`,
            };
        });
    }

    // ── Category-split arrays ──────────────────────────────────
    get _awards()       { return this._enriched.filter(r => r.Category__c === CAT_AWARD); }
    get _certificates() { return this._enriched.filter(r => r.Category__c === CAT_CERTIFICATE); }
    get _goodies()      { return this._enriched.filter(r => r.Category__c === CAT_GOODIE); }

    // ── Featured / regular split ───────────────────────────────
    get featuredAwards()  { return this._awards.filter(r => r.Is_Featured__c); }
    get regularAwards()   { return this._awards.filter(r => !r.Is_Featured__c); }
    get hasFeatured()     { return this.featuredAwards.length > 0; }
    get hasRegularAwards(){ return this.regularAwards.length > 0; }

    get certificates()    { return this._certificates; }
    get goodies()         { return this._goodies; }

    // ── Section visibility (driven by active filter) ───────────
    get showAwards()      { return this.activeFilter === FILTER_ALL || this.activeFilter === CAT_AWARD; }
    get showCertificates(){ return this.activeFilter === FILTER_ALL || this.activeFilter === CAT_CERTIFICATE; }
    get showGoodies()     { return this.activeFilter === FILTER_ALL || this.activeFilter === CAT_GOODIE; }

    // ── Summary stats shown in header ribbon ──────────────────
    get summaryStats() {
        return [
            { id: 1, icon: '🏆', value: this._awards.length,       label: 'Awards'       },
            { id: 2, icon: '🎓', value: this._certificates.length,  label: 'Certifications'},
            { id: 3, icon: '🎁', value: this._goodies.length,       label: 'Goodies'      },
            { id: 4, icon: '📅', value: this._yearSpan(),           label: 'Years Active' },
        ];
    }

    _yearSpan() {
        if (!this._rawData || this._rawData.length === 0) return '—';
        const years = this._rawData
            .map(r => parseInt(r.Year__c, 10))
            .filter(y => !isNaN(y));
        if (years.length === 0) return '—';
        const min = Math.min(...years);
        const max = Math.max(...years);
        return min === max ? String(min) : `${min}–${max}`;
    }

    // ── Filter tabs ────────────────────────────────────────────
    get filterTabs() {
        const counts = {
            all        : this._enriched.length,
            Award      : this._awards.length,
            Certificate: this._certificates.length,
            Goodie     : this._goodies.length,
        };
        return Object.keys(FILTER_MAP).map(key => ({
            id      : key,
            label   : FILTER_MAP[key],
            icon    : FILTER_ICONS[key],
            count   : counts[key],
            isActive: this.activeFilter === key,
            btnClass: this.activeFilter === key
                ? 'filter-tab filter-tab--active'
                : 'filter-tab',
        }));
    }

    // ── Filter action ──────────────────────────────────────────
    setFilter(event) {
        this.activeFilter = event.currentTarget.dataset.filter;
    }
}