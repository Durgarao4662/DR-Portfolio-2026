import { LightningElement, wire, track } from 'lwc';
import getProjects from '@salesforce/apex/PortfolioProjectController.getProjects';

export default class PortfolioProjects extends LightningElement {

    @wire(getProjects)
    wiredProjects({ error, data }) {
        if (data) {
            this._projects = data;
            this._error = null;
        } else if (error) {
            this._error = error;
            this._projects = null;
        }
    }

    @track expandedId = null;
    _projects = null;
    _error = null;

    // ── State getters for lwc:if / lwc:elseif ──
    get isLoading() {
        return this._projects === null && this._error === null;
    }

    get hasError() {
        return this._error !== null;
    }

    get hasProjects() {
        return this._projects !== null && this._projects.length > 0;
    }

    // ── Map raw metadata records into view-model cards ──
    get projectCards() {
        if (!this._projects) return [];

        return this._projects.map(p => {
            const accentColor = p.Accent_Color__c || '#0070D2';
            const isExpanded  = p.Id === this.expandedId;

            return {
                ...p,
                isExpanded,
                expandIcon  : isExpanded ? '▲' : '▼',
                techTags    : this._parseTechTags(p.Technologies_Used__c),
                accentStyle : `border-left: 5px solid ${accentColor}`,
                logoStyle   : `background: ${accentColor}`,
                tagStyle    : `border-color: ${accentColor}; color: ${accentColor}`
            };
        });
    }

    // ── Toggle accordion expand / collapse ──
    toggleCard(event) {
        const id = event.currentTarget.dataset.id;
        this.expandedId = (this.expandedId === id) ? null : id;
    }

    // ── Helper: split comma-separated tech string into tag objects ──
    _parseTechTags(techString) {
        if (!techString) return [];
        return techString
            .split(',')
            .map((t, i) => ({ id: i, label: t.trim() }))
            .filter(t => t.label.length > 0);
    }
}