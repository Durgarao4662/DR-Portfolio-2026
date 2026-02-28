// jsonToApex.js
import { LightningElement, track } from 'lwc';

const SAMPLE_JSON = `{
  "id": "ACC-001",
  "accountName": "Acme Corporation",
  "annualRevenue": 1500000.50,
  "employeeCount": 250,
  "isActive": true,
  "rating": null,
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "contacts": [
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@acme.com",
      "phone": "+1-555-0100"
    }
  ],
  "tags": ["enterprise", "priority", "tech"],
  "createdDate": "2024-01-15T10:30:00Z"
}`;

const PLACEHOLDER = `Paste your JSON here…

Example:
{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`;

// ── Type inference ────────────────────────────────────────────
function inferApexType(value, key) {
    if (value === null || value === undefined) return 'Object';
    if (typeof value === 'boolean')  return 'Boolean';
    if (typeof value === 'number')   return Number.isInteger(value) ? 'Integer' : 'Decimal';
    if (typeof value === 'string') {
        const lower = key.toLowerCase();
        if (lower.includes('date') || lower.includes('time'))      return 'String'; // DateTime needs parsing
        if (lower === 'id' || lower.endsWith('id'))                return 'String';
        if (lower.includes('email'))                               return 'String';
        if (lower.includes('phone'))                               return 'String';
        return 'String';
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return 'List<Object>';
        const firstItem = value[0];
        if (typeof firstItem === 'string')  return 'List<String>';
        if (typeof firstItem === 'number')  return Number.isInteger(firstItem) ? 'List<Integer>' : 'List<Decimal>';
        if (typeof firstItem === 'boolean') return 'List<Boolean>';
        if (typeof firstItem === 'object' && firstItem !== null) return `List<${toPascalCase(key)}Item>`;
        return 'List<Object>';
    }
    if (typeof value === 'object') return toPascalCase(key);
    return 'Object';
}

function toPascalCase(str) {
    if (!str) return 'Unknown';
    return str
        .replace(/[_\-\s]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, c => c.toUpperCase());
}

function toCamelCase(str) {
    if (!str) return 'unknown';
    return str.charAt(0).toLowerCase() + str.slice(1);
}

// ── Apex class generator ──────────────────────────────────────
function generateApexClass(obj, className, useSharingPublic, useSerializable, indent) {
    const ind  = indent || '    ';
    const share = useSharingPublic ? 'with sharing' : 'without sharing';
    const lines = [];
    const innerClasses = [];

    if (useSerializable) lines.push('@JsonAccess(serializable=\'always\' deserializable=\'always\')');
    lines.push(`public ${share} class ${className} {`);
    lines.push('');

    // Collect inner classes needed
    for (const [key, value] of Object.entries(obj)) {
        const fieldName = toCamelCase(key);
        const apexType  = inferApexType(value, key);

        // If it's an object → generate inner class
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            const innerName = toPascalCase(key);
            innerClasses.push({ name: innerName, data: value });
            lines.push(`${ind}public ${innerName} ${fieldName};`);
        }
        // Array of objects
        else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            const innerName = toPascalCase(key) + 'Item';
            innerClasses.push({ name: innerName, data: value[0] });
            lines.push(`${ind}public List<${innerName}> ${fieldName};`);
        }
        else {
            lines.push(`${ind}public ${apexType} ${fieldName};`);
        }
    }

    // parse() method
    lines.push('');
    lines.push(`${ind}public static ${className} parse(String jsonStr) {`);
    lines.push(`${ind}${ind}return (${className}) JSON.deserialize(jsonStr, ${className}.class);`);
    lines.push(`${ind}}`);
    lines.push('');
    lines.push(`${ind}public String toJson() {`);
    lines.push(`${ind}${ind}return JSON.serialize(this);`);
    lines.push(`${ind}}`);

    // Inner classes
    for (const ic of innerClasses) {
        lines.push('');
        lines.push(`${ind}public class ${ic.name} {`);
        for (const [k2, v2] of Object.entries(ic.data)) {
            const t2 = inferApexType(v2, k2);
            lines.push(`${ind}${ind}public ${t2} ${toCamelCase(k2)};`);
        }
        lines.push(`${ind}}`);
    }

    lines.push('}');
    return lines.join('\n');
}

// ── Apex syntax highlighter ───────────────────────────────────
const APEX_KEYWORDS = ['public','private','protected','global','static','void','class','return',
    'new','this','super','null','true','false','if','else','for','while','try','catch','finally',
    'throw','extends','implements','interface','enum','with','without','sharing','override',
    '@JsonAccess','serializable','deserializable','always'];
const APEX_TYPES    = ['String','Integer','Decimal','Boolean','Double','Long','Date','DateTime','Blob','Object','List','Map','Set','Id'];

function tokeniseApex(code) {
    const tokens = [];
    let i = 0, id = 0;
    const chars = code.split('');

    while (i < chars.length) {
        // Comment //
        if (chars[i] === '/' && chars[i+1] === '/') {
            let c = '';
            while (i < chars.length && chars[i] !== '\n') { c += chars[i++]; }
            tokens.push({id: id++, text: c, cls: 't-cmt'});
            continue;
        }
        // String literal
        if (chars[i] === "'") {
            let c = "'"; i++;
            while (i < chars.length && chars[i] !== "'") { c += chars[i++]; }
            c += "'"; i++;
            tokens.push({id: id++, text: c, cls: 't-str'});
            continue;
        }
        // Annotation
        if (chars[i] === '@') {
            let c = '@'; i++;
            while (i < chars.length && /\w/.test(chars[i])) { c += chars[i++]; }
            tokens.push({id: id++, text: c, cls: 't-ann'});
            continue;
        }
        // Word token
        if (/[a-zA-Z_$]/.test(chars[i])) {
            let w = ''; const start = i;
            while (i < chars.length && /[\w$<>]/.test(chars[i])) { w += chars[i++]; }
            const cls = APEX_KEYWORDS.includes(w) ? 't-kw'
                      : APEX_TYPES.includes(w.replace(/<.*>/, '')) ? 't-type'
                      : 't-id';
            tokens.push({id: id++, text: w, cls});
            continue;
        }
        // Number
        if (/\d/.test(chars[i])) {
            let n = '';
            while (i < chars.length && /[\d.]/.test(chars[i])) { n += chars[i++]; }
            tokens.push({id: id++, text: n, cls: 't-num'});
            continue;
        }
        // Punct / other
        tokens.push({id: id++, text: chars[i++], cls: 't-punct'});
    }
    return tokens;
}

export default class JsonToApex extends LightningElement {

    @track jsonInput       = '';
    @track className       = 'MyApexClass';
    @track useSerializable = true;
    @track useSharingPublic= true;
    @track copied          = false;
    @track jsonError       = '';

    get jsonPlaceholder() { return PLACEHOLDER; }

    // ── Input stats ───────────────────────────────────────────
    get jsonLineCount() { return this.jsonInput ? this.jsonInput.split('\n').length : 0; }
    get jsonCharCount() { return this.jsonInput ? this.jsonInput.length : 0; }
    get lineNumbers()   {
        const count = Math.max(this.jsonLineCount, 1);
        return Array.from({length: count}, (_, i) => i + 1);
    }

    // ── Parsed JSON ───────────────────────────────────────────
    get parsedJson() {
        if (!this.jsonInput.trim()) return null;
        try {
            const parsed = JSON.parse(this.jsonInput);
            return typeof parsed === 'object' && parsed !== null ? parsed : null;
        } catch(e) {
            return null;
        }
    }

    // ── Generated Apex ────────────────────────────────────────
    get generatedApex() {
        const json = this.parsedJson;
        if (!json) return '';
        try {
            return generateApexClass(json, this.className || 'MyApexClass', this.useSharingPublic, this.useSerializable, '    ');
        } catch(e) {
            return '';
        }
    }

    get hasApex()       { return this.generatedApex.length > 0; }
    get apexLineCount() { return this.generatedApex ? this.generatedApex.split('\n').length : 0; }
    get fieldCount()    {
        const json = this.parsedJson;
        return json ? Object.keys(json).length : 0;
    }
    get apexLineNumbers() {
        const count = Math.max(this.apexLineCount, 1);
        return Array.from({length: count}, (_, i) => i + 1);
    }

    get apexTokens() {
        if (!this.generatedApex) return [];
        return tokeniseApex(this.generatedApex);
    }

    // ── Handlers ──────────────────────────────────────────────
    onJsonInput(e) {
        this.jsonInput = e.target.value;
        this.jsonError = '';
        if (this.jsonInput.trim()) {
            try {
                JSON.parse(this.jsonInput);
            } catch(err) {
                this.jsonError = err.message;
            }
        }
    }

    onClassNameChange(e) {
        const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
        this.className = val || 'MyApexClass';
    }

    onSerializableToggle(e) { this.useSerializable  = e.target.checked; }
    onSharingToggle(e)      { this.useSharingPublic = e.target.checked; }

    loadSample() {
        this.jsonInput = SAMPLE_JSON;
        this.jsonError = '';
        this.className = 'AccountWrapper';
    }

    clearInput() {
        this.jsonInput = '';
        this.jsonError = '';
    }

    copyApex() {
        if (!this.generatedApex) return;
        navigator.clipboard.writeText(this.generatedApex).then(() => {
            this.copied = true;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => { this.copied = false; }, 2200);
        }).catch(()=>{});
    }
}