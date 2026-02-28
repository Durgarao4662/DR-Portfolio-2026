import { LightningElement, api, track } from 'lwc';

// How long (ms) to show the tooltip before auto-dismissing
const TOOLTIP_DELAY = 6000;

export default class PortfolioAgentWidget extends LightningElement {

    // ── Experience Builder configurable properties ──
    @api agentName    = "Ask Durgarao's AI";
    @api welcomeHint  = "Ask me about Durgarao's projects & skills!";
    @api showOnMobile = false;

    // ── Internal reactive state ──
    @track isChatOpen   = false;
    @track showTooltip  = false;
    @track unreadCount  = 0;
    @track isAnimating  = false;

    _tooltipTimer   = null;
    _esBootstrap    = null;   // ref to embeddedservice_bootstrap

    // ── Lifecycle ────────────────────────────────────────
    connectedCallback() {
        // Initialize embedded service
        this._initializeEmbeddedService();

        // Show tooltip after 3s to grab visitor attention
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._tooltipTimer = setTimeout(() => {
            this.showTooltip = true;
        }, 3000);

        // Auto-dismiss tooltip after TOOLTIP_DELAY
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.showTooltip = false;
        }, 3000 + TOOLTIP_DELAY);

        // Listen for Salesforce Embedded Service events
        this._bindEmbeddedServiceEvents();
    }

    disconnectedCallback() {
        if (this._tooltipTimer) clearTimeout(this._tooltipTimer);
        this._unbindEmbeddedServiceEvents();
    }

    _initializeEmbeddedService() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://orgfarm-6f60ea26fe-dev-ed.develop.my.salesforce.com/embeddedservice/menu/fab.min.js';
        script.onload = () => {
            window.initESW = (gslbBaseURL) => {
                if (window.embedded_svc && window.embedded_svc.menu) {
                    window.embedded_svc.menu.settings.scrt2BaseUrl = 'https://orgfarm-6f60ea26fe-dev-ed.develop.my.salesforce-scrt.com';
                    window.embedded_svc.menu.init(
                        'https://orgfarm-6f60ea26fe-dev-ed.develop.my.salesforce.com',
                        'https://d.la11-core1.sfdc-8tgtt5.salesforceliveagent.com/chat',
                        gslbBaseURL,
                        '00Dfj00000F2Vv7',
                        'Portfolio_Chat'
                    );
                }
            };
            window.initESW(null);
        };
        document.body.appendChild(script);
    }

    // ── Computed getters ─────────────────────────────────
    get fabClass() {
        let cls = 'agent-fab';
        if (this.isChatOpen)  cls += ' agent-fab--open';
        if (this.isAnimating) cls += ' agent-fab--bounce';
        return cls;
    }

    get fabAriaLabel() {
        return this.isChatOpen
            ? 'Close AI assistant chat'
            : `Open ${this.agentName}`;
    }

    get showBotIcon()  { return !this.isChatOpen; }
    get showPulse()    { return !this.isChatOpen; }
    get hasUnread()    { return this.unreadCount > 0; }
    get unreadLabel()  { return `${this.unreadCount} unread messages`; }

    // ── User actions ─────────────────────────────────────
    toggleChat() {
        this.showTooltip = false;
        this.isAnimating = true;

        // Trigger the Salesforce Embedded Service API
        if (typeof embeddedservice_bootstrap !== 'undefined') {
            if (this.isChatOpen) {
                embeddedservice_bootstrap.utilAPI.closeChat();
            } else {
                embeddedservice_bootstrap.utilAPI.launchChat();
                this.unreadCount = 0; // clear badge on open
            }
        }

        this.isChatOpen = !this.isChatOpen;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => { this.isAnimating = false; }, 400);
    }

    dismissTooltip() {
        this.showTooltip = false;
        if (this._tooltipTimer) clearTimeout(this._tooltipTimer);
    }

    // ── Embedded Service event binding ───────────────────
    _bindEmbeddedServiceEvents() {
        // Wait for embeddedservice_bootstrap to be available
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        const poll = setInterval(() => {
            if (typeof embeddedservice_bootstrap !== 'undefined') {
                clearInterval(poll);
                this._esBootstrap = embeddedservice_bootstrap;
                this._attachListeners();
            }
        }, 500);
    }

    _attachListeners() {
        // Chat window opened by Salesforce API
        window.addEventListener('onEmbeddedMessagingWindowOpened', () => {
            this.isChatOpen  = true;
            this.unreadCount = 0;
        });

        // Chat window closed
        window.addEventListener('onEmbeddedMessagingWindowClosed', () => {
            this.isChatOpen = false;
        });

        // New message received while window is closed — increment badge
        window.addEventListener('onEmbeddedMessagingNewMessageReceived', () => {
            if (!this.isChatOpen) {
                this.unreadCount += 1;
            }
        });
    }

    _unbindEmbeddedServiceEvents() {
        window.removeEventListener('onEmbeddedMessagingWindowOpened', () => {});
        window.removeEventListener('onEmbeddedMessagingWindowClosed', () => {});
        window.removeEventListener('onEmbeddedMessagingNewMessageReceived', () => {});
    }
}
