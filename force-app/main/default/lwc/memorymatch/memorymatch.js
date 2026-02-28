// memoryMatch.js
import { LightningElement, track } from 'lwc';

// ── Salesforce-themed card pairs ──────────────────────────────────
const ALL_PAIRS = [
    { emoji: '☁️',  label: 'Sales Cloud'    },
    { emoji: '🛎️',  label: 'Service Cloud'  },
    { emoji: '📊',  label: 'Analytics'      },
    { emoji: '🤖',  label: 'Einstein AI'    },
    { emoji: '🔗',  label: 'Integration'    },
    { emoji: '🏗️',  label: 'App Builder'    },
    { emoji: '🔐',  label: 'Shield'         },
    { emoji: '🌐',  label: 'Exp Cloud'      },
    { emoji: '📦',  label: 'Data Cloud'     },
    { emoji: '⚡',  label: 'Flow Builder'   },
    { emoji: '🗄️',  label: 'Database'       },
    { emoji: '📱',  label: 'Mobile'         },
];

const EASY_PAIRS = 6;   // 12 cards — 4×3
const HARD_PAIRS = 8;   // 16 cards — 4×4

export default class MemoryMatch extends LightningElement {

    // ── Game state ────────────────────────────────────────────────
    @track cards        = [];
    @track moves        = 0;
    @track matchCount   = 0;
    @track gameWon      = false;
    @track seconds      = 0;
    @track difficulty   = 'easy';   // 'easy' | 'hard'

    // ── Internal (non-reactive) ───────────────────────────────────
    _flipped      = [];   // up to 2 card ids currently flipped
    _locked       = false;
    _timerRef     = null;
    _started      = false;

    // ── Lifecycle ─────────────────────────────────────────────────
    connectedCallback() {
        this._buildBoard();
    }

    disconnectedCallback() {
        this._stopTimer();
    }

    // ── Computed getters ──────────────────────────────────────────

    get totalPairs() {
        return this.difficulty === 'hard' ? HARD_PAIRS : EASY_PAIRS;
    }

    get formattedTime() {
        const m = Math.floor(this.seconds / 60);
        const s = this.seconds % 60;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    get starRating() {
        const pairs = this.totalPairs;
        const par   = pairs * 2;       // "par" moves
        if (this.moves <= par)          return '⭐⭐⭐';
        if (this.moves <= par * 1.5)    return '⭐⭐';
        return '⭐';
    }

    get easyBtnClass() {
        return this.difficulty === 'easy'
            ? 'diff-btn diff-btn--active'
            : 'diff-btn';
    }

    get hardBtnClass() {
        return this.difficulty === 'hard'
            ? 'diff-btn diff-btn--active'
            : 'diff-btn';
    }

    get confettiItems() {
        const colors = ['#FFD700','#0070D2','#00A1E0','#FF6B6B','#51CF66','#FF8C00'];
        return Array.from({ length: 30 }, (_, i) => ({
            id   : i,
            style: [
                `left:${Math.random()*100}%`,
                `top:${Math.random()*100}%`,
                `background:${colors[i % colors.length]}`,
                `width:${6 + Math.random()*8}px`,
                `height:${6 + Math.random()*8}px`,
                `animation-delay:${(Math.random()*0.8).toFixed(2)}s`,
                `animation-duration:${(0.6 + Math.random()*0.8).toFixed(2)}s`,
                `border-radius:${Math.random()>0.5?'50%':'2px'}`,
            ].join(';')
        }));
    }

    // ── User actions ──────────────────────────────────────────────

    handleCardClick(event) {
        if (this._locked || this.gameWon) return;

        const id   = Number(event.currentTarget.dataset.id);
        const card = this.cards.find(c => c.id === id);

        // Ignore already flipped or matched cards
        if (!card || card.isFlipped || card.isMatched) return;

        // Start timer on first flip
        if (!this._started) {
            this._started = true;
            this._startTimer();
        }

        // Flip the card
        this._flipCard(id, true);
        this._flipped.push(id);

        if (this._flipped.length === 2) {
            this.moves += 1;
            this._checkMatch();
        }
    }

    setEasy() {
        if (this.difficulty === 'easy') return;
        this.difficulty = 'easy';
        this._buildBoard();
    }

    setHard() {
        if (this.difficulty === 'hard') return;
        this.difficulty = 'hard';
        this._buildBoard();
    }

    restartGame() {
        this._buildBoard();
    }

    // ── Game logic ────────────────────────────────────────────────

    _buildBoard() {
        this._stopTimer();
        this._flipped  = [];
        this._locked   = false;
        this._started  = false;
        this.moves     = 0;
        this.matchCount= 0;
        this.gameWon   = false;
        this.seconds   = 0;

        const pairCount = this.difficulty === 'hard' ? HARD_PAIRS : EASY_PAIRS;
        const selected  = this._shuffle([...ALL_PAIRS]).slice(0, pairCount);

        // Duplicate for pairs and assign unique ids
        const doubled = this._shuffle([...selected, ...selected].map((p, i) => ({
            id        : i,
            emoji     : p.emoji,
            label     : p.label,
            pairKey   : p.label,   // used to check matches
            isFlipped : false,
            isMatched : false,
            get cardClass() {
                let cls = 'card';
                if (this.isFlipped) cls += ' card--flipped';
                if (this.isMatched) cls += ' card--matched';
                return cls;
            },
            get ariaLabel() {
                return this.isFlipped ? `${this.label} card, revealed` : 'Hidden card';
            }
        })));

        this.cards = doubled;
    }

    _checkMatch() {
        this._locked = true;
        const [idA, idB] = this._flipped;
        const cardA = this.cards.find(c => c.id === idA);
        const cardB = this.cards.find(c => c.id === idB);

        if (cardA.pairKey === cardB.pairKey) {
            // ✅ Match!
            this._setMatched(idA, true);
            this._setMatched(idB, true);
            this.matchCount += 1;
            this._flipped  = [];
            this._locked   = false;

            if (this.matchCount === this.totalPairs) {
                this._stopTimer();
                this.gameWon = true;
            }
        } else {
            // ❌ No match — flip back after delay
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this._flipCard(idA, false);
                this._flipCard(idB, false);
                this._flipped = [];
                this._locked  = false;
            }, 900);
        }
    }

    _flipCard(id, state) {
        this.cards = this.cards.map(c => {
            if (c.id !== id) return c;
            const updated = { ...c, isFlipped: state };
            updated.cardClass = this._computeCardClass(updated);
            updated.ariaLabel = this._computeAriaLabel(updated);
            return updated;
        });
    }

    _setMatched(id, state) {
        this.cards = this.cards.map(c => {
            if (c.id !== id) return c;
            const updated = { ...c, isMatched: state, isFlipped: true };
            updated.cardClass = this._computeCardClass(updated);
            updated.ariaLabel = this._computeAriaLabel(updated);
            return updated;
        });
    }

    _computeCardClass(card) {
        let cls = 'card';
        if (card.isFlipped) cls += ' card--flipped';
        if (card.isMatched) cls += ' card--matched';
        return cls;
    }

    _computeAriaLabel(card) {
        if (card.isMatched) return `${card.label}, matched`;
        if (card.isFlipped) return `${card.label} card, revealed`;
        return 'Hidden card';
    }

    // ── Timer ─────────────────────────────────────────────────────

    _startTimer() {
        this._stopTimer();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._timerRef = setInterval(() => {
            this.seconds += 1;
        }, 1000);
    }

    _stopTimer() {
        if (this._timerRef) {
            clearInterval(this._timerRef);
            this._timerRef = null;
        }
    }

    // ── Utilities ─────────────────────────────────────────────────

    _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}