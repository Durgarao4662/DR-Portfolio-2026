import { LightningElement, api, track } from 'lwc';

export default class PortfolioSocials extends LightningElement {
    @api linkedInUrl  = 'https://www.linkedin.com/in/durgarao-telagareddi-052238134';
    @api trailheadUrl = 'https://www.salesforce.com/trailblazer/dtelagareddi';
    @api instagramUrl = 'https://instagram.com/durgarao_telagareddy';

    get socialCards() {
        return [
            {
                id: 'linkedin',
                platform: 'LinkedIn',
                icon: '💼',
                handle: '@durgarao-telagareddi-052238134',
                description: 'Professional network, recommendations & career journey',
                cta: 'View Profile',
                url: this.linkedInUrl,
                cardStyle: 'background: linear-gradient(145deg,#0077B5 0%,#005582 100%)',
                iconRingStyle: 'border-color: rgba(255,255,255,0.4)',
                btnStyle: 'background: white; color: #0077B5'
            },
            {
                id: 'trailhead',
                platform: 'Trailhead',
                icon: '🏆',
                handle: '@dtelagareddi',
                description: '6 Certifications, Superbadges & Trailblazer journey',
                cta: 'See Badges',
                url: this.trailheadUrl,
                cardStyle: 'background: linear-gradient(145deg,#032D60 0%,#0070D2 100%)',
                iconRingStyle: 'border-color: rgba(255,255,255,0.4)',
                btnStyle: 'background: white; color: #032D60'
            },
            {
                id: 'instagram',
                platform: 'Instagram',
                icon: '📸',
                handle: '@durgarao_telagareddy',
                description: 'Behind-the-scenes, tech talks & Salesforce community',
                cta: 'Follow Me',
                url: this.instagramUrl,
                cardStyle: 'background: linear-gradient(145deg,#833AB4,#FD1D1D,#FCAF45)',
                iconRingStyle: 'border-color: rgba(255,255,255,0.4)',
                btnStyle: 'background: white; color: #833AB4'
            }
        ];
    }

    trackClick(event) {
        const platform = event.currentTarget.dataset.platform;
        console.log(`Social click: ${platform}`);
        // Optionally fire a custom event for analytics tracking
        this.dispatchEvent(new CustomEvent('socialclick', {
            detail: { platform }, bubbles: true
        }));
    }
}
