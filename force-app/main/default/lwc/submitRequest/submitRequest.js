// submitRequest.js
import { LightningElement, track } from 'lwc';
import submitRequest from '@salesforce/apex/SubmitRequestController.submitRequest';

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORBIT_MS  = 2200;   // how long the rocket orbits before closing

export default class SubmitRequest extends LightningElement {

    // ── UI state ────────────────────────────────────────────
    @track showModal      = false;
    @track showRocket     = false;
    @track isSending      = false;

    // ── Form values ─────────────────────────────────────────
    @track requestType = '';
    @track email       = '';
    @track comment     = '';

    // ── Validation errors ────────────────────────────────────
    @track typeErr    = '';
    @track emailErr   = '';
    @track submitErr  = '';

    // ── Static options ───────────────────────────────────────
    typeOptions = [
        { v: 'Hiring', l: '💼 Hiring'  },
        { v: 'Help Request', l: '🎓 Help Request'   },
        { v: 'Referral',    l: '🤝 Referral'      },
        { v: 'Other',       l: '💬 Other'         },
    ];

    // ── Computed getters ─────────────────────────────────────
    get charCount() { return (this.comment || '').length; }

    get typeShellStyle() {
        if (this.typeErr)      return '--shell-border:#E74C3C;--shell-glow:rgba(231,76,60,0.2)';
        if (this.requestType)  return '--shell-border:#27AE60;--shell-glow:rgba(39,174,96,0.15)';
        return '';
    }

    get emailShellStyle() {
        if (this.emailErr)                    return '--shell-border:#E74C3C;--shell-glow:rgba(231,76,60,0.2)';
        if (this.email && !this.emailErr)     return '--shell-border:#27AE60;--shell-glow:rgba(39,174,96,0.15)';
        return '';
    }

    get sendBtnClass() {
        return this.isSending ? 'send-btn send-btn--loading' : 'send-btn';
    }

    // ── Modal open / close ────────────────────────────────────
    openModal() {
        this._resetForm();
        this.showModal = true;
    }

    closeModal() {
        if (this.isSending) return;
        this.showModal = false;
        this._resetForm();
    }

    // ── Field handlers ────────────────────────────────────────
    onTypeChange(e) {
        this.requestType = e.target.value;
        this.typeErr     = this.requestType ? '' : 'Please select a request type.';
    }

    onEmailInput(e) {
        this.email    = e.target.value;
        this.emailErr = '';           // clear on typing
    }

    onEmailBlur() {
        this._validateEmailField();
    }

    onCommentInput(e) {
        this.comment = e.target.value;
    }

    _validateEmailField() {
        if (!this.email) {
            this.emailErr = 'Email address is required.';
        } else if (!EMAIL_RE.test(this.email)) {
            this.emailErr = 'Please enter a valid email address.';
        } else {
            this.emailErr = '';
        }
    }

    // ── Send ──────────────────────────────────────────────────
    onSend() {
        // Run all validations
        this.typeErr  = this.requestType ? '' : 'Please select a request type.';
        this._validateEmailField();

        if (this.typeErr || this.emailErr) return;

        this.isSending  = true;
        this.submitErr  = '';

        submitRequest({
            requestType: this.requestType,
            email      : this.email,
            comment    : this.comment,
        })
        .then(() => {
            this.isSending = false;
            this.showModal = false;     // close form
            this._launchRocket();       // 🚀 fire!
        })
        .catch(err => {
            this.isSending = false;
            this.submitErr = err?.body?.message || 'Something went wrong. Please try again.';
        });
    }

    // ── Rocket launch sequence ────────────────────────────────
    _launchRocket() {
        this.showRocket = true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.showRocket = false;
            this._resetForm();
        }, ORBIT_MS + 800);   // orbit time + fade-out buffer
    }

    // ── Helpers ───────────────────────────────────────────────
    _resetForm() {
        this.requestType = '';
        this.email       = '';
        this.comment     = '';
        this.typeErr     = '';
        this.emailErr    = '';
        this.submitErr   = '';
    }
}