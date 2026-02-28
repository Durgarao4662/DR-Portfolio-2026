// portfolioHero.js
import { LightningElement, api } from 'lwc';
import profileImage from '@salesforce/resourceUrl/durgarao_image';
import resumeFile   from '@salesforce/resourceUrl/Durgarao_Resume';

export default class PortfolioHero extends LightningElement {

    @api profileName    = 'Durgarao Telagareddi';
    @api profileTitle   = 'Senior Salesforce Developer';
    @api yearsExp       = 6;
    @api location       = 'Hyderabad, India';
    @api email          = 'tmdurgarao@gmail.com';
    @api profileSummary = 'Results-driven Senior Salesforce Developer with 6+ years of hands-on experience designing and delivering enterprise-grade Salesforce solutions across global clients. Proficient in Apex, Lightning Web Components, Sales Cloud, Service Cloud, and Salesforce integrations. Proven track record leading end-to-end implementations across EMEA and APAC regions.';

    profileImageUrl = profileImage;
    resumeUrl       = resumeFile;

    stats = [
        { id: 1, value: '6+',  label: 'Years Exp'     },
        { id: 2, value: '10+', label: 'Projects'       },
        { id: 3, value: '6',   label: 'Certifications' },
        { id: 4, value: '5',   label: 'Global Clients' },
    ];

    connectedCallback() {
        setTimeout(() => this._typewriter(), 300);
    }

    _typewriter() {
        const fullText = this.profileName;
        let index = 0;
        const el = this.template.querySelector('.hero-name');
        if (!el) return;
        el.textContent = '';
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        const iv = setInterval(() => {
            el.textContent = fullText.slice(0, ++index);
            if (index >= fullText.length) clearInterval(iv);
        }, 72);
    }
}