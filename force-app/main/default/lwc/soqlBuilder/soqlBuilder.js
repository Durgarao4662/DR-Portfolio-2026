// soqlBuilder.js
import { LightningElement, track } from 'lwc';

const OBJECTS = {
    Account:     { fields: ['Id','Name','Type','Industry','AnnualRevenue','Phone','Website','BillingCity','BillingCountry','OwnerId','CreatedDate','LastModifiedDate'], types: {Id:'ID',Name:'String',Type:'Picklist',Industry:'Picklist',AnnualRevenue:'Currency',Phone:'Phone',Website:'URL',BillingCity:'String',BillingCountry:'String',OwnerId:'Reference',CreatedDate:'DateTime',LastModifiedDate:'DateTime'} },
    Contact:     { fields: ['Id','FirstName','LastName','Email','Phone','Title','Department','AccountId','MailingCity','OwnerId','CreatedDate'], types: {Id:'ID',FirstName:'String',LastName:'String',Email:'Email',Phone:'Phone',Title:'String',Department:'String',AccountId:'Reference',MailingCity:'String',OwnerId:'Reference',CreatedDate:'DateTime'} },
    Opportunity: { fields: ['Id','Name','StageName','Amount','CloseDate','AccountId','Probability','Type','LeadSource','OwnerId','CreatedDate'], types: {Id:'ID',Name:'String',StageName:'Picklist',Amount:'Currency',CloseDate:'Date',AccountId:'Reference',Probability:'Percent',Type:'Picklist',LeadSource:'Picklist',OwnerId:'Reference',CreatedDate:'DateTime'} },
    Lead:        { fields: ['Id','FirstName','LastName','Email','Phone','Company','Status','LeadSource','Rating','Industry','OwnerId','CreatedDate'], types: {Id:'ID',FirstName:'String',LastName:'String',Email:'Email',Phone:'Phone',Company:'String',Status:'Picklist',LeadSource:'Picklist',Rating:'Picklist',Industry:'Picklist',OwnerId:'Reference',CreatedDate:'DateTime'} },
    Case:        { fields: ['Id','CaseNumber','Subject','Status','Priority','Type','AccountId','ContactId','OwnerId','CreatedDate'], types: {Id:'ID',CaseNumber:'String',Subject:'String',Status:'Picklist',Priority:'Picklist',Type:'Picklist',AccountId:'Reference',ContactId:'Reference',OwnerId:'Reference',CreatedDate:'DateTime'} },
    Task:        { fields: ['Id','Subject','Status','Priority','ActivityDate','OwnerId','WhatId','WhoId','CreatedDate'], types: {Id:'ID',Subject:'String',Status:'Picklist',Priority:'Picklist',ActivityDate:'Date',OwnerId:'Reference',WhatId:'Reference',WhoId:'Reference',CreatedDate:'DateTime'} },
    User:        { fields: ['Id','Name','Username','Email','ProfileId','IsActive','UserRoleId','Department','Title','CreatedDate'], types: {Id:'ID',Name:'String',Username:'String',Email:'Email',ProfileId:'Reference',IsActive:'Boolean',UserRoleId:'Reference',Department:'String',Title:'String',CreatedDate:'DateTime'} },
    Campaign:    { fields: ['Id','Name','Status','Type','StartDate','EndDate','BudgetedCost','ActualCost','OwnerId','CreatedDate'], types: {Id:'ID',Name:'String',Status:'Picklist',Type:'Picklist',StartDate:'Date',EndDate:'Date',BudgetedCost:'Currency',ActualCost:'Currency',OwnerId:'Reference',CreatedDate:'DateTime'} },
    Product2:    { fields: ['Id','Name','ProductCode','IsActive','Description','Family','CreatedDate'], types: {Id:'ID',Name:'String',ProductCode:'String',IsActive:'Boolean',Description:'String',Family:'Picklist',CreatedDate:'DateTime'} },
    Order:       { fields: ['Id','OrderNumber','Status','AccountId','EffectiveDate','TotalAmount','OwnerId','CreatedDate'], types: {Id:'ID',OrderNumber:'String',Status:'Picklist',AccountId:'Reference',EffectiveDate:'Date',TotalAmount:'Currency',OwnerId:'Reference',CreatedDate:'DateTime'} },
};

const QUICK_PATTERNS = [
    { id:'recent',     label:'🕐 Last 7 Days',      obj:'Account',    flds:['Id','Name','CreatedDate'],                          where:[{f:'CreatedDate',op:'>',v:'LAST_N_DAYS:7'}], ob:'CreatedDate', dir:'DESC', lim:'10' },
    { id:'open_opps',  label:'💰 Open Opps',         obj:'Opportunity', flds:['Id','Name','Amount','CloseDate','StageName'],       where:[{f:'IsClosed',op:'=',v:'false'}],            ob:'CloseDate',   dir:'ASC',  lim:'50' },
    { id:'active_leads',label:'🎯 Active Leads',     obj:'Lead',        flds:['Id','FirstName','LastName','Email','Status'],       where:[{f:'IsConverted',op:'=',v:'false'}],          ob:'CreatedDate', dir:'DESC', lim:'100' },
    { id:'open_cases',  label:'📋 Open Cases',       obj:'Case',        flds:['Id','CaseNumber','Subject','Status','Priority'],    where:[{f:'IsClosed',op:'=',v:'false'}],            ob:'CreatedDate', dir:'DESC', lim:'25' },
    { id:'my_tasks',    label:'✅ My Tasks',          obj:'Task',        flds:['Id','Subject','Status','ActivityDate'],            where:[{f:'Status',op:'!=',v:"'Completed'"}],       ob:'ActivityDate',dir:'ASC',  lim:'20' },
];

export default class SoqlBuilder extends LightningElement {
    @track selectedObject  = '';
    @track _selFields      = new Set();
    @track whereClauses    = [];
    @track whereLogic      = 'AND';
    @track orderByField    = '';
    @track orderDir        = 'ASC';
    @track limitVal        = '';
    @track offsetVal       = '';
    @track copied          = false;
    _clauseId              = 0;

    get objectOptions()  { return Object.keys(OBJECTS).map(k => ({v:k,l:k})); }
    get hasObject()      { return !!this.selectedObject; }
    get availableFields() {
        if (!this.selectedObject) return [];
        const obj = OBJECTS[this.selectedObject];
        return obj.fields.map(api => ({
            api,
            type     : obj.types[api] || 'String',
            selected : this._selFields.has(api),
            chipClass: this._selFields.has(api) ? 'field-chip field-chip--on' : 'field-chip',
        }));
    }
    get selectedFieldsList() { return [...this._selFields]; }
    get selectedCount()      { return this._selFields.size; }
    get whereCount()         { return this.whereClauses.length; }
    get hasMultiClauses()    { return this.whereClauses.length > 1; }
    get andClass()   { return this.whereLogic==='AND' ? 'logic-btn logic-btn--on' : 'logic-btn'; }
    get orClass()    { return this.whereLogic==='OR'  ? 'logic-btn logic-btn--on' : 'logic-btn'; }
    get ascClass()   { return this.orderDir==='ASC'  ? 'dir-btn dir-btn--on' : 'dir-btn'; }
    get descClass()  { return this.orderDir==='DESC' ? 'dir-btn dir-btn--on' : 'dir-btn'; }
    get operators()  {
        return [{v:'=',l:'='},{v:'!=',l:'!='},{v:'<',l:'<'},{v:'<=',l:'<='},{v:'>',l:'>'},{v:'>=',l:'>='},{v:'LIKE',l:'LIKE'},{v:'IN',l:'IN'},{v:'NOT IN',l:'NOT IN'}];
    }
    get quickPatterns() { return QUICK_PATTERNS.map(p=>({id:p.id,label:p.label})); }

    // ── Raw query ─────────────────────────────────────────────────
    get rawQuery() {
        const flds = [...this._selFields];
        if (!this.selectedObject || flds.length === 0) return '';
        let q = `SELECT ${flds.join(', ')} FROM ${this.selectedObject}`;
        const valid = this.whereClauses.filter(c => c.field && c.value);
        if (valid.length)  q += ` WHERE ${valid.map(c=>`${c.field} ${c.op} ${c.value}`).join(` ${this.whereLogic} `)}`;
        if (this.orderByField) q += ` ORDER BY ${this.orderByField} ${this.orderDir}`;
        if (this.limitVal)     q += ` LIMIT ${this.limitVal}`;
        if (this.offsetVal)    q += ` OFFSET ${this.offsetVal}`;
        return q;
    }
    get hasQuery()    { return this.rawQuery.length > 0; }
    get queryLength() { return this.rawQuery.length; }

    // ── Syntax tokens for highlighted display ────────────────────
    get queryTokens() {
        const KWS = ['SELECT','FROM','WHERE','ORDER BY','LIMIT','OFFSET','AND','OR','NOT IN','LIKE','IN','ASC','DESC','!=','>=','<=','=','<','>'];
        let rem = this.rawQuery;
        const toks = [];
        let i = 0;
        while (rem.length) {
            let hit = false;
            for (const kw of KWS) {
                if (rem.startsWith(kw + ' ') || rem.startsWith(kw + ',') || rem === kw) {
                    toks.push({id:i++, text:kw, cls:'t-kw'});
                    rem = rem.slice(kw.length);
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                let chunk = '';
                while (rem.length && !KWS.some(k => rem.startsWith(k+' ') || rem.startsWith(k+',') || rem === k)) {
                    chunk += rem[0];
                    rem = rem.slice(1);
                }
                if (chunk) {
                    const cls = /^[\s,'"]/.test(chunk) && (chunk.includes("'") || chunk.includes('"')) ? 't-str'
                              : /\d/.test(chunk.trim().charAt(0)) ? 't-num' : 't-id';
                    toks.push({id:i++, text:chunk, cls});
                }
            }
        }
        return toks;
    }

    // ── Handlers ──────────────────────────────────────────────────
    onObjectChange(e)  { this.selectedObject = e.target.value; this._selFields = new Set(); this.whereClauses = []; this.orderByField = ''; }
    onFieldToggle(e)   { const f = e.target.dataset.field; const s = new Set(this._selFields); s.has(f) ? s.delete(f) : s.add(f); this._selFields = s; if (!s.has(this.orderByField)) this.orderByField = ''; }
    addClause()        { this.whereClauses = [...this.whereClauses, {id:this._clauseId++, field:'', op:'=', value:''}]; }
    removeClause(e)    { const id = Number(e.currentTarget.dataset.id); this.whereClauses = this.whereClauses.filter(c=>c.id!==id); }
    onClauseField(e)   { this._patchClause(Number(e.currentTarget.dataset.id), 'field', e.target.value); }
    onClauseOp(e)      { this._patchClause(Number(e.currentTarget.dataset.id), 'op',    e.target.value); }
    onClauseValue(e)   { this._patchClause(Number(e.currentTarget.dataset.id), 'value', e.target.value); }
    _patchClause(id,k,v){ this.whereClauses = this.whereClauses.map(c => c.id===id ? {...c,[k]:v} : c); }
    setAnd()  { this.whereLogic = 'AND'; }
    setOr()   { this.whereLogic = 'OR';  }
    setAsc()  { this.orderDir = 'ASC';  }
    setDesc() { this.orderDir = 'DESC'; }
    onOrderField(e)  { this.orderByField = e.target.value; }
    onLimitChange(e) { this.limitVal  = e.target.value; }
    onOffsetChange(e){ this.offsetVal = e.target.value; }

    copyQuery() {
        if (!this.rawQuery) return;
        navigator.clipboard.writeText(this.rawQuery).then(() => {
            this.copied = true;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => { this.copied = false; }, 2000);
        }).catch(()=>{});
    }

    clearAll() {
        this.selectedObject = ''; this._selFields = new Set(); this.whereClauses = [];
        this.orderByField = ''; this.orderDir = 'ASC'; this.limitVal = ''; this.offsetVal = '';
    }

    applyPattern(e) {
        const p = QUICK_PATTERNS.find(x => x.id === e.currentTarget.dataset.id);
        if (!p) return;
        this.selectedObject = p.obj;
        this._selFields = new Set(p.flds);
        this.whereClauses = (p.where||[]).map(w => ({id:this._clauseId++, field:w.f, op:w.op, value:w.v}));
        this.whereLogic = 'AND';
        this.orderByField = p.ob || '';
        this.orderDir = p.dir || 'ASC';
        this.limitVal = p.lim || '';
        this.offsetVal = '';
    }
}