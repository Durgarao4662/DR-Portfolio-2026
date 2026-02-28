// sfQuiz.js
import { LightningElement, track } from 'lwc';

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = {
    admin: [
        { text: 'Which Salesforce feature allows you to automate business processes without code?', options: ['Apex Trigger', 'Flow Builder', 'SOQL Query', 'Visualforce'], answer: 1, difficulty: 'easy' },
        { text: 'What is the maximum number of custom objects in a Developer Edition org?', options: ['200', '400', '100', '50'], answer: 2, difficulty: 'medium' },
        { text: 'Which profile permission allows a user to log in as another user?', options: ['Manage Users', 'Modify All Data', 'Login As', 'View All Users'], answer: 0, difficulty: 'hard' },
        { text: 'What does OWD stand for in Salesforce sharing?', options: ['Object Wide Default', 'Org-Wide Default', 'Owner Wide Data', 'Object Write Default'], answer: 1, difficulty: 'easy' },
        { text: 'Which field type stores up to 131,072 characters?', options: ['Text Area', 'Rich Text Area', 'Long Text Area', 'Text Area (Large)'], answer: 2, difficulty: 'medium' },
        { text: 'How many active flows can a single object trigger at one time?', options: ['5', '10', 'Unlimited', '1'], answer: 2, difficulty: 'hard' },
        { text: 'What is a Junction Object used for?', options: ['Many-to-many relationships', 'One-to-one relationships', 'Storing binary data', 'External data access'], answer: 0, difficulty: 'easy' },
        { text: 'Which tool is used to deploy metadata between orgs?', options: ['Data Loader', 'SFDX CLI', 'Workbench', 'All of the above'], answer: 3, difficulty: 'medium' },
    ],
    apex: [
        { text: 'What is the governor limit for SOQL queries per transaction?', options: ['50', '100', '200', '150'], answer: 1, difficulty: 'medium' },
        { text: 'Which keyword makes an Apex method accessible via REST API?', options: ['@AuraEnabled', '@RestResource', '@RemoteAction', '@HttpGet'], answer: 1, difficulty: 'hard' },
        { text: 'What does the "with sharing" keyword enforce in Apex?', options: ['CRUD permissions', 'Record-level sharing rules', 'Field-level security', 'Object permissions'], answer: 1, difficulty: 'medium' },
        { text: 'How many DML statements are allowed per Apex transaction?', options: ['100', '200', '150', '50'], answer: 2, difficulty: 'easy' },
        { text: 'Which Apex class is used for HTTP callouts?', options: ['RestClient', 'HttpRequest', 'WebService', 'CalloutClass'], answer: 1, difficulty: 'easy' },
        { text: 'What is a "future" method used for in Apex?', options: ['Scheduled jobs', 'Asynchronous processing', 'Batch processing', 'Queueable jobs'], answer: 1, difficulty: 'medium' },
        { text: 'Which annotation makes an Apex method available to Lightning components?', options: ['@RemoteAction', '@InvocableMethod', '@AuraEnabled', '@JavascriptRemoting'], answer: 2, difficulty: 'easy' },
        { text: 'What is the maximum heap size in a synchronous Apex transaction?', options: ['3 MB', '6 MB', '12 MB', '24 MB'], answer: 1, difficulty: 'hard' },
    ],
    lwc: [
        { text: 'Which decorator is used to expose a component property to a parent component?', options: ['@track', '@wire', '@api', '@expose'], answer: 2, difficulty: 'easy' },
        { text: 'Which lifecycle hook fires after the component is inserted into the DOM?', options: ['constructor()', 'connectedCallback()', 'renderedCallback()', 'disconnectedCallback()'], answer: 1, difficulty: 'easy' },
        { text: 'How do you access a DOM element with lwc:ref in LWC?', options: ['this.template.querySelector()', 'this.refs.refName', 'document.getElementById()', 'this.template.ref()'], answer: 1, difficulty: 'medium' },
        { text: 'Which directive replaced if:true in API version 59+?', options: ['lwc:show', 'lwc:visible', 'lwc:if', 'lwc:condition'], answer: 2, difficulty: 'medium' },
        { text: 'What does the @wire decorator do?', options: ['Makes properties reactive', 'Exposes props to parent', 'Fetches data reactively', 'Defines event handlers'], answer: 2, difficulty: 'easy' },
        { text: 'Which event propagation does LWC use by default?', options: ['Bubbles through shadow DOM', 'Stops at shadow boundary', 'Broadcasts globally', 'Tunnels down'], answer: 1, difficulty: 'hard' },
        { text: 'What is the correct way to import a static resource in LWC?', options: ["import myRes from 'staticResource'", "@salesforce/resourceUrl/name", "import name from '@salesforce/resourceUrl/name'", "require('@static/name')"], answer: 2, difficulty: 'medium' },
        { text: 'What does lwc:spread do?', options: ['Spreads child components', 'Passes object properties as attributes', 'Enables CSS inheritance', 'Distributes slots'], answer: 1, difficulty: 'hard' },
    ],
    integration: [
        { text: 'Which Salesforce tool is used to connect external databases to Salesforce?', options: ['Salesforce Connect', 'Data Loader', 'MuleSoft', 'External Services'], answer: 0, difficulty: 'medium' },
        { text: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Entity Service Template', 'Remote Entity State Transfer'], answer: 1, difficulty: 'easy' },
        { text: 'Which HTTP method is idempotent and used for full resource updates?', options: ['POST', 'PATCH', 'PUT', 'GET'], answer: 2, difficulty: 'medium' },
        { text: 'What is the Salesforce Bulk API best suited for?', options: ['Real-time integrations', 'Large data volumes', 'UI updates', 'Authentication'], answer: 1, difficulty: 'easy' },
        { text: 'Which authentication flow is recommended for server-to-server integrations?', options: ['Username-Password Flow', 'JWT Bearer Flow', 'Web Server Flow', 'Device Flow'], answer: 1, difficulty: 'hard' },
        { text: 'What is a Named Credential used for?', options: ['Storing user passwords', 'Authenticating external callouts', 'API versioning', 'Custom labels'], answer: 1, difficulty: 'medium' },
        { text: 'What does SOAP stand for?', options: ['Simple Object Access Protocol', 'Serialized Object API Pattern', 'Service Oriented API Protocol', 'Standard Output API Provider'], answer: 0, difficulty: 'easy' },
        { text: 'Platform Events in Salesforce are based on which messaging pattern?', options: ['Request-Response', 'Publish-Subscribe', 'Point-to-Point', 'Queue-based'], answer: 1, difficulty: 'hard' },
    ],
};

const CATEGORIES = [
    { id: 'admin',       name: 'Admin',       icon: '🛡️', color: '#0070D2', count: 8 },
    { id: 'apex',        name: 'Apex',        icon: '⚡', color: '#FF6B6B', count: 8 },
    { id: 'lwc',         name: 'LWC',         icon: '⚙️', color: '#9B59B6', count: 8 },
    { id: 'integration', name: 'Integration', icon: '🔗', color: '#27AE60', count: 8 },
];

const BADGES = [
    { id: 1, icon: '🎯', name: 'Sharp Shooter',  condition: (c, t) => c === t },
    { id: 2, icon: '🔥', name: 'On Fire',         condition: (c, _, streak) => streak >= 3 },
    { id: 3, icon: '⚡', name: 'Lightning Fast',  condition: (c, t) => c >= Math.ceil(t * 0.8) },
    { id: 4, icon: '🏆', name: 'Champion',        condition: (c, t) => c === t && t > 5 },
    { id: 5, icon: '💎', name: 'Diamond Mind',    condition: (c, t) => c >= Math.ceil(t * 0.9) },
];

const TIMER_SECONDS = { easy: 30, medium: 20, hard: 15 };
const SCORE_MAP     = { easy: 10, medium: 20, hard: 30 };
const CIRCUMFERENCE = 2 * Math.PI * 34;  // timer ring

export default class SfQuiz extends LightningElement {

    // ── Screen state ──────────────────────────────────────────────
    @track showStart    = true;
    @track showQuestion = false;
    @track showResults  = false;

    // ── Config ───────────────────────────────────────────────────
    @track selectedCategory = 'admin';
    @track difficulty       = 'medium';

    // ── Game state ───────────────────────────────────────────────
    @track qIndex      = 0;
    @track score       = 0;
    @track timeLeft    = 20;
    @track answered    = false;
    @track selectedIdx = -1;
    @track correctCount = 0;
    @track wrongCount   = 0;
    @track streak       = 0;
    @track streakBest   = 0;
    @track earnedBadges = [];

    _questions   = [];
    _timer       = null;
    _feedbackCorrect = false;

    // ── Start Screen ──────────────────────────────────────────────
    get categories() {
        return CATEGORIES.map(c => ({
            ...c,
            btnClass   : this.selectedCategory === c.id ? 'cat-btn cat-btn--active' : 'cat-btn',
            accentStyle: this.selectedCategory === c.id
                ? `border-color:${c.color};background:${c.color}22;--cat-color:${c.color}`
                : `--cat-color:${c.color}`,
        }));
    }

    get easyClass()   { return this.difficulty === 'easy'   ? 'diff-btn diff-btn--active' : 'diff-btn'; }
    get mediumClass() { return this.difficulty === 'medium' ? 'diff-btn diff-btn--active' : 'diff-btn'; }
    get hardClass()   { return this.difficulty === 'hard'   ? 'diff-btn diff-btn--active' : 'diff-btn'; }

    selectCategory(e) { this.selectedCategory = e.currentTarget.dataset.id; }
    setEasy()         { this.difficulty = 'easy'; }
    setMedium()       { this.difficulty = 'medium'; }
    setHard()         { this.difficulty = 'hard'; }

    startQuiz() {
        const pool = QUESTIONS[this.selectedCategory]
            .filter(q => this.difficulty === 'medium' || q.difficulty === this.difficulty)
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
        this._questions  = pool;
        this.qIndex      = 0;
        this.score       = 0;
        this.correctCount= 0;
        this.wrongCount  = 0;
        this.streak      = 0;
        this.streakBest  = 0;
        this.earnedBadges= [];
        this.showStart   = false;
        this.showQuestion= true;
        this._loadQuestion();
    }

    // ── Question Screen ───────────────────────────────────────────
    get questionCounter() { return `${this.qIndex + 1} / ${this._questions.length}`; }
    get progressStyle()   { return `width:${((this.qIndex + 1) / this._questions.length) * 100}%`; }
    get maxScore()        { return this._questions.length * SCORE_MAP[this.difficulty]; }

    get currentQuestion() { return this._questions[this.qIndex] || {}; }

    get currentCategory() {
        const cat = CATEGORIES.find(c => c.id === this.selectedCategory);
        return cat ? `${cat.icon} ${cat.name}` : '';
    }
    get catTagStyle() {
        const cat = CATEGORIES.find(c => c.id === this.selectedCategory);
        return cat ? `background:${cat.color}22;color:${cat.color};border-color:${cat.color}44` : '';
    }

    get currentOptions() {
        const q   = this.currentQuestion;
        if (!q.options) return [];
        const letters = ['A', 'B', 'C', 'D'];
        return q.options.map((text, idx) => {
            let cls = 'opt-btn';
            if (this.answered) {
                if (idx === q.answer)           cls += ' opt-btn--correct';
                else if (idx === this.selectedIdx) cls += ' opt-btn--wrong';
                else                             cls += ' opt-btn--dim';
            }
            return {
                id         : idx,
                idx,
                text,
                letter     : letters[idx],
                btnClass   : cls,
                showCorrect: this.answered && idx === q.answer,
                showWrong  : this.answered && idx === this.selectedIdx && idx !== q.answer,
            };
        });
    }

    // Timer ring math
    get timerArcStyle() {
        const total  = TIMER_SECONDS[this.difficulty];
        const frac   = this.timeLeft / total;
        const offset = CIRCUMFERENCE * (1 - frac);
        const color  = frac > 0.5 ? '#00A1E0' : frac > 0.25 ? '#FFD700' : '#FF6B6B';
        return `stroke-dasharray:${CIRCUMFERENCE};stroke-dashoffset:${offset};stroke:${color};transition:stroke-dashoffset 1s linear,stroke 0.5s`;
    }
    get timerNumStyle() {
        const frac = this.timeLeft / TIMER_SECONDS[this.difficulty];
        return frac <= 0.25 ? 'color:#FF6B6B' : frac <= 0.5 ? 'color:#FFD700' : 'color:#E8F4FF';
    }

    get feedbackClass() { return this._feedbackCorrect ? 'feedback feedback--correct' : 'feedback feedback--wrong'; }
    get feedbackIcon()  { return this._feedbackCorrect ? '🎉' : '💡'; }
    get feedbackText()  { return this._feedbackCorrect ? `+${SCORE_MAP[this.difficulty]} pts — Correct!` : `Correct answer: ${this.currentQuestion.options?.[this.currentQuestion.answer]}`; }
    get nextLabel()     { return this.qIndex + 1 >= this._questions.length ? 'Results' : 'Next'; }

    _loadQuestion() {
        this.answered    = false;
        this.selectedIdx = -1;
        this.timeLeft    = TIMER_SECONDS[this.difficulty];
        this._startTimer();
    }

    _startTimer() {
        this._stopTimer();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._timer = setInterval(() => {
            this.timeLeft -= 1;
            if (this.timeLeft <= 0) {
                this._stopTimer();
                this._handleTimeout();
            }
        }, 1000);
    }

    _stopTimer() {
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }

    _handleTimeout() {
        this.answered        = true;
        this.selectedIdx     = -1;
        this._feedbackCorrect= false;
        this.wrongCount     += 1;
        this.streak          = 0;
    }

    selectAnswer(e) {
        if (this.answered) return;
        this._stopTimer();
        const idx = Number(e.currentTarget.dataset.idx);
        this.selectedIdx = idx;
        this.answered    = true;
        const correct    = idx === this.currentQuestion.answer;
        this._feedbackCorrect = correct;
        if (correct) {
            this.score       += SCORE_MAP[this.difficulty] + Math.ceil(this.timeLeft * 0.5);
            this.correctCount+= 1;
            this.streak      += 1;
            if (this.streak > this.streakBest) this.streakBest = this.streak;
        } else {
            this.wrongCount += 1;
            this.streak      = 0;
        }
    }

    nextQuestion() {
        if (this.qIndex + 1 >= this._questions.length) {
            this._endQuiz();
        } else {
            this.qIndex += 1;
            this._loadQuestion();
        }
    }

    // ── Results Screen ────────────────────────────────────────────
    get scorePercent()  { return this._questions.length ? Math.round((this.correctCount / this._questions.length) * 100) : 0; }
    get trophyEmoji()   { return this.scorePercent === 100 ? '🏆' : this.scorePercent >= 80 ? '🥇' : this.scorePercent >= 60 ? '🥈' : this.scorePercent >= 40 ? '🥉' : '💪'; }
    get resultTitle()   { return this.scorePercent === 100 ? 'Perfect Score!' : this.scorePercent >= 80 ? 'Outstanding!' : this.scorePercent >= 60 ? 'Well Done!' : this.scorePercent >= 40 ? 'Good Effort!' : 'Keep Practising!'; }
    get resultSub()     { return `You answered ${this.correctCount} of ${this._questions.length} questions correctly`; }

    get scoreRingStyle() {
        const circ   = 2 * Math.PI * 58;
        const offset = circ * (1 - this.scorePercent / 100);
        const color  = this.scorePercent >= 80 ? '#00A1E0' : this.scorePercent >= 60 ? '#FFD700' : '#FF6B6B';
        return `stroke-dasharray:${circ};stroke-dashoffset:${offset};stroke:${color}`;
    }

    _endQuiz() {
        this._stopTimer();
        // Evaluate badges
        this.earnedBadges = BADGES.filter(b =>
            b.condition(this.correctCount, this._questions.length, this.streakBest)
        );
        this.showQuestion = false;
        this.showResults  = true;
    }

    restartQuiz() {
        this.showResults = false;
        this.startQuiz();
    }

    goHome() {
        this._stopTimer();
        this.showQuestion= false;
        this.showResults = false;
        this.showStart   = true;
    }

    disconnectedCallback() { this._stopTimer(); }
}