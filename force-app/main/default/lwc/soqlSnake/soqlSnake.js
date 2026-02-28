// soqlSnake.js
import { LightningElement, track } from 'lwc';

// ── Grid & timing ────────────────────────────────────────────────
const COLS        = 20;
const ROWS        = 20;
const CELL        = 24;           // px per cell (canvas = 480×480)
const BASE_SPEED  = 150;          // ms per tick at level 1
const SPEED_STEP  = 10;           // ms reduction per level
const MIN_SPEED   = 60;

// ── SOQL token sequences ─────────────────────────────────────────
const SOQL_SEQUENCES = [
    ['SELECT', 'Id', 'FROM', 'Account'],
    ['SELECT', 'Id,Name', 'FROM', 'Contact', 'WHERE', 'IsActive=true'],
    ['SELECT', 'COUNT()', 'FROM', 'Opportunity', 'WHERE', 'StageName=\'Closed Won\''],
    ['SELECT', 'Id,Name', 'FROM', 'Lead', 'ORDER BY', 'CreatedDate', 'DESC', 'LIMIT 10'],
];

// Token color palette per keyword type
const TOKEN_COLORS = {
    'SELECT'   : { bg: '#FF6B6B', fg: '#fff' },
    'FROM'     : { bg: '#4ECDC4', fg: '#fff' },
    'WHERE'    : { bg: '#45B7D1', fg: '#fff' },
    'ORDER BY' : { bg: '#96CEB4', fg: '#fff' },
    'LIMIT'    : { bg: '#FFEAA7', fg: '#2D3436' },
    'DESC'     : { bg: '#DDA0DD', fg: '#fff' },
    'ASC'      : { bg: '#98D8C8', fg: '#fff' },
    'AND'      : { bg: '#F0A500', fg: '#fff' },
    'OR'       : { bg: '#E17055', fg: '#fff' },
    'COUNT()'  : { bg: '#6C5CE7', fg: '#fff' },
    'DEFAULT'  : { bg: '#00A1E0', fg: '#fff' },
};

const DIR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };

export default class SoqlSnake extends LightningElement {

    // ── Reactive state ────────────────────────────────────────
    @track score         = 0;
    @track highScore     = 0;
    @track level         = 1;
    @track snakeLength   = 3;
    @track queryDisplay  = '_';
    @track finalQuery    = '';
    @track showStartOverlay    = true;
    @track showPauseOverlay    = false;
    @track showGameOverOverlay = false;

    // ── Internal game state ───────────────────────────────────
    _snake          = [];
    _dir            = DIR.RIGHT;
    _nextDir        = DIR.RIGHT;
    _food           = null;
    _gameLoop       = null;
    _seqIndex       = 0;
    _tokenIndex     = 0;
    _eatenTokens    = [];
    _currentSeq     = SOQL_SEQUENCES[0];
    _canvas         = null;
    _ctx            = null;
    _running        = false;
    _keyHandler     = null;

    // ── Legend ────────────────────────────────────────────────
    get tokenLegend() {
        return Object.entries(TOKEN_COLORS).slice(0, 8).map(([word, c]) => ({
            word,
            style: `background:${c.bg};color:${c.fg}`
        }));
    }

    // ── Lifecycle ─────────────────────────────────────────────
    connectedCallback() {
        this._keyHandler = this._handleKey.bind(this);
        window.addEventListener('keydown', this._keyHandler);
    }

    disconnectedCallback() {
        this._stopLoop();
        window.removeEventListener('keydown', this._keyHandler);
    }

    renderedCallback() {
        if (!this._canvas && this.refs.gameCanvas) {
            this._canvas = this.refs.gameCanvas;
            this._ctx    = this._canvas.getContext('2d');
            this._drawIdle();
        }
    }

    // ── Game control ──────────────────────────────────────────
    startGame() {
        this.showStartOverlay    = false;
        this.showGameOverOverlay = false;
        this.showPauseOverlay    = false;
        this._initGame();
        this._startLoop();
    }

    restartGame() {
        this._stopLoop();
        this.startGame();
    }

    togglePause() {
        if (!this._running) return;
        if (this.showPauseOverlay) {
            this.resumeGame();
        } else {
            this._stopLoop();
            this.showPauseOverlay = true;
        }
    }

    resumeGame() {
        this.showPauseOverlay = false;
        this._startLoop();
    }

    // ── D-pad mobile controls ─────────────────────────────────
    dpadUp()    { this._queueDir(DIR.UP);    }
    dpadDown()  { this._queueDir(DIR.DOWN);  }
    dpadLeft()  { this._queueDir(DIR.LEFT);  }
    dpadRight() { this._queueDir(DIR.RIGHT); }

    // ── Keyboard controls ─────────────────────────────────────
    _handleKey(e) {
        const map = {
            ArrowUp   : DIR.UP,    w: DIR.UP,    W: DIR.UP,
            ArrowDown : DIR.DOWN,  s: DIR.DOWN,  S: DIR.DOWN,
            ArrowLeft : DIR.LEFT,  a: DIR.LEFT,  A: DIR.LEFT,
            ArrowRight: DIR.RIGHT, d: DIR.RIGHT, D: DIR.RIGHT,
        };
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
            if (this._running || this.showPauseOverlay) this.togglePause();
            return;
        }
        const d = map[e.key];
        if (d) {
            e.preventDefault();
            this._queueDir(d);
        }
    }

    _queueDir(d) {
        const opp = {
            [DIR.UP]: DIR.DOWN, [DIR.DOWN]: DIR.UP,
            [DIR.LEFT]: DIR.RIGHT, [DIR.RIGHT]: DIR.LEFT
        };
        if (d !== opp[this._dir]) this._nextDir = d;
    }

    // ── Init ──────────────────────────────────────────────────
    _initGame() {
        this.score        = 0;
        this.level        = 1;
        this.snakeLength  = 3;
        this.queryDisplay = '_';
        this._dir         = DIR.RIGHT;
        this._nextDir     = DIR.RIGHT;
        this._eatenTokens = [];
        this._seqIndex    = 0;
        this._tokenIndex  = 0;
        this._currentSeq  = SOQL_SEQUENCES[0];

        // Start snake in middle
        const midR = Math.floor(ROWS / 2);
        this._snake = [
            { c: 6, r: midR },
            { c: 5, r: midR },
            { c: 4, r: midR },
        ];

        this._spawnFood();
    }

    // ── Game loop ─────────────────────────────────────────────
    _startLoop() {
        this._running = true;
        const speed   = Math.max(MIN_SPEED, BASE_SPEED - (this.level - 1) * SPEED_STEP);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._gameLoop = setInterval(() => this._tick(), speed);
    }

    _stopLoop() {
        this._running = false;
        if (this._gameLoop) {
            clearInterval(this._gameLoop);
            this._gameLoop = null;
        }
    }

    _tick() {
        this._dir = this._nextDir;

        const head = { ...this._snake[0] };
        if (this._dir === DIR.UP)    head.r -= 1;
        if (this._dir === DIR.DOWN)  head.r += 1;
        if (this._dir === DIR.LEFT)  head.c -= 1;
        if (this._dir === DIR.RIGHT) head.c += 1;

        // Wall collision
        if (head.c < 0 || head.c >= COLS || head.r < 0 || head.r >= ROWS) {
            this._gameOver(); return;
        }

        // Self collision
        if (this._snake.some(s => s.c === head.c && s.r === head.r)) {
            this._gameOver(); return;
        }

        this._snake.unshift(head);

        // Food eaten?
        if (head.c === this._food.c && head.r === this._food.r) {
            this._eatToken();
        } else {
            this._snake.pop();
        }

        this.snakeLength = this._snake.length;
        this._draw();
    }

    // ── Food logic ────────────────────────────────────────────
    _spawnFood() {
        let pos;
        do {
            pos = {
                c: Math.floor(Math.random() * COLS),
                r: Math.floor(Math.random() * ROWS)
            };
        } while (this._snake.some(s => s.c === pos.c && s.r === pos.r));

        const word = this._currentSeq[this._tokenIndex];
        const col  = TOKEN_COLORS[word] || TOKEN_COLORS.DEFAULT;
        this._food = { ...pos, word, bg: col.bg, fg: col.fg };
    }

    _eatToken() {
        const eaten = this._food.word;
        this._eatenTokens.push(eaten);
        this.score       += (eaten.length * 10) * this.level;
        this._tokenIndex += 1;

        // Update query display
        this.queryDisplay = this._eatenTokens.join(' ') + ' _';

        // Sequence complete — advance
        if (this._tokenIndex >= this._currentSeq.length) {
            this._tokenIndex  = 0;
            this._eatenTokens = [];
            this._seqIndex    = (this._seqIndex + 1) % SOQL_SEQUENCES.length;
            this._currentSeq  = SOQL_SEQUENCES[this._seqIndex];
            this.level        = Math.min(10, this.level + 1);
            this.queryDisplay = '_ (New query!)';

            // Restart loop at new speed
            this._stopLoop();
            this._startLoop();
        }

        if (this.score > this.highScore) this.highScore = this.score;
        this._spawnFood();
    }

    // ── Game Over ─────────────────────────────────────────────
    _gameOver() {
        this._stopLoop();
        if (this.score > this.highScore) this.highScore = this.score;
        this.finalQuery           = this._eatenTokens.length > 0
            ? 'SELECT ' + this._eatenTokens.join(' ') + ' …'
            : 'No tokens eaten';
        this.showGameOverOverlay = true;
        this._drawGameOverFrame();
    }

    // ── Canvas drawing ────────────────────────────────────────
    _draw() {
        if (!this._ctx) return;
        const ctx  = this._ctx;
        const cell = CELL;
        const W    = COLS * cell;
        const H    = ROWS * cell;

        // Background
        ctx.fillStyle = '#05080F';
        ctx.fillRect(0, 0, W, H);

        // Grid dots
        ctx.fillStyle = 'rgba(0,112,210,0.12)';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                ctx.beginPath();
                ctx.arc(c * cell + cell / 2, r * cell + cell / 2, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Food token
        this._drawToken(ctx, this._food.c, this._food.r, this._food.word, this._food.bg, this._food.fg);

        // Snake body
        this._snake.forEach((seg, i) => {
            const alpha  = Math.max(0.3, 1 - i * 0.03);
            const isHead = i === 0;
            const size   = isHead ? cell - 2 : cell - 4;
            const offset = isHead ? 1 : 2;
            const radius = isHead ? 8 : 5;

            ctx.globalAlpha = alpha;

            // Glow for head
            if (isHead) {
                ctx.shadowColor = '#00FF41';
                ctx.shadowBlur  = 15;
            }

            ctx.fillStyle = isHead ? '#00FF41' : `hsl(${140 + i * 2}, 70%, ${55 - i * 0.5}%)`;
            this._roundRect(ctx, seg.c * cell + offset, seg.r * cell + offset, size, size, radius);
            ctx.fill();

            ctx.shadowBlur   = 0;
            ctx.globalAlpha  = 1;

            // Eyes on head
            if (isHead) {
                ctx.fillStyle = '#032D60';
                const ex1 = seg.c * cell + (this._dir === DIR.LEFT ? 6 : cell - 8);
                const ex2 = seg.c * cell + (this._dir === DIR.LEFT ? 6 : cell - 8);
                const ey1 = seg.r * cell + 6;
                const ey2 = seg.r * cell + cell - 8;
                ctx.beginPath(); ctx.arc(ex1, ey1, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ex2, ey2, 2.5, 0, Math.PI * 2); ctx.fill();
            }
        });
    }

    _drawToken(ctx, c, r, word, bg, fg) {
        const cell = CELL;
        const x    = c * cell + 1;
        const y    = r * cell + 1;
        const w    = cell - 2;
        const h    = cell - 2;

        // Glow
        ctx.shadowColor = bg;
        ctx.shadowBlur  = 16;
        ctx.fillStyle   = bg;
        this._roundRect(ctx, x, y, w, h, 6);
        ctx.fill();
        ctx.shadowBlur  = 0;

        // Text
        const fontSize = word.length > 6 ? 6 : word.length > 4 ? 7 : 8;
        ctx.fillStyle  = fg;
        ctx.font       = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.textAlign  = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(word.length > 8 ? word.slice(0, 7) + '…' : word, x + w / 2, y + h / 2);
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    _drawIdle() {
        if (!this._ctx) return;
        const ctx = this._ctx;
        const W   = COLS * CELL;
        const H   = ROWS * CELL;
        ctx.fillStyle = '#05080F';
        ctx.fillRect(0, 0, W, H);
        // draw a static sample snake
        ctx.fillStyle = 'rgba(0,255,65,0.1)';
        for (let i = 0; i < 8; i++) {
            this._roundRect(ctx, (8 + i) * CELL + 2, 10 * CELL + 2, CELL - 4, CELL - 4, 5);
            ctx.fill();
        }
    }

    _drawGameOverFrame() {
        if (!this._ctx) return;
        const ctx = this._ctx;
        ctx.fillStyle = 'rgba(5,8,15,0.7)';
        ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}