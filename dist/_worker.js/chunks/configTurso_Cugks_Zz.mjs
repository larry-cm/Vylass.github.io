globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDefaultExportFromCjs } from './astro/server_BAM4cObl.mjs';

/** Error thrown by the client. */
class LibsqlError extends Error {
    /** Machine-readable error code. */
    code;
    /** Raw numeric error code */
    rawCode;
    constructor(message, code, rawCode, cause) {
        if (code !== undefined) {
            message = `${code}: ${message}`;
        }
        super(message, { cause });
        this.code = code;
        this.rawCode = rawCode;
        this.name = "LibsqlError";
    }
}

// URI parser based on RFC 3986
// We can't use the standard `URL` object, because we want to support relative `file:` URLs like
// `file:relative/path/database.db`, which are not correct according to RFC 8089, which standardizes the
// `file` scheme.
function parseUri(text) {
    const match = URI_RE.exec(text);
    if (match === null) {
        throw new LibsqlError(`The URL '${text}' is not in a valid format`, "URL_INVALID");
    }
    const groups = match.groups;
    const scheme = groups["scheme"];
    const authority = groups["authority"] !== undefined
        ? parseAuthority(groups["authority"])
        : undefined;
    const path = percentDecode(groups["path"]);
    const query = groups["query"] !== undefined ? parseQuery(groups["query"]) : undefined;
    const fragment = groups["fragment"] !== undefined
        ? percentDecode(groups["fragment"])
        : undefined;
    return { scheme, authority, path, query, fragment };
}
const URI_RE = (() => {
    const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
    const AUTHORITY = "(?<authority>[^/?#]*)";
    const PATH = "(?<path>[^?#]*)";
    const QUERY = "(?<query>[^#]*)";
    const FRAGMENT = "(?<fragment>.*)";
    return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
})();
function parseAuthority(text) {
    const match = AUTHORITY_RE.exec(text);
    if (match === null) {
        throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
    }
    const groups = match.groups;
    const host = percentDecode(groups["host_br"] ?? groups["host"]);
    const port = groups["port"] ? parseInt(groups["port"], 10) : undefined;
    const userinfo = groups["username"] !== undefined
        ? {
            username: percentDecode(groups["username"]),
            password: groups["password"] !== undefined
                ? percentDecode(groups["password"])
                : undefined,
        }
        : undefined;
    return { host, port, userinfo };
}
const AUTHORITY_RE = (() => {
    return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
})();
// Query string is parsed as application/x-www-form-urlencoded according to the Web URL standard:
// https://url.spec.whatwg.org/#urlencoded-parsing
function parseQuery(text) {
    const sequences = text.split("&");
    const pairs = [];
    for (const sequence of sequences) {
        if (sequence === "") {
            continue;
        }
        let key;
        let value;
        const splitIdx = sequence.indexOf("=");
        if (splitIdx < 0) {
            key = sequence;
            value = "";
        }
        else {
            key = sequence.substring(0, splitIdx);
            value = sequence.substring(splitIdx + 1);
        }
        pairs.push({
            key: percentDecode(key.replaceAll("+", " ")),
            value: percentDecode(value.replaceAll("+", " ")),
        });
    }
    return { pairs };
}
function percentDecode(text) {
    try {
        return decodeURIComponent(text);
    }
    catch (e) {
        if (e instanceof URIError) {
            throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", undefined, e);
        }
        throw e;
    }
}
function encodeBaseUrl(scheme, authority, path) {
    if (authority === undefined) {
        throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
    }
    const schemeText = `${scheme}:`;
    const hostText = encodeHost(authority.host);
    const portText = encodePort(authority.port);
    const userinfoText = encodeUserinfo(authority.userinfo);
    const authorityText = `//${userinfoText}${hostText}${portText}`;
    let pathText = path.split("/").map(encodeURIComponent).join("/");
    if (pathText !== "" && !pathText.startsWith("/")) {
        pathText = "/" + pathText;
    }
    return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
    return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
    return port !== undefined ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
    if (userinfo === undefined) {
        return "";
    }
    const usernameText = encodeURIComponent(userinfo.username);
    const passwordText = userinfo.password !== undefined
        ? `:${encodeURIComponent(userinfo.password)}`
        : "";
    return `${usernameText}${passwordText}@`;
}

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.7';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = typeof btoa === 'function' ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI$1 = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = typeof atob === 'function' ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI$1,
    encodeURL: encodeURI$1,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins
};

const supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
function transactionModeToBegin(mode) {
    if (mode === "write") {
        return "BEGIN IMMEDIATE";
    }
    else if (mode === "read") {
        return "BEGIN TRANSACTION READONLY";
    }
    else if (mode === "deferred") {
        return "BEGIN DEFERRED";
    }
    else {
        throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
    }
}
class ResultSetImpl {
    columns;
    columnTypes;
    rows;
    rowsAffected;
    lastInsertRowid;
    constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
        this.columns = columns;
        this.columnTypes = columnTypes;
        this.rows = rows;
        this.rowsAffected = rowsAffected;
        this.lastInsertRowid = lastInsertRowid;
    }
    toJSON() {
        return {
            columns: this.columns,
            columnTypes: this.columnTypes,
            rows: this.rows.map(rowToJson),
            rowsAffected: this.rowsAffected,
            lastInsertRowid: this.lastInsertRowid !== undefined
                ? "" + this.lastInsertRowid
                : null,
        };
    }
}
function rowToJson(row) {
    return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
    if (typeof value === "bigint") {
        return "" + value;
    }
    else if (value instanceof ArrayBuffer) {
        return gBase64.fromUint8Array(new Uint8Array(value));
    }
    else {
        return value;
    }
}

const inMemoryMode = ":memory:";
function expandConfig(config, preferHttp) {
    if (typeof config !== "object") {
        // produce a reasonable error message in the common case where users type
        // `createClient("libsql://...")` instead of `createClient({url: "libsql://..."})`
        throw new TypeError(`Expected client configuration as object, got ${typeof config}`);
    }
    let { url, authToken, tls, intMode, concurrency } = config;
    // fill simple defaults right here
    concurrency = Math.max(0, concurrency || 20);
    intMode ??= "number";
    let connectionQueryParams = []; // recognized query parameters which we sanitize through white list of valid key-value pairs
    // convert plain :memory: url to URI format to make logic more uniform
    if (url === inMemoryMode) {
        url = "file::memory:";
    }
    // parse url parameters first and override config with update values
    const uri = parseUri(url);
    const originalUriScheme = uri.scheme.toLowerCase();
    const isInMemoryMode = originalUriScheme === "file" &&
        uri.path === inMemoryMode &&
        uri.authority === undefined;
    let queryParamsDef;
    if (isInMemoryMode) {
        queryParamsDef = {
            cache: {
                values: ["shared", "private"],
                update: (key, value) => connectionQueryParams.push(`${key}=${value}`),
            },
        };
    }
    else {
        queryParamsDef = {
            tls: {
                values: ["0", "1"],
                update: (_, value) => (tls = value === "1"),
            },
            authToken: {
                update: (_, value) => (authToken = value),
            },
        };
    }
    for (const { key, value } of uri.query?.pairs ?? []) {
        if (!Object.hasOwn(queryParamsDef, key)) {
            throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
        }
        const queryParamDef = queryParamsDef[key];
        if (queryParamDef.values !== undefined &&
            !queryParamDef.values.includes(value)) {
            throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
        }
        if (queryParamDef.update !== undefined) {
            queryParamDef?.update(key, value);
        }
    }
    // fill complex defaults & validate config
    const connectionQueryParamsString = connectionQueryParams.length === 0
        ? ""
        : `?${connectionQueryParams.join("&")}`;
    const path = uri.path + connectionQueryParamsString;
    let scheme;
    if (originalUriScheme === "libsql") {
        if (tls === false) {
            if (uri.authority?.port === undefined) {
                throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
            }
            scheme = "http" ;
        }
        else {
            scheme = "https" ;
        }
    }
    else {
        scheme = originalUriScheme;
    }
    if (scheme === "http" || scheme === "ws") {
        tls ??= false;
    }
    else {
        tls ??= true;
    }
    if (scheme !== "http" &&
        scheme !== "ws" &&
        scheme !== "https" &&
        scheme !== "wss" &&
        scheme !== "file") {
        throw new LibsqlError('The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, ' +
            `got ${JSON.stringify(uri.scheme + ":")}. ` +
            `For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
        throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
    }
    if (uri.fragment !== undefined) {
        throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
    }
    if (isInMemoryMode) {
        return {
            scheme: "file",
            tls: false,
            path,
            intMode,
            concurrency,
            syncUrl: config.syncUrl,
            syncInterval: config.syncInterval,
            fetch: config.fetch,
            authToken: undefined,
            encryptionKey: undefined,
            authority: undefined,
        };
    }
    return {
        scheme,
        tls,
        authority: uri.authority,
        path,
        authToken,
        intMode,
        concurrency,
        encryptionKey: config.encryptionKey,
        syncUrl: config.syncUrl,
        syncInterval: config.syncInterval,
        fetch: config.fetch,
    };
}

let _WebSocket;
if (typeof WebSocket !== "undefined") {
    _WebSocket = WebSocket;
} else if (typeof global !== "undefined") {
    _WebSocket = global.WebSocket;
} else if (typeof window !== "undefined") {
    _WebSocket = window.WebSocket;
} else if (typeof self !== "undefined") {
    _WebSocket = self.WebSocket;
}

/** A client for the Hrana protocol (a "database connection pool"). */
class Client {
    /** @private */
    constructor() {
        this.intMode = "number";
    }
    /** Representation of integers returned from the database. See {@link IntMode}.
     *
     * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
     * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
     */
    intMode;
}

/** Generic error produced by the Hrana client. */
class ClientError extends Error {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ClientError";
    }
}
/** Error thrown when the server violates the protocol. */
class ProtoError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ProtoError";
    }
}
/** Error thrown when the server returns an error response. */
class ResponseError extends ClientError {
    code;
    /** @internal */
    proto;
    /** @private */
    constructor(message, protoError) {
        super(message);
        this.name = "ResponseError";
        this.code = protoError.code;
        this.proto = protoError;
        this.stack = undefined;
    }
}
/** Error thrown when the client or stream is closed. */
class ClosedError extends ClientError {
    /** @private */
    constructor(message, cause) {
        if (cause !== undefined) {
            super(`${message}: ${cause}`);
            this.cause = cause;
        }
        else {
            super(message);
        }
        this.name = "ClosedError";
    }
}
/** Error thrown when the environment does not seem to support WebSockets. */
class WebSocketUnsupportedError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "WebSocketUnsupportedError";
    }
}
/** Error thrown when we encounter a WebSocket error. */
class WebSocketError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "WebSocketError";
    }
}
/** Error thrown when the HTTP server returns an error response. */
class HttpServerError extends ClientError {
    status;
    /** @private */
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "HttpServerError";
    }
}
/** Error thrown when the protocol version is too low to support a feature. */
class ProtocolVersionError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "ProtocolVersionError";
    }
}
/** Error thrown when an internal client error happens. */
class InternalError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "InternalError";
    }
}
/** Error thrown when the API is misused. */
class MisuseError extends ClientError {
    /** @private */
    constructor(message) {
        super(message);
        this.name = "MisuseError";
    }
}

function string(value) {
    if (typeof value === "string") {
        return value;
    }
    throw typeError(value, "string");
}
function stringOpt(value) {
    if (value === null || value === undefined) {
        return undefined;
    }
    else if (typeof value === "string") {
        return value;
    }
    throw typeError(value, "string or null");
}
function number(value) {
    if (typeof value === "number") {
        return value;
    }
    throw typeError(value, "number");
}
function boolean(value) {
    if (typeof value === "boolean") {
        return value;
    }
    throw typeError(value, "boolean");
}
function array(value) {
    if (Array.isArray(value)) {
        return value;
    }
    throw typeError(value, "array");
}
function object(value) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
    return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
    if (value === undefined) {
        return new ProtoError(`Expected ${expected}, but the property was missing`);
    }
    let received = typeof value;
    if (value === null) {
        received = "null";
    }
    else if (Array.isArray(value)) {
        received = "array";
    }
    return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
    return fun(object(value));
}

class ObjectWriter {
    #output;
    #isFirst;
    constructor(output) {
        this.#output = output;
        this.#isFirst = false;
    }
    begin() {
        this.#output.push('{');
        this.#isFirst = true;
    }
    end() {
        this.#output.push('}');
        this.#isFirst = false;
    }
    #key(name) {
        if (this.#isFirst) {
            this.#output.push('"');
            this.#isFirst = false;
        }
        else {
            this.#output.push(',"');
        }
        this.#output.push(name);
        this.#output.push('":');
    }
    string(name, value) {
        this.#key(name);
        this.#output.push(JSON.stringify(value));
    }
    stringRaw(name, value) {
        this.#key(name);
        this.#output.push('"');
        this.#output.push(value);
        this.#output.push('"');
    }
    number(name, value) {
        this.#key(name);
        this.#output.push("" + value);
    }
    boolean(name, value) {
        this.#key(name);
        this.#output.push(value ? "true" : "false");
    }
    object(name, value, valueFun) {
        this.#key(name);
        this.begin();
        valueFun(this, value);
        this.end();
    }
    arrayObjects(name, values, valueFun) {
        this.#key(name);
        this.#output.push('[');
        for (let i = 0; i < values.length; ++i) {
            if (i !== 0) {
                this.#output.push(',');
            }
            this.begin();
            valueFun(this, values[i]);
            this.end();
        }
        this.#output.push(']');
    }
}
function writeJsonObject(value, fun) {
    const output = [];
    const writer = new ObjectWriter(output);
    writer.begin();
    fun(writer, value);
    writer.end();
    return output.join("");
}

const VARINT = 0;
const FIXED_64 = 1;
const LENGTH_DELIMITED = 2;
const FIXED_32 = 5;

class MessageReader {
    #array;
    #view;
    #pos;
    constructor(array) {
        this.#array = array;
        this.#view = new DataView(array.buffer, array.byteOffset, array.byteLength);
        this.#pos = 0;
    }
    varint() {
        let value = 0;
        for (let shift = 0;; shift += 7) {
            const byte = this.#array[this.#pos++];
            value |= (byte & 0x7f) << shift;
            if (!(byte & 0x80)) {
                break;
            }
        }
        return value;
    }
    varintBig() {
        let value = 0n;
        for (let shift = 0n;; shift += 7n) {
            const byte = this.#array[this.#pos++];
            value |= BigInt(byte & 0x7f) << shift;
            if (!(byte & 0x80)) {
                break;
            }
        }
        return value;
    }
    bytes(length) {
        const array = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
        this.#pos += length;
        return array;
    }
    double() {
        const value = this.#view.getFloat64(this.#pos, true);
        this.#pos += 8;
        return value;
    }
    skipVarint() {
        for (;;) {
            const byte = this.#array[this.#pos++];
            if (!(byte & 0x80)) {
                break;
            }
        }
    }
    skip(count) {
        this.#pos += count;
    }
    eof() {
        return this.#pos >= this.#array.byteLength;
    }
}
class FieldReader {
    #reader;
    #wireType;
    constructor(reader) {
        this.#reader = reader;
        this.#wireType = -1;
    }
    setup(wireType) {
        this.#wireType = wireType;
    }
    #expect(expectedWireType) {
        if (this.#wireType !== expectedWireType) {
            throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
        }
        this.#wireType = -1;
    }
    bytes() {
        this.#expect(LENGTH_DELIMITED);
        const length = this.#reader.varint();
        return this.#reader.bytes(length);
    }
    string() {
        return new TextDecoder().decode(this.bytes());
    }
    message(def) {
        return readProtobufMessage(this.bytes(), def);
    }
    int32() {
        this.#expect(VARINT);
        return this.#reader.varint();
    }
    uint32() {
        return this.int32();
    }
    bool() {
        return this.int32() !== 0;
    }
    uint64() {
        this.#expect(VARINT);
        return this.#reader.varintBig();
    }
    sint64() {
        const value = this.uint64();
        return (value >> 1n) ^ (-(value & 1n));
    }
    double() {
        this.#expect(FIXED_64);
        return this.#reader.double();
    }
    maybeSkip() {
        if (this.#wireType < 0) {
            return;
        }
        else if (this.#wireType === VARINT) {
            this.#reader.skipVarint();
        }
        else if (this.#wireType === FIXED_64) {
            this.#reader.skip(8);
        }
        else if (this.#wireType === LENGTH_DELIMITED) {
            const length = this.#reader.varint();
            this.#reader.skip(length);
        }
        else if (this.#wireType === FIXED_32) {
            this.#reader.skip(4);
        }
        else {
            throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
        }
        this.#wireType = -1;
    }
}
function readProtobufMessage(data, def) {
    const msgReader = new MessageReader(data);
    const fieldReader = new FieldReader(msgReader);
    let value = def.default();
    while (!msgReader.eof()) {
        const key = msgReader.varint();
        const tag = key >> 3;
        const wireType = key & 0x7;
        fieldReader.setup(wireType);
        const tagFun = def[tag];
        if (tagFun !== undefined) {
            const returnedValue = tagFun(fieldReader, value);
            if (returnedValue !== undefined) {
                value = returnedValue;
            }
        }
        fieldReader.maybeSkip();
    }
    return value;
}

class MessageWriter {
    #buf;
    #array;
    #view;
    #pos;
    constructor() {
        this.#buf = new ArrayBuffer(256);
        this.#array = new Uint8Array(this.#buf);
        this.#view = new DataView(this.#buf);
        this.#pos = 0;
    }
    #ensure(extra) {
        if (this.#pos + extra <= this.#buf.byteLength) {
            return;
        }
        let newCap = this.#buf.byteLength;
        while (newCap < this.#pos + extra) {
            newCap *= 2;
        }
        const newBuf = new ArrayBuffer(newCap);
        const newArray = new Uint8Array(newBuf);
        const newView = new DataView(newBuf);
        newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
        this.#buf = newBuf;
        this.#array = newArray;
        this.#view = newView;
    }
    #varint(value) {
        this.#ensure(5);
        value = 0 | value;
        do {
            let byte = value & 0x7f;
            value >>>= 7;
            byte |= (value ? 0x80 : 0);
            this.#array[this.#pos++] = byte;
        } while (value);
    }
    #varintBig(value) {
        this.#ensure(10);
        value = value & 0xffffffffffffffffn;
        do {
            let byte = Number(value & 0x7fn);
            value >>= 7n;
            byte |= (value ? 0x80 : 0);
            this.#array[this.#pos++] = byte;
        } while (value);
    }
    #tag(tag, wireType) {
        this.#varint((tag << 3) | wireType);
    }
    bytes(tag, value) {
        this.#tag(tag, LENGTH_DELIMITED);
        this.#varint(value.byteLength);
        this.#ensure(value.byteLength);
        this.#array.set(value, this.#pos);
        this.#pos += value.byteLength;
    }
    string(tag, value) {
        this.bytes(tag, new TextEncoder().encode(value));
    }
    message(tag, value, fun) {
        const writer = new MessageWriter();
        fun(writer, value);
        this.bytes(tag, writer.data());
    }
    int32(tag, value) {
        this.#tag(tag, VARINT);
        this.#varint(value);
    }
    uint32(tag, value) {
        this.int32(tag, value);
    }
    bool(tag, value) {
        this.int32(tag, value ? 1 : 0);
    }
    sint64(tag, value) {
        this.#tag(tag, VARINT);
        this.#varintBig((value << 1n) ^ (value >> 63n));
    }
    double(tag, value) {
        this.#tag(tag, FIXED_64);
        this.#ensure(8);
        this.#view.setFloat64(this.#pos, value, true);
        this.#pos += 8;
    }
    data() {
        return new Uint8Array(this.#buf, 0, this.#pos);
    }
}
function writeProtobufMessage(value, fun) {
    const w = new MessageWriter();
    fun(w, value);
    return w.data();
}

// An allocator of non-negative integer ids.
//
// This clever data structure has these "ideal" properties:
// - It consumes memory proportional to the number of used ids (which is optimal).
// - All operations are O(1) time.
// - The allocated ids are small (with a slight modification, we could always provide the smallest possible
// id).
class IdAlloc {
    // Set of all allocated ids
    #usedIds;
    // Set of all free ids lower than `#usedIds.size`
    #freeIds;
    constructor() {
        this.#usedIds = new Set();
        this.#freeIds = new Set();
    }
    // Returns an id that was free, and marks it as used.
    alloc() {
        // this "loop" is just a way to pick an arbitrary element from the `#freeIds` set
        for (const freeId of this.#freeIds) {
            this.#freeIds.delete(freeId);
            this.#usedIds.add(freeId);
            // maintain the invariant of `#freeIds`
            if (!this.#usedIds.has(this.#usedIds.size - 1)) {
                this.#freeIds.add(this.#usedIds.size - 1);
            }
            return freeId;
        }
        // the `#freeIds` set is empty, so there are no free ids lower than `#usedIds.size`
        // this means that `#usedIds` is a set that contains all numbers from 0 to `#usedIds.size - 1`,
        // so `#usedIds.size` is free
        const freeId = this.#usedIds.size;
        this.#usedIds.add(freeId);
        return freeId;
    }
    free(id) {
        if (!this.#usedIds.delete(id)) {
            throw new InternalError("Freeing an id that is not allocated");
        }
        // maintain the invariant of `#freeIds`
        this.#freeIds.delete(this.#usedIds.size);
        if (id < this.#usedIds.size) {
            this.#freeIds.add(id);
        }
    }
}

function impossible(value, message) {
    throw new InternalError(message);
}

function valueToProto(value) {
    if (value === null) {
        return null;
    }
    else if (typeof value === "string") {
        return value;
    }
    else if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
        }
        return value;
    }
    else if (typeof value === "bigint") {
        if (value < minInteger || value > maxInteger) {
            throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
        }
        return value;
    }
    else if (typeof value === "boolean") {
        return value ? 1n : 0n;
    }
    else if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
    }
    else if (value instanceof Uint8Array) {
        return value;
    }
    else if (value instanceof Date) {
        return +value.valueOf();
    }
    else if (typeof value === "object") {
        return "" + value.toString();
    }
    else {
        throw new TypeError("Unsupported type of value");
    }
}
const minInteger = -9223372036854775808n;
const maxInteger = 9223372036854775807n;
function valueFromProto(value, intMode) {
    if (value === null) {
        return null;
    }
    else if (typeof value === "number") {
        return value;
    }
    else if (typeof value === "string") {
        return value;
    }
    else if (typeof value === "bigint") {
        if (intMode === "number") {
            const num = Number(value);
            if (!Number.isSafeInteger(num)) {
                throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
            }
            return num;
        }
        else if (intMode === "bigint") {
            return value;
        }
        else if (intMode === "string") {
            return "" + value;
        }
        else {
            throw new MisuseError("Invalid value for IntMode");
        }
    }
    else if (value instanceof Uint8Array) {
        // TODO: we need to copy data from `Uint8Array` to return an `ArrayBuffer`. Perhaps we should add a
        // `blobMode` parameter, similar to `intMode`, which would allow the user to choose between receiving
        // `ArrayBuffer` (default, convenient) and `Uint8Array` (zero copy)?
        return value.slice().buffer;
    }
    else if (value === undefined) {
        throw new ProtoError("Received unrecognized type of Value");
    }
    else {
        throw impossible(value, "Impossible type of Value");
    }
}

function stmtResultFromProto(result) {
    return {
        affectedRowCount: result.affectedRowCount,
        lastInsertRowid: result.lastInsertRowid,
        columnNames: result.cols.map(col => col.name),
        columnDecltypes: result.cols.map(col => col.decltype),
    };
}
function rowsResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    const rows = result.rows.map(row => rowFromProto(stmtResult.columnNames, row, intMode));
    return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    let row;
    if (result.rows.length > 0) {
        row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
    }
    return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
    const stmtResult = stmtResultFromProto(result);
    let value;
    if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
        value = valueFromProto(result.rows[0][0], intMode);
    }
    return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
    const row = {};
    // make sure that the "length" property is not enumerable
    Object.defineProperty(row, "length", { value: values.length });
    for (let i = 0; i < values.length; ++i) {
        const value = valueFromProto(values[i], intMode);
        Object.defineProperty(row, i, { value });
        const colName = colNames[i];
        if (colName !== undefined && !Object.hasOwn(row, colName)) {
            Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
        }
    }
    return row;
}
function errorFromProto(error) {
    return new ResponseError(error.message, error);
}

/** Text of an SQL statement cached on the server. */
class Sql {
    #owner;
    #sqlId;
    #closed;
    /** @private */
    constructor(owner, sqlId) {
        this.#owner = owner;
        this.#sqlId = sqlId;
        this.#closed = undefined;
    }
    /** @private */
    _getSqlId(owner) {
        if (this.#owner !== owner) {
            throw new MisuseError("Attempted to use SQL text opened with other object");
        }
        else if (this.#closed !== undefined) {
            throw new ClosedError("SQL text is closed", this.#closed);
        }
        return this.#sqlId;
    }
    /** Remove the SQL text from the server, releasing resouces. */
    close() {
        this._setClosed(new ClientError("SQL text was manually closed"));
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed === undefined) {
            this.#closed = error;
            this.#owner._closeSql(this.#sqlId);
        }
    }
    /** True if the SQL text is closed (removed from the server). */
    get closed() {
        return this.#closed !== undefined;
    }
}
function sqlToProto(owner, sql) {
    if (sql instanceof Sql) {
        return { sqlId: sql._getSqlId(owner) };
    }
    else {
        return { sql: "" + sql };
    }
}

class Queue {
    #pushStack;
    #shiftStack;
    constructor() {
        this.#pushStack = [];
        this.#shiftStack = [];
    }
    get length() {
        return this.#pushStack.length + this.#shiftStack.length;
    }
    push(elem) {
        this.#pushStack.push(elem);
    }
    shift() {
        if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
            this.#shiftStack = this.#pushStack.reverse();
            this.#pushStack = [];
        }
        return this.#shiftStack.pop();
    }
    first() {
        return this.#shiftStack.length !== 0
            ? this.#shiftStack[this.#shiftStack.length - 1]
            : this.#pushStack[0];
    }
}

/** A statement that can be evaluated by the database. Besides the SQL text, it also contains the positional
 * and named arguments. */
let Stmt$2 = class Stmt {
    /** The SQL statement text. */
    sql;
    /** @private */
    _args;
    /** @private */
    _namedArgs;
    /** Initialize the statement with given SQL text. */
    constructor(sql) {
        this.sql = sql;
        this._args = [];
        this._namedArgs = new Map();
    }
    /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
    bindIndexes(values) {
        this._args.length = 0;
        for (const value of values) {
            this._args.push(valueToProto(value));
        }
        return this;
    }
    /** Binds a parameter by a 1-based index. */
    bindIndex(index, value) {
        if (index !== (index | 0) || index <= 0) {
            throw new RangeError("Index of a positional argument must be positive integer");
        }
        while (this._args.length < index) {
            this._args.push(null);
        }
        this._args[index - 1] = valueToProto(value);
        return this;
    }
    /** Binds a parameter by name. */
    bindName(name, value) {
        this._namedArgs.set(name, valueToProto(value));
        return this;
    }
    /** Clears all bindings. */
    unbindAll() {
        this._args.length = 0;
        this._namedArgs.clear();
        return this;
    }
};
function stmtToProto(sqlOwner, stmt, wantRows) {
    let inSql;
    let args = [];
    let namedArgs = [];
    if (stmt instanceof Stmt$2) {
        inSql = stmt.sql;
        args = stmt._args;
        for (const [name, value] of stmt._namedArgs.entries()) {
            namedArgs.push({ name, value });
        }
    }
    else if (Array.isArray(stmt)) {
        inSql = stmt[0];
        if (Array.isArray(stmt[1])) {
            args = stmt[1].map((arg) => valueToProto(arg));
        }
        else {
            namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
                return { name, value: valueToProto(value) };
            });
        }
    }
    else {
        inSql = stmt;
    }
    const { sql, sqlId } = sqlToProto(sqlOwner, inSql);
    return { sql, sqlId, args, namedArgs, wantRows };
}

/** A builder for creating a batch and executing it on the server. */
let Batch$2 = class Batch {
    /** @private */
    _stream;
    #useCursor;
    /** @private */
    _steps;
    #executed;
    /** @private */
    constructor(stream, useCursor) {
        this._stream = stream;
        this.#useCursor = useCursor;
        this._steps = [];
        this.#executed = false;
    }
    /** Return a builder for adding a step to the batch. */
    step() {
        return new BatchStep$2(this);
    }
    /** Execute the batch. */
    execute() {
        if (this.#executed) {
            throw new MisuseError("This batch has already been executed");
        }
        this.#executed = true;
        const batch = {
            steps: this._steps.map((step) => step.proto),
        };
        if (this.#useCursor) {
            return executeCursor(this._stream, this._steps, batch);
        }
        else {
            return executeRegular(this._stream, this._steps, batch);
        }
    }
};
function executeRegular(stream, steps, batch) {
    return stream._batch(batch).then((result) => {
        for (let step = 0; step < steps.length; ++step) {
            const stepResult = result.stepResults.get(step);
            const stepError = result.stepErrors.get(step);
            steps[step].callback(stepResult, stepError);
        }
    });
}
async function executeCursor(stream, steps, batch) {
    const cursor = await stream._openCursor(batch);
    try {
        let nextStep = 0;
        let beginEntry = undefined;
        let rows = [];
        for (;;) {
            const entry = await cursor.next();
            if (entry === undefined) {
                break;
            }
            if (entry.type === "step_begin") {
                if (entry.step < nextStep || entry.step >= steps.length) {
                    throw new ProtoError("Server produced StepBeginEntry for unexpected step");
                }
                else if (beginEntry !== undefined) {
                    throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
                }
                for (let step = nextStep; step < entry.step; ++step) {
                    steps[step].callback(undefined, undefined);
                }
                nextStep = entry.step + 1;
                beginEntry = entry;
                rows = [];
            }
            else if (entry.type === "step_end") {
                if (beginEntry === undefined) {
                    throw new ProtoError("Server produced StepEndEntry but no step is active");
                }
                const stmtResult = {
                    cols: beginEntry.cols,
                    rows,
                    affectedRowCount: entry.affectedRowCount,
                    lastInsertRowid: entry.lastInsertRowid,
                };
                steps[beginEntry.step].callback(stmtResult, undefined);
                beginEntry = undefined;
                rows = [];
            }
            else if (entry.type === "step_error") {
                if (beginEntry === undefined) {
                    if (entry.step >= steps.length) {
                        throw new ProtoError("Server produced StepErrorEntry for unexpected step");
                    }
                    for (let step = nextStep; step < entry.step; ++step) {
                        steps[step].callback(undefined, undefined);
                    }
                }
                else {
                    if (entry.step !== beginEntry.step) {
                        throw new ProtoError("Server produced StepErrorEntry for unexpected step");
                    }
                    beginEntry = undefined;
                    rows = [];
                }
                steps[entry.step].callback(undefined, entry.error);
                nextStep = entry.step + 1;
            }
            else if (entry.type === "row") {
                if (beginEntry === undefined) {
                    throw new ProtoError("Server produced RowEntry but no step is active");
                }
                rows.push(entry.row);
            }
            else if (entry.type === "error") {
                throw errorFromProto(entry.error);
            }
            else if (entry.type === "none") {
                throw new ProtoError("Server produced unrecognized CursorEntry");
            }
            else {
                throw impossible(entry, "Impossible CursorEntry");
            }
        }
        if (beginEntry !== undefined) {
            throw new ProtoError("Server closed Cursor before terminating active step");
        }
        for (let step = nextStep; step < steps.length; ++step) {
            steps[step].callback(undefined, undefined);
        }
    }
    finally {
        cursor.close();
    }
}
/** A builder for adding a step to the batch. */
let BatchStep$2 = class BatchStep {
    /** @private */
    _batch;
    #conds;
    /** @private */
    _index;
    /** @private */
    constructor(batch) {
        this._batch = batch;
        this.#conds = [];
        this._index = undefined;
    }
    /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
     * times, we join the conditions with a logical AND. */
    condition(cond) {
        this.#conds.push(cond._proto);
        return this;
    }
    /** Add a statement that returns rows. */
    query(stmt) {
        return this.#add(stmt, true, rowsResultFromProto);
    }
    /** Add a statement that returns at most a single row. */
    queryRow(stmt) {
        return this.#add(stmt, true, rowResultFromProto);
    }
    /** Add a statement that returns at most a single value. */
    queryValue(stmt) {
        return this.#add(stmt, true, valueResultFromProto);
    }
    /** Add a statement without returning rows. */
    run(stmt) {
        return this.#add(stmt, false, stmtResultFromProto);
    }
    #add(inStmt, wantRows, fromProto) {
        if (this._index !== undefined) {
            throw new MisuseError("This BatchStep has already been added to the batch");
        }
        const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
        let condition;
        if (this.#conds.length === 0) {
            condition = undefined;
        }
        else if (this.#conds.length === 1) {
            condition = this.#conds[0];
        }
        else {
            condition = { type: "and", conds: this.#conds.slice() };
        }
        const proto = { stmt, condition };
        return new Promise((outputCallback, errorCallback) => {
            const callback = (stepResult, stepError) => {
                if (stepResult !== undefined && stepError !== undefined) {
                    errorCallback(new ProtoError("Server returned both result and error"));
                }
                else if (stepError !== undefined) {
                    errorCallback(errorFromProto(stepError));
                }
                else if (stepResult !== undefined) {
                    outputCallback(fromProto(stepResult, this._batch._stream.intMode));
                }
                else {
                    outputCallback(undefined);
                }
            };
            this._index = this._batch._steps.length;
            this._batch._steps.push({ proto, callback });
        });
    }
};
let BatchCond$2 = class BatchCond {
    /** @private */
    _batch;
    /** @private */
    _proto;
    /** @private */
    constructor(batch, proto) {
        this._batch = batch;
        this._proto = proto;
    }
    /** Create a condition that evaluates to true when the given step executes successfully.
     *
     * If the given step fails error or is skipped because its condition evaluated to false, this
     * condition evaluates to false.
     */
    static ok(step) {
        return new BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
    }
    /** Create a condition that evaluates to true when the given step fails.
     *
     * If the given step succeeds or is skipped because its condition evaluated to false, this condition
     * evaluates to false.
     */
    static error(step) {
        return new BatchCond(step._batch, { type: "error", step: stepIndex(step) });
    }
    /** Create a condition that is a logical negation of another condition.
     */
    static not(cond) {
        return new BatchCond(cond._batch, { type: "not", cond: cond._proto });
    }
    /** Create a condition that is a logical AND of other conditions.
     */
    static and(batch, conds) {
        for (const cond of conds) {
            checkCondBatch(batch, cond);
        }
        return new BatchCond(batch, { type: "and", conds: conds.map(e => e._proto) });
    }
    /** Create a condition that is a logical OR of other conditions.
     */
    static or(batch, conds) {
        for (const cond of conds) {
            checkCondBatch(batch, cond);
        }
        return new BatchCond(batch, { type: "or", conds: conds.map(e => e._proto) });
    }
    /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    static isAutocommit(batch) {
        batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
        return new BatchCond(batch, { type: "is_autocommit" });
    }
};
function stepIndex(step) {
    if (step._index === undefined) {
        throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
    }
    return step._index;
}
function checkCondBatch(expectedBatch, cond) {
    if (cond._batch !== expectedBatch) {
        throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
    }
}

function describeResultFromProto(result) {
    return {
        paramNames: result.params.map((p) => p.name),
        columns: result.cols,
        isExplain: result.isExplain,
        isReadonly: result.isReadonly,
    };
}

/** A stream for executing SQL statements (a "database connection"). */
class Stream {
    /** @private */
    constructor(intMode) {
        this.intMode = intMode;
    }
    /** Execute a statement and return rows. */
    query(stmt) {
        return this.#execute(stmt, true, rowsResultFromProto);
    }
    /** Execute a statement and return at most a single row. */
    queryRow(stmt) {
        return this.#execute(stmt, true, rowResultFromProto);
    }
    /** Execute a statement and return at most a single value. */
    queryValue(stmt) {
        return this.#execute(stmt, true, valueResultFromProto);
    }
    /** Execute a statement without returning rows. */
    run(stmt) {
        return this.#execute(stmt, false, stmtResultFromProto);
    }
    #execute(inStmt, wantRows, fromProto) {
        const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
        return this._execute(stmt).then((r) => fromProto(r, this.intMode));
    }
    /** Return a builder for creating and executing a batch.
     *
     * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
     * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
     * higher.
     */
    batch(useCursor = false) {
        return new Batch$2(this, useCursor);
    }
    /** Parse and analyze a statement. This requires protocol version 2 or higher. */
    describe(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._describe(protoSql).then(describeResultFromProto);
    }
    /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
     * */
    sequence(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._sequence(protoSql);
    }
    /** Representation of integers returned from the database. See {@link IntMode}.
     *
     * This value affects the results of all operations on this stream.
     */
    intMode;
}

class Cursor {
}

const fetchChunkSize = 1000;
const fetchQueueSize = 10;
class WsCursor extends Cursor {
    #client;
    #stream;
    #cursorId;
    #entryQueue;
    #fetchQueue;
    #closed;
    #done;
    /** @private */
    constructor(client, stream, cursorId) {
        super();
        this.#client = client;
        this.#stream = stream;
        this.#cursorId = cursorId;
        this.#entryQueue = new Queue();
        this.#fetchQueue = new Queue();
        this.#closed = undefined;
        this.#done = false;
    }
    /** Fetch the next entry from the cursor. */
    async next() {
        for (;;) {
            if (this.#closed !== undefined) {
                throw new ClosedError("Cursor is closed", this.#closed);
            }
            while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
                this.#fetchQueue.push(this.#fetch());
            }
            const entry = this.#entryQueue.shift();
            if (this.#done || entry !== undefined) {
                return entry;
            }
            // we assume that `Cursor.next()` is never called concurrently
            await this.#fetchQueue.shift().then((response) => {
                if (response === undefined) {
                    return;
                }
                for (const entry of response.entries) {
                    this.#entryQueue.push(entry);
                }
                this.#done ||= response.done;
            });
        }
    }
    #fetch() {
        return this.#stream._sendCursorRequest(this, {
            type: "fetch_cursor",
            cursorId: this.#cursorId,
            maxCount: fetchChunkSize,
        }).then((resp) => resp, (error) => {
            this._setClosed(error);
            return undefined;
        });
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        this.#stream._sendCursorRequest(this, {
            type: "close_cursor",
            cursorId: this.#cursorId,
        }).catch(() => undefined);
        this.#stream._cursorClosed(this);
    }
    /** Close the cursor. */
    close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
    }
    /** True if the cursor is closed. */
    get closed() {
        return this.#closed !== undefined;
    }
}

class WsStream extends Stream {
    #client;
    #streamId;
    #queue;
    #cursor;
    #closing;
    #closed;
    /** @private */
    static open(client) {
        const streamId = client._streamIdAlloc.alloc();
        const stream = new WsStream(client, streamId);
        const responseCallback = () => undefined;
        const errorCallback = (e) => stream.#setClosed(e);
        const request = { type: "open_stream", streamId };
        client._sendRequest(request, { responseCallback, errorCallback });
        return stream;
    }
    /** @private */
    constructor(client, streamId) {
        super(client.intMode);
        this.#client = client;
        this.#streamId = streamId;
        this.#queue = new Queue();
        this.#cursor = undefined;
        this.#closing = false;
        this.#closed = undefined;
    }
    /** Get the {@link WsClient} object that this stream belongs to. */
    client() {
        return this.#client;
    }
    /** @private */
    _sqlOwner() {
        return this.#client;
    }
    /** @private */
    _execute(stmt) {
        return this.#sendStreamRequest({
            type: "execute",
            streamId: this.#streamId,
            stmt,
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _batch(batch) {
        return this.#sendStreamRequest({
            type: "batch",
            streamId: this.#streamId,
            batch,
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _describe(protoSql) {
        this.#client._ensureVersion(2, "describe()");
        return this.#sendStreamRequest({
            type: "describe",
            streamId: this.#streamId,
            sql: protoSql.sql,
            sqlId: protoSql.sqlId,
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _sequence(protoSql) {
        this.#client._ensureVersion(2, "sequence()");
        return this.#sendStreamRequest({
            type: "sequence",
            streamId: this.#streamId,
            sql: protoSql.sql,
            sqlId: protoSql.sqlId,
        }).then((_response) => {
            return undefined;
        });
    }
    /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
            type: "get_autocommit",
            streamId: this.#streamId,
        }).then((response) => {
            return response.isAutocommit;
        });
    }
    #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
            this.#pushToQueue({ type: "request", request, responseCallback, errorCallback });
        });
    }
    /** @private */
    _openCursor(batch) {
        this.#client._ensureVersion(3, "cursor");
        return new Promise((cursorCallback, errorCallback) => {
            this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
    }
    /** @private */
    _sendCursorRequest(cursor, request) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor not associated with the stream attempted to execute a request");
        }
        return new Promise((responseCallback, errorCallback) => {
            if (this.#closed !== undefined) {
                errorCallback(new ClosedError("Stream is closed", this.#closed));
            }
            else {
                this.#client._sendRequest(request, { responseCallback, errorCallback });
            }
        });
    }
    /** @private */
    _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = undefined;
        this.#flushQueue();
    }
    #pushToQueue(entry) {
        if (this.#closed !== undefined) {
            entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
        }
        else if (this.#closing) {
            entry.errorCallback(new ClosedError("Stream is closing", undefined));
        }
        else {
            this.#queue.push(entry);
            this.#flushQueue();
        }
    }
    #flushQueue() {
        for (;;) {
            const entry = this.#queue.first();
            if (entry === undefined && this.#cursor === undefined && this.#closing) {
                this.#setClosed(new ClientError("Stream was gracefully closed"));
                break;
            }
            else if (entry?.type === "request" && this.#cursor === undefined) {
                const { request, responseCallback, errorCallback } = entry;
                this.#queue.shift();
                this.#client._sendRequest(request, { responseCallback, errorCallback });
            }
            else if (entry?.type === "cursor" && this.#cursor === undefined) {
                const { batch, cursorCallback } = entry;
                this.#queue.shift();
                const cursorId = this.#client._cursorIdAlloc.alloc();
                const cursor = new WsCursor(this.#client, this, cursorId);
                const request = {
                    type: "open_cursor",
                    streamId: this.#streamId,
                    cursorId,
                    batch,
                };
                const responseCallback = () => undefined;
                const errorCallback = (e) => cursor._setClosed(e);
                this.#client._sendRequest(request, { responseCallback, errorCallback });
                this.#cursor = cursor;
                cursorCallback(cursor);
            }
            else {
                break;
            }
        }
    }
    #setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        if (this.#cursor !== undefined) {
            this.#cursor._setClosed(error);
        }
        for (;;) {
            const entry = this.#queue.shift();
            if (entry !== undefined) {
                entry.errorCallback(error);
            }
            else {
                break;
            }
        }
        const request = { type: "close_stream", streamId: this.#streamId };
        const responseCallback = () => this.#client._streamIdAlloc.free(this.#streamId);
        const errorCallback = () => undefined;
        this.#client._sendRequest(request, { responseCallback, errorCallback });
    }
    /** Immediately close the stream. */
    close() {
        this.#setClosed(new ClientError("Stream was manually closed"));
    }
    /** Gracefully close the stream. */
    closeGracefully() {
        this.#closing = true;
        this.#flushQueue();
    }
    /** True if the stream is closed or closing. */
    get closed() {
        return this.#closed !== undefined || this.#closing;
    }
}

function Stmt$1(w, msg) {
    if (msg.sql !== undefined) {
        w.string("sql", msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.number("sql_id", msg.sqlId);
    }
    w.arrayObjects("args", msg.args, Value$3);
    w.arrayObjects("named_args", msg.namedArgs, NamedArg$1);
    w.boolean("want_rows", msg.wantRows);
}
function NamedArg$1(w, msg) {
    w.string("name", msg.name);
    w.object("value", msg.value, Value$3);
}
function Batch$1(w, msg) {
    w.arrayObjects("steps", msg.steps, BatchStep$1);
}
function BatchStep$1(w, msg) {
    if (msg.condition !== undefined) {
        w.object("condition", msg.condition, BatchCond$1);
    }
    w.object("stmt", msg.stmt, Stmt$1);
}
function BatchCond$1(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "ok" || msg.type === "error") {
        w.number("step", msg.step);
    }
    else if (msg.type === "not") {
        w.object("cond", msg.cond, BatchCond$1);
    }
    else if (msg.type === "and" || msg.type === "or") {
        w.arrayObjects("conds", msg.conds, BatchCond$1);
    }
    else if (msg.type === "is_autocommit") ;
    else {
        throw impossible(msg, "Impossible type of BatchCond");
    }
}
function Value$3(w, msg) {
    if (msg === null) {
        w.stringRaw("type", "null");
    }
    else if (typeof msg === "bigint") {
        w.stringRaw("type", "integer");
        w.stringRaw("value", "" + msg);
    }
    else if (typeof msg === "number") {
        w.stringRaw("type", "float");
        w.number("value", msg);
    }
    else if (typeof msg === "string") {
        w.stringRaw("type", "text");
        w.string("value", msg);
    }
    else if (msg instanceof Uint8Array) {
        w.stringRaw("type", "blob");
        w.stringRaw("base64", gBase64.fromUint8Array(msg));
    }
    else if (msg === undefined) ;
    else {
        throw impossible(msg, "Impossible type of Value");
    }
}

function ClientMsg$1(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "hello") {
        if (msg.jwt !== undefined) {
            w.string("jwt", msg.jwt);
        }
    }
    else if (msg.type === "request") {
        w.number("request_id", msg.requestId);
        w.object("request", msg.request, Request$1);
    }
    else {
        throw impossible(msg, "Impossible type of ClientMsg");
    }
}
function Request$1(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "open_stream") {
        w.number("stream_id", msg.streamId);
    }
    else if (msg.type === "close_stream") {
        w.number("stream_id", msg.streamId);
    }
    else if (msg.type === "execute") {
        w.number("stream_id", msg.streamId);
        w.object("stmt", msg.stmt, Stmt$1);
    }
    else if (msg.type === "batch") {
        w.number("stream_id", msg.streamId);
        w.object("batch", msg.batch, Batch$1);
    }
    else if (msg.type === "open_cursor") {
        w.number("stream_id", msg.streamId);
        w.number("cursor_id", msg.cursorId);
        w.object("batch", msg.batch, Batch$1);
    }
    else if (msg.type === "close_cursor") {
        w.number("cursor_id", msg.cursorId);
    }
    else if (msg.type === "fetch_cursor") {
        w.number("cursor_id", msg.cursorId);
        w.number("max_count", msg.maxCount);
    }
    else if (msg.type === "sequence") {
        w.number("stream_id", msg.streamId);
        if (msg.sql !== undefined) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== undefined) {
            w.number("sql_id", msg.sqlId);
        }
    }
    else if (msg.type === "describe") {
        w.number("stream_id", msg.streamId);
        if (msg.sql !== undefined) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== undefined) {
            w.number("sql_id", msg.sqlId);
        }
    }
    else if (msg.type === "store_sql") {
        w.number("sql_id", msg.sqlId);
        w.string("sql", msg.sql);
    }
    else if (msg.type === "close_sql") {
        w.number("sql_id", msg.sqlId);
    }
    else if (msg.type === "get_autocommit") {
        w.number("stream_id", msg.streamId);
    }
    else {
        throw impossible(msg, "Impossible type of Request");
    }
}

function Stmt(w, msg) {
    if (msg.sql !== undefined) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.int32(2, msg.sqlId);
    }
    for (const arg of msg.args) {
        w.message(3, arg, Value$2);
    }
    for (const arg of msg.namedArgs) {
        w.message(4, arg, NamedArg);
    }
    w.bool(5, msg.wantRows);
}
function NamedArg(w, msg) {
    w.string(1, msg.name);
    w.message(2, msg.value, Value$2);
}
function Batch(w, msg) {
    for (const step of msg.steps) {
        w.message(1, step, BatchStep);
    }
}
function BatchStep(w, msg) {
    if (msg.condition !== undefined) {
        w.message(1, msg.condition, BatchCond);
    }
    w.message(2, msg.stmt, Stmt);
}
function BatchCond(w, msg) {
    if (msg.type === "ok") {
        w.uint32(1, msg.step);
    }
    else if (msg.type === "error") {
        w.uint32(2, msg.step);
    }
    else if (msg.type === "not") {
        w.message(3, msg.cond, BatchCond);
    }
    else if (msg.type === "and") {
        w.message(4, msg.conds, BatchCondList);
    }
    else if (msg.type === "or") {
        w.message(5, msg.conds, BatchCondList);
    }
    else if (msg.type === "is_autocommit") {
        w.message(6, undefined, Empty);
    }
    else {
        throw impossible(msg, "Impossible type of BatchCond");
    }
}
function BatchCondList(w, msg) {
    for (const cond of msg) {
        w.message(1, cond, BatchCond);
    }
}
function Value$2(w, msg) {
    if (msg === null) {
        w.message(1, undefined, Empty);
    }
    else if (typeof msg === "bigint") {
        w.sint64(2, msg);
    }
    else if (typeof msg === "number") {
        w.double(3, msg);
    }
    else if (typeof msg === "string") {
        w.string(4, msg);
    }
    else if (msg instanceof Uint8Array) {
        w.bytes(5, msg);
    }
    else if (msg === undefined) ;
    else {
        throw impossible(msg, "Impossible type of Value");
    }
}
function Empty(_w, _msg) {
    // do nothing
}

function ClientMsg(w, msg) {
    if (msg.type === "hello") {
        w.message(1, msg, HelloMsg);
    }
    else if (msg.type === "request") {
        w.message(2, msg, RequestMsg);
    }
    else {
        throw impossible(msg, "Impossible type of ClientMsg");
    }
}
function HelloMsg(w, msg) {
    if (msg.jwt !== undefined) {
        w.string(1, msg.jwt);
    }
}
function RequestMsg(w, msg) {
    w.int32(1, msg.requestId);
    const request = msg.request;
    if (request.type === "open_stream") {
        w.message(2, request, OpenStreamReq);
    }
    else if (request.type === "close_stream") {
        w.message(3, request, CloseStreamReq$1);
    }
    else if (request.type === "execute") {
        w.message(4, request, ExecuteReq);
    }
    else if (request.type === "batch") {
        w.message(5, request, BatchReq);
    }
    else if (request.type === "open_cursor") {
        w.message(6, request, OpenCursorReq);
    }
    else if (request.type === "close_cursor") {
        w.message(7, request, CloseCursorReq);
    }
    else if (request.type === "fetch_cursor") {
        w.message(8, request, FetchCursorReq);
    }
    else if (request.type === "sequence") {
        w.message(9, request, SequenceReq);
    }
    else if (request.type === "describe") {
        w.message(10, request, DescribeReq);
    }
    else if (request.type === "store_sql") {
        w.message(11, request, StoreSqlReq);
    }
    else if (request.type === "close_sql") {
        w.message(12, request, CloseSqlReq);
    }
    else if (request.type === "get_autocommit") {
        w.message(13, request, GetAutocommitReq);
    }
    else {
        throw impossible(request, "Impossible type of Request");
    }
}
function OpenStreamReq(w, msg) {
    w.int32(1, msg.streamId);
}
function CloseStreamReq$1(w, msg) {
    w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
    w.int32(1, msg.streamId);
    w.message(2, msg.stmt, Stmt);
}
function BatchReq(w, msg) {
    w.int32(1, msg.streamId);
    w.message(2, msg.batch, Batch);
}
function OpenCursorReq(w, msg) {
    w.int32(1, msg.streamId);
    w.int32(2, msg.cursorId);
    w.message(3, msg.batch, Batch);
}
function CloseCursorReq(w, msg) {
    w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
    w.int32(1, msg.cursorId);
    w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
    w.int32(1, msg.streamId);
    if (msg.sql !== undefined) {
        w.string(2, msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.int32(3, msg.sqlId);
    }
}
function DescribeReq(w, msg) {
    w.int32(1, msg.streamId);
    if (msg.sql !== undefined) {
        w.string(2, msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.int32(3, msg.sqlId);
    }
}
function StoreSqlReq(w, msg) {
    w.int32(1, msg.sqlId);
    w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
    w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
    w.int32(1, msg.streamId);
}

function Error$2(obj) {
    const message = string(obj["message"]);
    const code = stringOpt(obj["code"]);
    return { message, code };
}
function StmtResult$1(obj) {
    const cols = arrayObjectsMap(obj["cols"], Col$1);
    const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value$1));
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== undefined
        ? BigInt(lastInsertRowidStr) : undefined;
    return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col$1(obj) {
    const name = stringOpt(obj["name"]);
    const decltype = stringOpt(obj["decltype"]);
    return { name, decltype };
}
function BatchResult$1(obj) {
    const stepResults = new Map();
    array(obj["step_results"]).forEach((value, i) => {
        if (value !== null) {
            stepResults.set(i, StmtResult$1(object(value)));
        }
    });
    const stepErrors = new Map();
    array(obj["step_errors"]).forEach((value, i) => {
        if (value !== null) {
            stepErrors.set(i, Error$2(object(value)));
        }
    });
    return { stepResults, stepErrors };
}
function CursorEntry$1(obj) {
    const type = string(obj["type"]);
    if (type === "step_begin") {
        const step = number(obj["step"]);
        const cols = arrayObjectsMap(obj["cols"], Col$1);
        return { type: "step_begin", step, cols };
    }
    else if (type === "step_end") {
        const affectedRowCount = number(obj["affected_row_count"]);
        const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
        const lastInsertRowid = lastInsertRowidStr !== undefined
            ? BigInt(lastInsertRowidStr) : undefined;
        return { type: "step_end", affectedRowCount, lastInsertRowid };
    }
    else if (type === "step_error") {
        const step = number(obj["step"]);
        const error = Error$2(object(obj["error"]));
        return { type: "step_error", step, error };
    }
    else if (type === "row") {
        const row = arrayObjectsMap(obj["row"], Value$1);
        return { type: "row", row };
    }
    else if (type === "error") {
        const error = Error$2(object(obj["error"]));
        return { type: "error", error };
    }
    else {
        throw new ProtoError("Unexpected type of CursorEntry");
    }
}
function DescribeResult$1(obj) {
    const params = arrayObjectsMap(obj["params"], DescribeParam$1);
    const cols = arrayObjectsMap(obj["cols"], DescribeCol$1);
    const isExplain = boolean(obj["is_explain"]);
    const isReadonly = boolean(obj["is_readonly"]);
    return { params, cols, isExplain, isReadonly };
}
function DescribeParam$1(obj) {
    const name = stringOpt(obj["name"]);
    return { name };
}
function DescribeCol$1(obj) {
    const name = string(obj["name"]);
    const decltype = stringOpt(obj["decltype"]);
    return { name, decltype };
}
function Value$1(obj) {
    const type = string(obj["type"]);
    if (type === "null") {
        return null;
    }
    else if (type === "integer") {
        const value = string(obj["value"]);
        return BigInt(value);
    }
    else if (type === "float") {
        return number(obj["value"]);
    }
    else if (type === "text") {
        return string(obj["value"]);
    }
    else if (type === "blob") {
        return gBase64.toUint8Array(string(obj["base64"]));
    }
    else {
        throw new ProtoError("Unexpected type of Value");
    }
}

function ServerMsg$1(obj) {
    const type = string(obj["type"]);
    if (type === "hello_ok") {
        return { type: "hello_ok" };
    }
    else if (type === "hello_error") {
        const error = Error$2(object(obj["error"]));
        return { type: "hello_error", error };
    }
    else if (type === "response_ok") {
        const requestId = number(obj["request_id"]);
        const response = Response(object(obj["response"]));
        return { type: "response_ok", requestId, response };
    }
    else if (type === "response_error") {
        const requestId = number(obj["request_id"]);
        const error = Error$2(object(obj["error"]));
        return { type: "response_error", requestId, error };
    }
    else {
        throw new ProtoError("Unexpected type of ServerMsg");
    }
}
function Response(obj) {
    const type = string(obj["type"]);
    if (type === "open_stream") {
        return { type: "open_stream" };
    }
    else if (type === "close_stream") {
        return { type: "close_stream" };
    }
    else if (type === "execute") {
        const result = StmtResult$1(object(obj["result"]));
        return { type: "execute", result };
    }
    else if (type === "batch") {
        const result = BatchResult$1(object(obj["result"]));
        return { type: "batch", result };
    }
    else if (type === "open_cursor") {
        return { type: "open_cursor" };
    }
    else if (type === "close_cursor") {
        return { type: "close_cursor" };
    }
    else if (type === "fetch_cursor") {
        const entries = arrayObjectsMap(obj["entries"], CursorEntry$1);
        const done = boolean(obj["done"]);
        return { type: "fetch_cursor", entries, done };
    }
    else if (type === "sequence") {
        return { type: "sequence" };
    }
    else if (type === "describe") {
        const result = DescribeResult$1(object(obj["result"]));
        return { type: "describe", result };
    }
    else if (type === "store_sql") {
        return { type: "store_sql" };
    }
    else if (type === "close_sql") {
        return { type: "close_sql" };
    }
    else if (type === "get_autocommit") {
        const isAutocommit = boolean(obj["is_autocommit"]);
        return { type: "get_autocommit", isAutocommit };
    }
    else {
        throw new ProtoError("Unexpected type of Response");
    }
}

const Error$1 = {
    default() { return { message: "", code: undefined }; },
    1(r, msg) { msg.message = r.string(); },
    2(r, msg) { msg.code = r.string(); },
};
const StmtResult = {
    default() {
        return {
            cols: [],
            rows: [],
            affectedRowCount: 0,
            lastInsertRowid: undefined,
        };
    },
    1(r, msg) { msg.cols.push(r.message(Col)); },
    2(r, msg) { msg.rows.push(r.message(Row)); },
    3(r, msg) { msg.affectedRowCount = Number(r.uint64()); },
    4(r, msg) { msg.lastInsertRowid = r.sint64(); },
};
const Col = {
    default() { return { name: undefined, decltype: undefined }; },
    1(r, msg) { msg.name = r.string(); },
    2(r, msg) { msg.decltype = r.string(); },
};
const Row = {
    default() { return []; },
    1(r, msg) { msg.push(r.message(Value)); },
};
const BatchResult = {
    default() { return { stepResults: new Map(), stepErrors: new Map() }; },
    1(r, msg) {
        const [key, value] = r.message(BatchResultStepResult);
        msg.stepResults.set(key, value);
    },
    2(r, msg) {
        const [key, value] = r.message(BatchResultStepError);
        msg.stepErrors.set(key, value);
    },
};
const BatchResultStepResult = {
    default() { return [0, StmtResult.default()]; },
    1(r, msg) { msg[0] = r.uint32(); },
    2(r, msg) { msg[1] = r.message(StmtResult); },
};
const BatchResultStepError = {
    default() { return [0, Error$1.default()]; },
    1(r, msg) { msg[0] = r.uint32(); },
    2(r, msg) { msg[1] = r.message(Error$1); },
};
const CursorEntry = {
    default() { return { type: "none" }; },
    1(r) { return r.message(StepBeginEntry); },
    2(r) { return r.message(StepEndEntry); },
    3(r) { return r.message(StepErrorEntry); },
    4(r) { return { type: "row", row: r.message(Row) }; },
    5(r) { return { type: "error", error: r.message(Error$1) }; },
};
const StepBeginEntry = {
    default() { return { type: "step_begin", step: 0, cols: [] }; },
    1(r, msg) { msg.step = r.uint32(); },
    2(r, msg) { msg.cols.push(r.message(Col)); },
};
const StepEndEntry = {
    default() {
        return {
            type: "step_end",
            affectedRowCount: 0,
            lastInsertRowid: undefined,
        };
    },
    1(r, msg) { msg.affectedRowCount = r.uint32(); },
    2(r, msg) { msg.lastInsertRowid = r.uint64(); },
};
const StepErrorEntry = {
    default() {
        return {
            type: "step_error",
            step: 0,
            error: Error$1.default(),
        };
    },
    1(r, msg) { msg.step = r.uint32(); },
    2(r, msg) { msg.error = r.message(Error$1); },
};
const DescribeResult = {
    default() {
        return {
            params: [],
            cols: [],
            isExplain: false,
            isReadonly: false,
        };
    },
    1(r, msg) { msg.params.push(r.message(DescribeParam)); },
    2(r, msg) { msg.cols.push(r.message(DescribeCol)); },
    3(r, msg) { msg.isExplain = r.bool(); },
    4(r, msg) { msg.isReadonly = r.bool(); },
};
const DescribeParam = {
    default() { return { name: undefined }; },
    1(r, msg) { msg.name = r.string(); },
};
const DescribeCol = {
    default() { return { name: "", decltype: undefined }; },
    1(r, msg) { msg.name = r.string(); },
    2(r, msg) { msg.decltype = r.string(); },
};
const Value = {
    default() { return undefined; },
    1(r) { return null; },
    2(r) { return r.sint64(); },
    3(r) { return r.double(); },
    4(r) { return r.string(); },
    5(r) { return r.bytes(); },
};

const ServerMsg = {
    default() { return { type: "none" }; },
    1(r) { return { type: "hello_ok" }; },
    2(r) { return r.message(HelloErrorMsg); },
    3(r) { return r.message(ResponseOkMsg); },
    4(r) { return r.message(ResponseErrorMsg); },
};
const HelloErrorMsg = {
    default() { return { type: "hello_error", error: Error$1.default() }; },
    1(r, msg) { msg.error = r.message(Error$1); },
};
const ResponseErrorMsg = {
    default() { return { type: "response_error", requestId: 0, error: Error$1.default() }; },
    1(r, msg) { msg.requestId = r.int32(); },
    2(r, msg) { msg.error = r.message(Error$1); },
};
const ResponseOkMsg = {
    default() {
        return {
            type: "response_ok",
            requestId: 0,
            response: { type: "none" },
        };
    },
    1(r, msg) { msg.requestId = r.int32(); },
    2(r, msg) { msg.response = { type: "open_stream" }; },
    3(r, msg) { msg.response = { type: "close_stream" }; },
    4(r, msg) { msg.response = r.message(ExecuteResp); },
    5(r, msg) { msg.response = r.message(BatchResp); },
    6(r, msg) { msg.response = { type: "open_cursor" }; },
    7(r, msg) { msg.response = { type: "close_cursor" }; },
    8(r, msg) { msg.response = r.message(FetchCursorResp); },
    9(r, msg) { msg.response = { type: "sequence" }; },
    10(r, msg) { msg.response = r.message(DescribeResp); },
    11(r, msg) { msg.response = { type: "store_sql" }; },
    12(r, msg) { msg.response = { type: "close_sql" }; },
    13(r, msg) { msg.response = r.message(GetAutocommitResp); },
};
const ExecuteResp = {
    default() { return { type: "execute", result: StmtResult.default() }; },
    1(r, msg) { msg.result = r.message(StmtResult); },
};
const BatchResp = {
    default() { return { type: "batch", result: BatchResult.default() }; },
    1(r, msg) { msg.result = r.message(BatchResult); },
};
const FetchCursorResp = {
    default() { return { type: "fetch_cursor", entries: [], done: false }; },
    1(r, msg) { msg.entries.push(r.message(CursorEntry)); },
    2(r, msg) { msg.done = r.bool(); },
};
const DescribeResp = {
    default() { return { type: "describe", result: DescribeResult.default() }; },
    1(r, msg) { msg.result = r.message(DescribeResult); },
};
const GetAutocommitResp = {
    default() { return { type: "get_autocommit", isAutocommit: false }; },
    1(r, msg) { msg.isAutocommit = r.bool(); },
};

const subprotocolsV2 = new Map([
    ["hrana2", { version: 2, encoding: "json" }],
    ["hrana1", { version: 1, encoding: "json" }],
]);
const subprotocolsV3 = new Map([
    ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
    ["hrana3", { version: 3, encoding: "json" }],
    ["hrana2", { version: 2, encoding: "json" }],
    ["hrana1", { version: 1, encoding: "json" }],
]);
/** A client for the Hrana protocol over a WebSocket. */
let WsClient$1 = class WsClient extends Client {
    #socket;
    // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
    #openCallbacks;
    // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
    #opened;
    // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
    // `undefined`.
    #closed;
    // Have we received a response to our "hello" from the server?
    #recvdHello;
    // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
    // state.
    #subprotocol;
    // Has the `getVersion()` function been called? This is only used to validate that the API is used
    // correctly.
    #getVersionCalled;
    // A map from request id to the responses that we expect to receive from the server.
    #responseMap;
    // An allocator of request ids.
    #requestIdAlloc;
    // An allocator of stream ids.
    /** @private */
    _streamIdAlloc;
    // An allocator of cursor ids.
    /** @private */
    _cursorIdAlloc;
    // An allocator of SQL text ids.
    #sqlIdAlloc;
    /** @private */
    constructor(socket, jwt) {
        super();
        this.#socket = socket;
        this.#openCallbacks = [];
        this.#opened = false;
        this.#closed = undefined;
        this.#recvdHello = false;
        this.#subprotocol = undefined;
        this.#getVersionCalled = false;
        this.#responseMap = new Map();
        this.#requestIdAlloc = new IdAlloc();
        this._streamIdAlloc = new IdAlloc();
        this._cursorIdAlloc = new IdAlloc();
        this.#sqlIdAlloc = new IdAlloc();
        this.#socket.binaryType = "arraybuffer";
        this.#socket.addEventListener("open", () => this.#onSocketOpen());
        this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
        this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
        this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
        this.#send({ type: "hello", jwt });
    }
    // Send (or enqueue to send) a message to the server.
    #send(msg) {
        if (this.#closed !== undefined) {
            throw new InternalError("Trying to send a message on a closed client");
        }
        if (this.#opened) {
            this.#sendToSocket(msg);
        }
        else {
            const openCallback = () => this.#sendToSocket(msg);
            const errorCallback = () => undefined;
            this.#openCallbacks.push({ openCallback, errorCallback });
        }
    }
    // The socket transitioned from CONNECTING to OPEN
    #onSocketOpen() {
        const protocol = this.#socket.protocol;
        if (protocol === undefined) {
            this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket " +
                "implementation provided by the environment is broken. If you are using Miniflare 2, " +
                "please update to Miniflare 3, which fixes this problem."));
            return;
        }
        else if (protocol === "") {
            this.#subprotocol = { version: 1, encoding: "json" };
        }
        else {
            this.#subprotocol = subprotocolsV3.get(protocol);
            if (this.#subprotocol === undefined) {
                this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
                return;
            }
        }
        for (const callbacks of this.#openCallbacks) {
            callbacks.openCallback();
        }
        this.#openCallbacks.length = 0;
        this.#opened = true;
    }
    #sendToSocket(msg) {
        const encoding = this.#subprotocol.encoding;
        if (encoding === "json") {
            const jsonMsg = writeJsonObject(msg, ClientMsg$1);
            this.#socket.send(jsonMsg);
        }
        else if (encoding === "protobuf") {
            const protobufMsg = writeProtobufMessage(msg, ClientMsg);
            this.#socket.send(protobufMsg);
        }
        else {
            throw impossible(encoding, "Impossible encoding");
        }
    }
    /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
    getVersion() {
        return new Promise((versionCallback, errorCallback) => {
            this.#getVersionCalled = true;
            if (this.#closed !== undefined) {
                errorCallback(this.#closed);
            }
            else if (!this.#opened) {
                const openCallback = () => versionCallback(this.#subprotocol.version);
                this.#openCallbacks.push({ openCallback, errorCallback });
            }
            else {
                versionCallback(this.#subprotocol.version);
            }
        });
    }
    // Make sure that the negotiated version is at least `minVersion`.
    /** @private */
    _ensureVersion(minVersion, feature) {
        if (this.#subprotocol === undefined || !this.#getVersionCalled) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, ` +
                "but the version supported by the WebSocket server is not yet known. " +
                "Use Client.getVersion() to wait until the version is available.");
        }
        else if (this.#subprotocol.version < minVersion) {
            throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, ` +
                `but the WebSocket server only supports version ${this.#subprotocol.version}`);
        }
    }
    // Send a request to the server and invoke a callback when we get the response.
    /** @private */
    _sendRequest(request, callbacks) {
        if (this.#closed !== undefined) {
            callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
            return;
        }
        const requestId = this.#requestIdAlloc.alloc();
        this.#responseMap.set(requestId, { ...callbacks, type: request.type });
        this.#send({ type: "request", requestId, request });
    }
    // The socket encountered an error.
    #onSocketError(event) {
        const eventMessage = event.message;
        const message = eventMessage ?? "WebSocket was closed due to an error";
        this.#setClosed(new WebSocketError(message));
    }
    // The socket was closed.
    #onSocketClose(event) {
        let message = `WebSocket was closed with code ${event.code}`;
        if (event.reason) {
            message += `: ${event.reason}`;
        }
        this.#setClosed(new WebSocketError(message));
    }
    // Close the client with the given error.
    #setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        for (const callbacks of this.#openCallbacks) {
            callbacks.errorCallback(error);
        }
        this.#openCallbacks.length = 0;
        for (const [requestId, responseState] of this.#responseMap.entries()) {
            responseState.errorCallback(error);
            this.#requestIdAlloc.free(requestId);
        }
        this.#responseMap.clear();
        this.#socket.close();
    }
    // We received a message from the socket.
    #onSocketMessage(event) {
        if (this.#closed !== undefined) {
            return;
        }
        try {
            let msg;
            const encoding = this.#subprotocol.encoding;
            if (encoding === "json") {
                if (typeof event.data !== "string") {
                    this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
                    this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
                    return;
                }
                msg = readJsonObject(JSON.parse(event.data), ServerMsg$1);
            }
            else if (encoding === "protobuf") {
                if (!(event.data instanceof ArrayBuffer)) {
                    this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
                    this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
                    return;
                }
                msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg);
            }
            else {
                throw impossible(encoding, "Impossible encoding");
            }
            this.#handleMsg(msg);
        }
        catch (e) {
            this.#socket.close(3007, "Could not handle message");
            this.#setClosed(e);
        }
    }
    // Handle a message from the server.
    #handleMsg(msg) {
        if (msg.type === "none") {
            throw new ProtoError("Received an unrecognized ServerMsg");
        }
        else if (msg.type === "hello_ok" || msg.type === "hello_error") {
            if (this.#recvdHello) {
                throw new ProtoError("Received a duplicated hello response");
            }
            this.#recvdHello = true;
            if (msg.type === "hello_error") {
                throw errorFromProto(msg.error);
            }
            return;
        }
        else if (!this.#recvdHello) {
            throw new ProtoError("Received a non-hello message before a hello response");
        }
        if (msg.type === "response_ok") {
            const requestId = msg.requestId;
            const responseState = this.#responseMap.get(requestId);
            this.#responseMap.delete(requestId);
            if (responseState === undefined) {
                throw new ProtoError("Received unexpected OK response");
            }
            this.#requestIdAlloc.free(requestId);
            try {
                if (responseState.type !== msg.response.type) {
                    console.dir({ responseState, msg });
                    throw new ProtoError("Received unexpected type of response");
                }
                responseState.responseCallback(msg.response);
            }
            catch (e) {
                responseState.errorCallback(e);
                throw e;
            }
        }
        else if (msg.type === "response_error") {
            const requestId = msg.requestId;
            const responseState = this.#responseMap.get(requestId);
            this.#responseMap.delete(requestId);
            if (responseState === undefined) {
                throw new ProtoError("Received unexpected error response");
            }
            this.#requestIdAlloc.free(requestId);
            responseState.errorCallback(errorFromProto(msg.error));
        }
        else {
            throw impossible(msg, "Impossible ServerMsg type");
        }
    }
    /** Open a {@link WsStream}, a stream for executing SQL statements. */
    openStream() {
        return WsStream.open(this);
    }
    /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
    storeSql(sql) {
        this._ensureVersion(2, "storeSql()");
        const sqlId = this.#sqlIdAlloc.alloc();
        const sqlObj = new Sql(this, sqlId);
        const responseCallback = () => undefined;
        const errorCallback = (e) => sqlObj._setClosed(e);
        const request = { type: "store_sql", sqlId, sql };
        this._sendRequest(request, { responseCallback, errorCallback });
        return sqlObj;
    }
    /** @private */
    _closeSql(sqlId) {
        if (this.#closed !== undefined) {
            return;
        }
        const responseCallback = () => this.#sqlIdAlloc.free(sqlId);
        const errorCallback = (e) => this.#setClosed(e);
        const request = { type: "close_sql", sqlId };
        this._sendRequest(request, { responseCallback, errorCallback });
    }
    /** Close the client and the WebSocket. */
    close() {
        this.#setClosed(new ClientError("Client was manually closed"));
    }
    /** True if the client is closed. */
    get closed() {
        return this.#closed !== undefined;
    }
};

const _fetch = fetch;
const _Request = Request;
const _Headers = Headers;

// queueMicrotask() ponyfill
// https://github.com/libsql/libsql-client-ts/issues/47
let _queueMicrotask;
if (typeof queueMicrotask !== "undefined") {
    _queueMicrotask = queueMicrotask;
}
else {
    const resolved = Promise.resolve();
    _queueMicrotask = (callback) => {
        resolved.then(callback);
    };
}

class ByteQueue {
    #array;
    #shiftPos;
    #pushPos;
    constructor(initialCap) {
        this.#array = new Uint8Array(new ArrayBuffer(initialCap));
        this.#shiftPos = 0;
        this.#pushPos = 0;
    }
    get length() {
        return this.#pushPos - this.#shiftPos;
    }
    data() {
        return this.#array.slice(this.#shiftPos, this.#pushPos);
    }
    push(chunk) {
        this.#ensurePush(chunk.byteLength);
        this.#array.set(chunk, this.#pushPos);
        this.#pushPos += chunk.byteLength;
    }
    #ensurePush(pushLength) {
        if (this.#pushPos + pushLength <= this.#array.byteLength) {
            return;
        }
        const filledLength = this.#pushPos - this.#shiftPos;
        if (filledLength + pushLength <= this.#array.byteLength &&
            2 * this.#pushPos >= this.#array.byteLength) {
            this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
        }
        else {
            let newCap = this.#array.byteLength;
            do {
                newCap *= 2;
            } while (filledLength + pushLength > newCap);
            const newArray = new Uint8Array(new ArrayBuffer(newCap));
            newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
            this.#array = newArray;
        }
        this.#pushPos = filledLength;
        this.#shiftPos = 0;
    }
    shift(length) {
        this.#shiftPos += length;
    }
}

function PipelineRespBody$1(obj) {
    const baton = stringOpt(obj["baton"]);
    const baseUrl = stringOpt(obj["base_url"]);
    const results = arrayObjectsMap(obj["results"], StreamResult$1);
    return { baton, baseUrl, results };
}
function StreamResult$1(obj) {
    const type = string(obj["type"]);
    if (type === "ok") {
        const response = StreamResponse$1(object(obj["response"]));
        return { type: "ok", response };
    }
    else if (type === "error") {
        const error = Error$2(object(obj["error"]));
        return { type: "error", error };
    }
    else {
        throw new ProtoError("Unexpected type of StreamResult");
    }
}
function StreamResponse$1(obj) {
    const type = string(obj["type"]);
    if (type === "close") {
        return { type: "close" };
    }
    else if (type === "execute") {
        const result = StmtResult$1(object(obj["result"]));
        return { type: "execute", result };
    }
    else if (type === "batch") {
        const result = BatchResult$1(object(obj["result"]));
        return { type: "batch", result };
    }
    else if (type === "sequence") {
        return { type: "sequence" };
    }
    else if (type === "describe") {
        const result = DescribeResult$1(object(obj["result"]));
        return { type: "describe", result };
    }
    else if (type === "store_sql") {
        return { type: "store_sql" };
    }
    else if (type === "close_sql") {
        return { type: "close_sql" };
    }
    else if (type === "get_autocommit") {
        const isAutocommit = boolean(obj["is_autocommit"]);
        return { type: "get_autocommit", isAutocommit };
    }
    else {
        throw new ProtoError("Unexpected type of StreamResponse");
    }
}
function CursorRespBody$1(obj) {
    const baton = stringOpt(obj["baton"]);
    const baseUrl = stringOpt(obj["base_url"]);
    return { baton, baseUrl };
}

const PipelineRespBody = {
    default() { return { baton: undefined, baseUrl: undefined, results: [] }; },
    1(r, msg) { msg.baton = r.string(); },
    2(r, msg) { msg.baseUrl = r.string(); },
    3(r, msg) { msg.results.push(r.message(StreamResult)); },
};
const StreamResult = {
    default() { return { type: "none" }; },
    1(r) { return { type: "ok", response: r.message(StreamResponse) }; },
    2(r) { return { type: "error", error: r.message(Error$1) }; },
};
const StreamResponse = {
    default() { return { type: "none" }; },
    1(r) { return { type: "close" }; },
    2(r) { return r.message(ExecuteStreamResp); },
    3(r) { return r.message(BatchStreamResp); },
    4(r) { return { type: "sequence" }; },
    5(r) { return r.message(DescribeStreamResp); },
    6(r) { return { type: "store_sql" }; },
    7(r) { return { type: "close_sql" }; },
    8(r) { return r.message(GetAutocommitStreamResp); },
};
const ExecuteStreamResp = {
    default() { return { type: "execute", result: StmtResult.default() }; },
    1(r, msg) { msg.result = r.message(StmtResult); },
};
const BatchStreamResp = {
    default() { return { type: "batch", result: BatchResult.default() }; },
    1(r, msg) { msg.result = r.message(BatchResult); },
};
const DescribeStreamResp = {
    default() { return { type: "describe", result: DescribeResult.default() }; },
    1(r, msg) { msg.result = r.message(DescribeResult); },
};
const GetAutocommitStreamResp = {
    default() { return { type: "get_autocommit", isAutocommit: false }; },
    1(r, msg) { msg.isAutocommit = r.bool(); },
};
const CursorRespBody = {
    default() { return { baton: undefined, baseUrl: undefined }; },
    1(r, msg) { msg.baton = r.string(); },
    2(r, msg) { msg.baseUrl = r.string(); },
};

class HttpCursor extends Cursor {
    #stream;
    #encoding;
    #reader;
    #queue;
    #closed;
    #done;
    /** @private */
    constructor(stream, encoding) {
        super();
        this.#stream = stream;
        this.#encoding = encoding;
        this.#reader = undefined;
        this.#queue = new ByteQueue(16 * 1024);
        this.#closed = undefined;
        this.#done = false;
    }
    async open(response) {
        if (response.body === null) {
            throw new ProtoError("No response body for cursor request");
        }
        this.#reader = response.body.getReader();
        const respBody = await this.#nextItem(CursorRespBody$1, CursorRespBody);
        if (respBody === undefined) {
            throw new ProtoError("Empty response to cursor request");
        }
        return respBody;
    }
    /** Fetch the next entry from the cursor. */
    next() {
        return this.#nextItem(CursorEntry$1, CursorEntry);
    }
    /** Close the cursor. */
    close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        this.#stream._cursorClosed(this);
        if (this.#reader !== undefined) {
            this.#reader.cancel();
        }
    }
    /** True if the cursor is closed. */
    get closed() {
        return this.#closed !== undefined;
    }
    async #nextItem(jsonFun, protobufDef) {
        for (;;) {
            if (this.#done) {
                return undefined;
            }
            else if (this.#closed !== undefined) {
                throw new ClosedError("Cursor is closed", this.#closed);
            }
            if (this.#encoding === "json") {
                const jsonData = this.#parseItemJson();
                if (jsonData !== undefined) {
                    const jsonText = new TextDecoder().decode(jsonData);
                    const jsonValue = JSON.parse(jsonText);
                    return readJsonObject(jsonValue, jsonFun);
                }
            }
            else if (this.#encoding === "protobuf") {
                const protobufData = this.#parseItemProtobuf();
                if (protobufData !== undefined) {
                    return readProtobufMessage(protobufData, protobufDef);
                }
            }
            else {
                throw impossible(this.#encoding, "Impossible encoding");
            }
            if (this.#reader === undefined) {
                throw new InternalError("Attempted to read from HTTP cursor before it was opened");
            }
            const { value, done } = await this.#reader.read();
            if (done && this.#queue.length === 0) {
                this.#done = true;
            }
            else if (done) {
                throw new ProtoError("Unexpected end of cursor stream");
            }
            else {
                this.#queue.push(value);
            }
        }
    }
    #parseItemJson() {
        const data = this.#queue.data();
        const newlineByte = 10;
        const newlinePos = data.indexOf(newlineByte);
        if (newlinePos < 0) {
            return undefined;
        }
        const jsonData = data.slice(0, newlinePos);
        this.#queue.shift(newlinePos + 1);
        return jsonData;
    }
    #parseItemProtobuf() {
        const data = this.#queue.data();
        let varintValue = 0;
        let varintLength = 0;
        for (;;) {
            if (varintLength >= data.byteLength) {
                return undefined;
            }
            const byte = data[varintLength];
            varintValue |= (byte & 0x7f) << (7 * varintLength);
            varintLength += 1;
            if (!(byte & 0x80)) {
                break;
            }
        }
        if (data.byteLength < varintLength + varintValue) {
            return undefined;
        }
        const protobufData = data.slice(varintLength, varintLength + varintValue);
        this.#queue.shift(varintLength + varintValue);
        return protobufData;
    }
}

function PipelineReqBody$1(w, msg) {
    if (msg.baton !== undefined) {
        w.string("baton", msg.baton);
    }
    w.arrayObjects("requests", msg.requests, StreamRequest$1);
}
function StreamRequest$1(w, msg) {
    w.stringRaw("type", msg.type);
    if (msg.type === "close") ;
    else if (msg.type === "execute") {
        w.object("stmt", msg.stmt, Stmt$1);
    }
    else if (msg.type === "batch") {
        w.object("batch", msg.batch, Batch$1);
    }
    else if (msg.type === "sequence") {
        if (msg.sql !== undefined) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== undefined) {
            w.number("sql_id", msg.sqlId);
        }
    }
    else if (msg.type === "describe") {
        if (msg.sql !== undefined) {
            w.string("sql", msg.sql);
        }
        if (msg.sqlId !== undefined) {
            w.number("sql_id", msg.sqlId);
        }
    }
    else if (msg.type === "store_sql") {
        w.number("sql_id", msg.sqlId);
        w.string("sql", msg.sql);
    }
    else if (msg.type === "close_sql") {
        w.number("sql_id", msg.sqlId);
    }
    else if (msg.type === "get_autocommit") ;
    else {
        throw impossible(msg, "Impossible type of StreamRequest");
    }
}
function CursorReqBody$1(w, msg) {
    if (msg.baton !== undefined) {
        w.string("baton", msg.baton);
    }
    w.object("batch", msg.batch, Batch$1);
}

function PipelineReqBody(w, msg) {
    if (msg.baton !== undefined) {
        w.string(1, msg.baton);
    }
    for (const req of msg.requests) {
        w.message(2, req, StreamRequest);
    }
}
function StreamRequest(w, msg) {
    if (msg.type === "close") {
        w.message(1, msg, CloseStreamReq);
    }
    else if (msg.type === "execute") {
        w.message(2, msg, ExecuteStreamReq);
    }
    else if (msg.type === "batch") {
        w.message(3, msg, BatchStreamReq);
    }
    else if (msg.type === "sequence") {
        w.message(4, msg, SequenceStreamReq);
    }
    else if (msg.type === "describe") {
        w.message(5, msg, DescribeStreamReq);
    }
    else if (msg.type === "store_sql") {
        w.message(6, msg, StoreSqlStreamReq);
    }
    else if (msg.type === "close_sql") {
        w.message(7, msg, CloseSqlStreamReq);
    }
    else if (msg.type === "get_autocommit") {
        w.message(8, msg, GetAutocommitStreamReq);
    }
    else {
        throw impossible(msg, "Impossible type of StreamRequest");
    }
}
function CloseStreamReq(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
    w.message(1, msg.stmt, Stmt);
}
function BatchStreamReq(w, msg) {
    w.message(1, msg.batch, Batch);
}
function SequenceStreamReq(w, msg) {
    if (msg.sql !== undefined) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.int32(2, msg.sqlId);
    }
}
function DescribeStreamReq(w, msg) {
    if (msg.sql !== undefined) {
        w.string(1, msg.sql);
    }
    if (msg.sqlId !== undefined) {
        w.int32(2, msg.sqlId);
    }
}
function StoreSqlStreamReq(w, msg) {
    w.int32(1, msg.sqlId);
    w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
    w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody(w, msg) {
    if (msg.baton !== undefined) {
        w.string(1, msg.baton);
    }
    w.message(2, msg.batch, Batch);
}

class HttpStream extends Stream {
    #client;
    #baseUrl;
    #jwt;
    #fetch;
    #baton;
    #queue;
    #flushing;
    #cursor;
    #closing;
    #closeQueued;
    #closed;
    #sqlIdAlloc;
    /** @private */
    constructor(client, baseUrl, jwt, customFetch) {
        super(client.intMode);
        this.#client = client;
        this.#baseUrl = baseUrl.toString();
        this.#jwt = jwt;
        this.#fetch = customFetch;
        this.#baton = undefined;
        this.#queue = new Queue();
        this.#flushing = false;
        this.#closing = false;
        this.#closeQueued = false;
        this.#closed = undefined;
        this.#sqlIdAlloc = new IdAlloc();
    }
    /** Get the {@link HttpClient} object that this stream belongs to. */
    client() {
        return this.#client;
    }
    /** @private */
    _sqlOwner() {
        return this;
    }
    /** Cache a SQL text on the server. */
    storeSql(sql) {
        const sqlId = this.#sqlIdAlloc.alloc();
        this.#sendStreamRequest({ type: "store_sql", sqlId, sql }).then(() => undefined, (error) => this._setClosed(error));
        return new Sql(this, sqlId);
    }
    /** @private */
    _closeSql(sqlId) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error) => this._setClosed(error));
    }
    /** @private */
    _execute(stmt) {
        return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _batch(batch) {
        return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _describe(protoSql) {
        return this.#sendStreamRequest({
            type: "describe",
            sql: protoSql.sql,
            sqlId: protoSql.sqlId
        }).then((response) => {
            return response.result;
        });
    }
    /** @private */
    _sequence(protoSql) {
        return this.#sendStreamRequest({
            type: "sequence",
            sql: protoSql.sql,
            sqlId: protoSql.sqlId,
        }).then((_response) => {
            return undefined;
        });
    }
    /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
     * explicit transaction). This requires protocol version 3 or higher.
     */
    getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
            type: "get_autocommit",
        }).then((response) => {
            return response.isAutocommit;
        });
    }
    #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
            this.#pushToQueue({ type: "pipeline", request, responseCallback, errorCallback });
        });
    }
    /** @private */
    _openCursor(batch) {
        return new Promise((cursorCallback, errorCallback) => {
            this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
    }
    /** @private */
    _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
            throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = undefined;
        _queueMicrotask(() => this.#flushQueue());
    }
    /** Immediately close the stream. */
    close() {
        this._setClosed(new ClientError("Stream was manually closed"));
    }
    /** Gracefully close the stream. */
    closeGracefully() {
        this.#closing = true;
        _queueMicrotask(() => this.#flushQueue());
    }
    /** True if the stream is closed. */
    get closed() {
        return this.#closed !== undefined || this.#closing;
    }
    /** @private */
    _setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        if (this.#cursor !== undefined) {
            this.#cursor._setClosed(error);
        }
        this.#client._streamClosed(this);
        for (;;) {
            const entry = this.#queue.shift();
            if (entry !== undefined) {
                entry.errorCallback(error);
            }
            else {
                break;
            }
        }
        if ((this.#baton !== undefined || this.#flushing) && !this.#closeQueued) {
            this.#queue.push({
                type: "pipeline",
                request: { type: "close" },
                responseCallback: () => undefined,
                errorCallback: () => undefined,
            });
            this.#closeQueued = true;
            _queueMicrotask(() => this.#flushQueue());
        }
    }
    #pushToQueue(entry) {
        if (this.#closed !== undefined) {
            throw new ClosedError("Stream is closed", this.#closed);
        }
        else if (this.#closing) {
            throw new ClosedError("Stream is closing", undefined);
        }
        else {
            this.#queue.push(entry);
            _queueMicrotask(() => this.#flushQueue());
        }
    }
    #flushQueue() {
        if (this.#flushing || this.#cursor !== undefined) {
            return;
        }
        if (this.#closing && this.#queue.length === 0) {
            this._setClosed(new ClientError("Stream was gracefully closed"));
            return;
        }
        const endpoint = this.#client._endpoint;
        if (endpoint === undefined) {
            this.#client._endpointPromise.then(() => this.#flushQueue(), (error) => this._setClosed(error));
            return;
        }
        const firstEntry = this.#queue.shift();
        if (firstEntry === undefined) {
            return;
        }
        else if (firstEntry.type === "pipeline") {
            const pipeline = [firstEntry];
            for (;;) {
                const entry = this.#queue.first();
                if (entry !== undefined && entry.type === "pipeline") {
                    pipeline.push(entry);
                    this.#queue.shift();
                }
                else if (entry === undefined && this.#closing && !this.#closeQueued) {
                    pipeline.push({
                        type: "pipeline",
                        request: { type: "close" },
                        responseCallback: () => undefined,
                        errorCallback: () => undefined,
                    });
                    this.#closeQueued = true;
                    break;
                }
                else {
                    break;
                }
            }
            this.#flushPipeline(endpoint, pipeline);
        }
        else if (firstEntry.type === "cursor") {
            this.#flushCursor(endpoint, firstEntry);
        }
        else {
            throw impossible(firstEntry, "Impossible type of QueueEntry");
        }
    }
    #flushPipeline(endpoint, pipeline) {
        this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error) => pipeline.forEach((entry) => entry.errorCallback(error)));
    }
    #flushCursor(endpoint, entry) {
        const cursor = new HttpCursor(this, endpoint.encoding);
        this.#cursor = cursor;
        this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error) => entry.errorCallback(error));
    }
    #flush(createRequest, decodeResponse, getBaton, getBaseUrl, handleResponse, handleError) {
        let promise;
        try {
            const request = createRequest();
            const fetch = this.#fetch;
            promise = fetch(request);
        }
        catch (error) {
            promise = Promise.reject(error);
        }
        this.#flushing = true;
        promise.then((resp) => {
            if (!resp.ok) {
                return errorFromResponse(resp).then((error) => {
                    throw error;
                });
            }
            return decodeResponse(resp);
        }).then((r) => {
            this.#baton = getBaton(r);
            this.#baseUrl = getBaseUrl(r) ?? this.#baseUrl;
            handleResponse(r);
        }).catch((error) => {
            this._setClosed(error);
            handleError(error);
        }).finally(() => {
            this.#flushing = false;
            this.#flushQueue();
        });
    }
    #createPipelineRequest(pipeline, endpoint) {
        return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
            baton: this.#baton,
            requests: pipeline.map((entry) => entry.request),
        }, endpoint.encoding, PipelineReqBody$1, PipelineReqBody);
    }
    #createCursorRequest(entry, endpoint) {
        if (endpoint.cursorPath === undefined) {
            throw new ProtocolVersionError("Cursors are supported only on protocol version 3 and higher, " +
                `but the HTTP server only supports version ${endpoint.version}.`);
        }
        return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
            baton: this.#baton,
            batch: entry.batch,
        }, endpoint.encoding, CursorReqBody$1, CursorReqBody);
    }
    #createRequest(url, reqBody, encoding, jsonFun, protobufFun) {
        let bodyData;
        let contentType;
        if (encoding === "json") {
            bodyData = writeJsonObject(reqBody, jsonFun);
            contentType = "application/json";
        }
        else if (encoding === "protobuf") {
            bodyData = writeProtobufMessage(reqBody, protobufFun);
            contentType = "application/x-protobuf";
        }
        else {
            throw impossible(encoding, "Impossible encoding");
        }
        const headers = new _Headers();
        headers.set("content-type", contentType);
        if (this.#jwt !== undefined) {
            headers.set("authorization", `Bearer ${this.#jwt}`);
        }
        return new _Request(url.toString(), { method: "POST", headers, body: bodyData });
    }
}
function handlePipelineResponse(pipeline, respBody) {
    if (respBody.results.length !== pipeline.length) {
        throw new ProtoError("Server returned unexpected number of pipeline results");
    }
    for (let i = 0; i < pipeline.length; ++i) {
        const result = respBody.results[i];
        const entry = pipeline[i];
        if (result.type === "ok") {
            if (result.response.type !== entry.request.type) {
                throw new ProtoError("Received unexpected type of response");
            }
            entry.responseCallback(result.response);
        }
        else if (result.type === "error") {
            entry.errorCallback(errorFromProto(result.error));
        }
        else if (result.type === "none") {
            throw new ProtoError("Received unrecognized type of StreamResult");
        }
        else {
            throw impossible(result, "Received impossible type of StreamResult");
        }
    }
}
async function decodePipelineResponse(resp, encoding) {
    if (encoding === "json") {
        const respJson = await resp.json();
        return readJsonObject(respJson, PipelineRespBody$1);
    }
    if (encoding === "protobuf") {
        const respData = await resp.arrayBuffer();
        return readProtobufMessage(new Uint8Array(respData), PipelineRespBody);
    }
    await resp.body?.cancel();
    throw impossible(encoding, "Impossible encoding");
}
async function errorFromResponse(resp) {
    const respType = resp.headers.get("content-type") ?? "text/plain";
    let message = `Server returned HTTP status ${resp.status}`;
    if (respType === "application/json") {
        const respBody = await resp.json();
        if ("message" in respBody) {
            return errorFromProto(respBody);
        }
        return new HttpServerError(message, resp.status);
    }
    if (respType === "text/plain") {
        const respBody = (await resp.text()).trim();
        if (respBody !== "") {
            message += `: ${respBody}`;
        }
        return new HttpServerError(message, resp.status);
    }
    await resp.body?.cancel();
    return new HttpServerError(message, resp.status);
}

const checkEndpoints = [
    {
        versionPath: "v3-protobuf",
        pipelinePath: "v3-protobuf/pipeline",
        cursorPath: "v3-protobuf/cursor",
        version: 3,
        encoding: "protobuf",
    },
    /*
    {
        versionPath: "v3",
        pipelinePath: "v3/pipeline",
        cursorPath: "v3/cursor",
        version: 3,
        encoding: "json",
    },
    */
];
const fallbackEndpoint = {
    versionPath: "v2",
    pipelinePath: "v2/pipeline",
    cursorPath: undefined,
    version: 2,
    encoding: "json",
};
/** A client for the Hrana protocol over HTTP. */
let HttpClient$1 = class HttpClient extends Client {
    #url;
    #jwt;
    #fetch;
    #closed;
    #streams;
    /** @private */
    _endpointPromise;
    /** @private */
    _endpoint;
    /** @private */
    constructor(url, jwt, customFetch, protocolVersion = 2) {
        super();
        this.#url = url;
        this.#jwt = jwt;
        this.#fetch = customFetch ?? _fetch;
        this.#closed = undefined;
        this.#streams = new Set();
        if (protocolVersion == 3) {
            this._endpointPromise = findEndpoint(this.#fetch, this.#url);
            this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        }
        else {
            this._endpointPromise = Promise.resolve(fallbackEndpoint);
            this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        }
    }
    /** Get the protocol version supported by the server. */
    async getVersion() {
        if (this._endpoint !== undefined) {
            return this._endpoint.version;
        }
        return (await this._endpointPromise).version;
    }
    // Make sure that the negotiated version is at least `minVersion`.
    /** @private */
    _ensureVersion(minVersion, feature) {
        if (minVersion <= fallbackEndpoint.version) {
            return;
        }
        else if (this._endpoint === undefined) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, ` +
                "but the version supported by the HTTP server is not yet known. " +
                "Use Client.getVersion() to wait until the version is available.");
        }
        else if (this._endpoint.version < minVersion) {
            throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, ` +
                `but the HTTP server only supports version ${this._endpoint.version}.`);
        }
    }
    /** Open a {@link HttpStream}, a stream for executing SQL statements. */
    openStream() {
        if (this.#closed !== undefined) {
            throw new ClosedError("Client is closed", this.#closed);
        }
        const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch);
        this.#streams.add(stream);
        return stream;
    }
    /** @private */
    _streamClosed(stream) {
        this.#streams.delete(stream);
    }
    /** Close the client and all its streams. */
    close() {
        this.#setClosed(new ClientError("Client was manually closed"));
    }
    /** True if the client is closed. */
    get closed() {
        return this.#closed !== undefined;
    }
    #setClosed(error) {
        if (this.#closed !== undefined) {
            return;
        }
        this.#closed = error;
        for (const stream of Array.from(this.#streams)) {
            stream._setClosed(new ClosedError("Client was closed", error));
        }
    }
};
async function findEndpoint(customFetch, clientUrl) {
    const fetch = customFetch;
    for (const endpoint of checkEndpoints) {
        const url = new URL(endpoint.versionPath, clientUrl);
        const request = new _Request(url.toString(), { method: "GET" });
        const response = await fetch(request);
        await response.arrayBuffer();
        if (response.ok) {
            return endpoint;
        }
    }
    return fallbackEndpoint;
}

/** Open a Hrana client over WebSocket connected to the given `url`. */
function openWs(url, jwt, protocolVersion = 2) {
    if (typeof _WebSocket === "undefined") {
        throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
    }
    var subprotocols = undefined;
    if (protocolVersion == 3) {
        subprotocols = Array.from(subprotocolsV3.keys());
    }
    else {
        subprotocols = Array.from(subprotocolsV2.keys());
    }
    const socket = new _WebSocket(url, subprotocols);
    return new WsClient$1(socket, jwt);
}
/** Open a Hrana client over HTTP connected to the given `url`.
 *
 * If the `customFetch` argument is passed and not `undefined`, it is used in place of the `fetch` function
 * from `@libsql/isomorphic-fetch`. This function is always called with a `Request` object from
 * `@libsql/isomorphic-fetch`.
 */
function openHttp(url, jwt, customFetch, protocolVersion = 2) {
    return new HttpClient$1(url instanceof URL ? url : new URL(url), jwt, customFetch, protocolVersion);
}

class HranaTransaction {
    #mode;
    #version;
    // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
    // BEGIN statement yet.
    #started;
    /** @private */
    constructor(mode, version) {
        this.#mode = mode;
        this.#version = version;
        this.#started = undefined;
    }
    execute(stmt) {
        return this.batch([stmt]).then((results) => results[0]);
    }
    async batch(stmts) {
        const stream = this._getStream();
        if (stream.closed) {
            throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
            const hranaStmts = stmts.map(stmtToHrana);
            let rowsPromises;
            if (this.#started === undefined) {
                // The transaction hasn't started yet, so we need to send the BEGIN statement in a batch with
                // `hranaStmts`.
                this._getSqlCache().apply(hranaStmts);
                const batch = stream.batch(this.#version >= 3);
                const beginStep = batch.step();
                const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
                // Execute the `hranaStmts` only if the BEGIN succeeded, to make sure that we don't execute it
                // outside of a transaction.
                let lastStep = beginStep;
                rowsPromises = hranaStmts.map((hranaStmt) => {
                    const stmtStep = batch
                        .step()
                        .condition(BatchCond$2.ok(lastStep));
                    if (this.#version >= 3) {
                        // If the Hrana version supports it, make sure that we are still in a transaction
                        stmtStep.condition(BatchCond$2.not(BatchCond$2.isAutocommit(batch)));
                    }
                    const rowsPromise = stmtStep.query(hranaStmt);
                    rowsPromise.catch(() => undefined); // silence Node warning
                    lastStep = stmtStep;
                    return rowsPromise;
                });
                // `this.#started` is resolved successfully only if the batch and the BEGIN statement inside
                // of the batch are both successful.
                this.#started = batch
                    .execute()
                    .then(() => beginPromise)
                    .then(() => undefined);
                try {
                    await this.#started;
                }
                catch (e) {
                    // If the BEGIN failed, the transaction is unusable and we must close it. However, if the
                    // BEGIN suceeds and `hranaStmts` fail, the transaction is _not_ closed.
                    this.close();
                    throw e;
                }
            }
            else {
                if (this.#version < 3) {
                    // The transaction has started, so we must wait until the BEGIN statement completed to make
                    // sure that we don't execute `hranaStmts` outside of a transaction.
                    await this.#started;
                }
                else {
                    // The transaction has started, but we will use `hrana.BatchCond.isAutocommit()` to make
                    // sure that we don't execute `hranaStmts` outside of a transaction, so we don't have to
                    // wait for `this.#started`
                }
                this._getSqlCache().apply(hranaStmts);
                const batch = stream.batch(this.#version >= 3);
                let lastStep = undefined;
                rowsPromises = hranaStmts.map((hranaStmt) => {
                    const stmtStep = batch.step();
                    if (lastStep !== undefined) {
                        stmtStep.condition(BatchCond$2.ok(lastStep));
                    }
                    if (this.#version >= 3) {
                        stmtStep.condition(BatchCond$2.not(BatchCond$2.isAutocommit(batch)));
                    }
                    const rowsPromise = stmtStep.query(hranaStmt);
                    rowsPromise.catch(() => undefined); // silence Node warning
                    lastStep = stmtStep;
                    return rowsPromise;
                });
                await batch.execute();
            }
            const resultSets = [];
            for (const rowsPromise of rowsPromises) {
                const rows = await rowsPromise;
                if (rows === undefined) {
                    throw new LibsqlError("Statement in a transaction was not executed, " +
                        "probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
                }
                resultSets.push(resultSetFromHrana(rows));
            }
            return resultSets;
        }
        catch (e) {
            throw mapHranaError(e);
        }
    }
    async executeMultiple(sql) {
        const stream = this._getStream();
        if (stream.closed) {
            throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
            if (this.#started === undefined) {
                // If the transaction hasn't started yet, start it now
                this.#started = stream
                    .run(transactionModeToBegin(this.#mode))
                    .then(() => undefined);
                try {
                    await this.#started;
                }
                catch (e) {
                    this.close();
                    throw e;
                }
            }
            else {
                // Wait until the transaction has started
                await this.#started;
            }
            await stream.sequence(sql);
        }
        catch (e) {
            throw mapHranaError(e);
        }
    }
    async rollback() {
        try {
            const stream = this._getStream();
            if (stream.closed) {
                return;
            }
            if (this.#started !== undefined) {
                // We don't have to wait for the BEGIN statement to complete. If the BEGIN fails, we will
                // execute a ROLLBACK outside of an active transaction, which should be harmless.
            }
            else {
                // We did nothing in the transaction, so there is nothing to rollback.
                return;
            }
            // Pipeline the ROLLBACK statement and the stream close.
            const promise = stream.run("ROLLBACK").catch((e) => {
                throw mapHranaError(e);
            });
            stream.closeGracefully();
            await promise;
        }
        catch (e) {
            throw mapHranaError(e);
        }
        finally {
            // `this.close()` may close the `hrana.Client`, which aborts all pending stream requests, so we
            // must call it _after_ we receive the ROLLBACK response.
            // Also note that the current stream should already be closed, but we need to call `this.close()`
            // anyway, because it may need to do more cleanup.
            this.close();
        }
    }
    async commit() {
        // (this method is analogous to `rollback()`)
        try {
            const stream = this._getStream();
            if (stream.closed) {
                throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
            }
            if (this.#started !== undefined) {
                // Make sure to execute the COMMIT only if the BEGIN was successful.
                await this.#started;
            }
            else {
                return;
            }
            const promise = stream.run("COMMIT").catch((e) => {
                throw mapHranaError(e);
            });
            stream.closeGracefully();
            await promise;
        }
        catch (e) {
            throw mapHranaError(e);
        }
        finally {
            this.close();
        }
    }
}
async function executeHranaBatch(mode, version, batch, hranaStmts, disableForeignKeys = false) {
    if (disableForeignKeys) {
        batch.step().run("PRAGMA foreign_keys=off");
    }
    const beginStep = batch.step();
    const beginPromise = beginStep.run(transactionModeToBegin(mode));
    let lastStep = beginStep;
    const stmtPromises = hranaStmts.map((hranaStmt) => {
        const stmtStep = batch.step().condition(BatchCond$2.ok(lastStep));
        if (version >= 3) {
            stmtStep.condition(BatchCond$2.not(BatchCond$2.isAutocommit(batch)));
        }
        const stmtPromise = stmtStep.query(hranaStmt);
        lastStep = stmtStep;
        return stmtPromise;
    });
    const commitStep = batch.step().condition(BatchCond$2.ok(lastStep));
    if (version >= 3) {
        commitStep.condition(BatchCond$2.not(BatchCond$2.isAutocommit(batch)));
    }
    const commitPromise = commitStep.run("COMMIT");
    const rollbackStep = batch
        .step()
        .condition(BatchCond$2.not(BatchCond$2.ok(commitStep)));
    rollbackStep.run("ROLLBACK").catch((_) => undefined);
    if (disableForeignKeys) {
        batch.step().run("PRAGMA foreign_keys=on");
    }
    await batch.execute();
    const resultSets = [];
    await beginPromise;
    for (const stmtPromise of stmtPromises) {
        const hranaRows = await stmtPromise;
        if (hranaRows === undefined) {
            throw new LibsqlError("Statement in a batch was not executed, probably because the transaction has been rolled back", "TRANSACTION_CLOSED");
        }
        resultSets.push(resultSetFromHrana(hranaRows));
    }
    await commitPromise;
    return resultSets;
}
function stmtToHrana(stmt) {
    if (typeof stmt === "string") {
        return new Stmt$2(stmt);
    }
    const hranaStmt = new Stmt$2(stmt.sql);
    if (Array.isArray(stmt.args)) {
        hranaStmt.bindIndexes(stmt.args);
    }
    else {
        for (const [key, value] of Object.entries(stmt.args)) {
            hranaStmt.bindName(key, value);
        }
    }
    return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
    const columns = hranaRows.columnNames.map((c) => c ?? "");
    const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
    const rows = hranaRows.rows;
    const rowsAffected = hranaRows.affectedRowCount;
    const lastInsertRowid = hranaRows.lastInsertRowid !== undefined
        ? hranaRows.lastInsertRowid
        : undefined;
    return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
    if (e instanceof ClientError) {
        const code = mapHranaErrorCode(e);
        return new LibsqlError(e.message, code, undefined, e);
    }
    return e;
}
function mapHranaErrorCode(e) {
    if (e instanceof ResponseError && e.code !== undefined) {
        return e.code;
    }
    else if (e instanceof ProtoError) {
        return "HRANA_PROTO_ERROR";
    }
    else if (e instanceof ClosedError) {
        return e.cause instanceof ClientError
            ? mapHranaErrorCode(e.cause)
            : "HRANA_CLOSED_ERROR";
    }
    else if (e instanceof WebSocketError) {
        return "HRANA_WEBSOCKET_ERROR";
    }
    else if (e instanceof HttpServerError) {
        return "SERVER_ERROR";
    }
    else if (e instanceof ProtocolVersionError) {
        return "PROTOCOL_VERSION_ERROR";
    }
    else if (e instanceof InternalError) {
        return "INTERNAL_ERROR";
    }
    else {
        return "UNKNOWN";
    }
}

class SqlCache {
    #owner;
    #sqls;
    capacity;
    constructor(owner, capacity) {
        this.#owner = owner;
        this.#sqls = new Lru();
        this.capacity = capacity;
    }
    // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
    // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
    // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
    // server).
    //
    // In practice, this means that after calling this function, you can use the statements only up to the
    // first `await`, because concurrent code may also use the cache and invalidate those statements.
    apply(hranaStmts) {
        if (this.capacity <= 0) {
            return;
        }
        const usedSqlObjs = new Set();
        for (const hranaStmt of hranaStmts) {
            if (typeof hranaStmt.sql !== "string") {
                continue;
            }
            const sqlText = hranaStmt.sql;
            // Stored SQL cannot exceed 5kb.
            // https://github.com/tursodatabase/libsql/blob/e9d637e051685f92b0da43849507b5ef4232fbeb/libsql-server/src/hrana/http/request.rs#L10
            if (sqlText.length >= 5000) {
                continue;
            }
            let sqlObj = this.#sqls.get(sqlText);
            if (sqlObj === undefined) {
                while (this.#sqls.size + 1 > this.capacity) {
                    const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
                    if (usedSqlObjs.has(evictSqlObj)) {
                        // The SQL object that we are trying to evict is already in use in this batch, so we
                        // must not evict and close it.
                        break;
                    }
                    evictSqlObj.close();
                    this.#sqls.delete(evictSqlText);
                }
                if (this.#sqls.size + 1 <= this.capacity) {
                    sqlObj = this.#owner.storeSql(sqlText);
                    this.#sqls.set(sqlText, sqlObj);
                }
            }
            if (sqlObj !== undefined) {
                hranaStmt.sql = sqlObj;
                usedSqlObjs.add(sqlObj);
            }
        }
    }
}
class Lru {
    // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
    // most recently are at the end).
    #cache;
    constructor() {
        this.#cache = new Map();
    }
    get(key) {
        const value = this.#cache.get(key);
        if (value !== undefined) {
            // move the entry to the back of the Map
            this.#cache.delete(key);
            this.#cache.set(key, value);
        }
        return value;
    }
    set(key, value) {
        this.#cache.set(key, value);
    }
    peekLru() {
        for (const entry of this.#cache.entries()) {
            return entry;
        }
        return undefined;
    }
    delete(key) {
        this.#cache.delete(key);
    }
    get size() {
        return this.#cache.size;
    }
}

var promiseLimit$1;
var hasRequiredPromiseLimit;

function requirePromiseLimit () {
	if (hasRequiredPromiseLimit) return promiseLimit$1;
	hasRequiredPromiseLimit = 1;
	function limiter (count) {
	  var outstanding = 0;
	  var jobs = [];

	  function remove () {
	    outstanding--;

	    if (outstanding < count) {
	      dequeue();
	    }
	  }

	  function dequeue () {
	    var job = jobs.shift();
	    semaphore.queue = jobs.length;

	    if (job) {
	      run(job.fn).then(job.resolve).catch(job.reject);
	    }
	  }

	  function queue (fn) {
	    return new Promise(function (resolve, reject) {
	      jobs.push({fn: fn, resolve: resolve, reject: reject});
	      semaphore.queue = jobs.length;
	    })
	  }

	  function run (fn) {
	    outstanding++;
	    try {
	      return Promise.resolve(fn()).then(function (result) {
	        remove();
	        return result
	      }, function (error) {
	        remove();
	        throw error
	      })
	    } catch (err) {
	      remove();
	      return Promise.reject(err)
	    }
	  }

	  var semaphore = function (fn) {
	    if (outstanding >= count) {
	      return queue(fn)
	    } else {
	      return run(fn)
	    }
	  };

	  return semaphore
	}

	function map (items, mapper) {
	  var failed = false;

	  var limit = this;

	  return Promise.all(items.map(function () {
	    var args = arguments;
	    return limit(function () {
	      if (!failed) {
	        return mapper.apply(undefined, args).catch(function (e) {
	          failed = true;
	          throw e
	        })
	      }
	    })
	  }))
	}

	function addExtras (fn) {
	  fn.queue = 0;
	  fn.map = map;
	  return fn
	}

	promiseLimit$1 = function (count) {
	  if (count) {
	    return addExtras(limiter(count))
	  } else {
	    return addExtras(function (fn) {
	      return fn()
	    })
	  }
	};
	return promiseLimit$1;
}

var promiseLimitExports = requirePromiseLimit();
const promiseLimit = /*@__PURE__*/getDefaultExportFromCjs(promiseLimitExports);

/** @private */
function _createClient$2(config) {
    if (config.scheme !== "wss" && config.scheme !== "ws") {
        throw new LibsqlError('The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, ' +
            `got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (config.encryptionKey !== undefined) {
        throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
    }
    if (config.scheme === "ws" && config.tls) {
        throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
    }
    else if (config.scheme === "wss" && !config.tls) {
        throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
    }
    const url = encodeBaseUrl(config.scheme, config.authority, config.path);
    let client;
    try {
        client = openWs(url, config.authToken);
    }
    catch (e) {
        if (e instanceof WebSocketUnsupportedError) {
            const suggestedScheme = config.scheme === "wss" ? "https" : "http";
            const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
            throw new LibsqlError("This environment does not support WebSockets, please switch to the HTTP client by using " +
                `a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). ` +
                `For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
        }
        throw mapHranaError(e);
    }
    return new WsClient(client, url, config.authToken, config.intMode, config.concurrency);
}
const maxConnAgeMillis = 60 * 1000;
const sqlCacheCapacity$1 = 100;
class WsClient {
    #url;
    #authToken;
    #intMode;
    // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
    // asynchronous error.
    #connState;
    // If defined, this is a connection that will be used in the future, once it is ready.
    #futureConnState;
    closed;
    protocol;
    #isSchemaDatabase;
    #promiseLimitFunction;
    /** @private */
    constructor(client, url, authToken, intMode, concurrency) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#connState = this.#openConn(client);
        this.#futureConnState = undefined;
        this.closed = false;
        this.protocol = "ws";
        this.#promiseLimitFunction = promiseLimit(concurrency);
    }
    async limit(fn) {
        return this.#promiseLimitFunction(fn);
    }
    async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
            stmt = {
                sql: stmtOrSql,
                args: args || [],
            };
        }
        else {
            stmt = stmtOrSql;
        }
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const hranaStmt = stmtToHrana(stmt);
                // Schedule all operations synchronously, so they will be pipelined and executed in a single
                // network roundtrip.
                streamState.conn.sqlCache.apply([hranaStmt]);
                const hranaRowsPromise = streamState.stream.query(hranaStmt);
                streamState.stream.closeGracefully();
                const hranaRowsResult = await hranaRowsPromise;
                return resultSetFromHrana(hranaRowsResult);
            }
            catch (e) {
                throw mapHranaError(e);
            }
            finally {
                this._closeStream(streamState);
            }
        });
    }
    async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version = await streamState.conn.client.getVersion();
                // Schedule all operations synchronously, so they will be pipelined and executed in a single
                // network roundtrip.
                streamState.conn.sqlCache.apply(hranaStmts);
                const batch = streamState.stream.batch(version >= 3);
                const resultsPromise = executeHranaBatch(mode, version, batch, hranaStmts);
                const results = await resultsPromise;
                return results;
            }
            catch (e) {
                throw mapHranaError(e);
            }
            finally {
                this._closeStream(streamState);
            }
        });
    }
    async migrate(stmts) {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version = await streamState.conn.client.getVersion();
                // Schedule all operations synchronously, so they will be pipelined and executed in a single
                // network roundtrip.
                const batch = streamState.stream.batch(version >= 3);
                const resultsPromise = executeHranaBatch("deferred", version, batch, hranaStmts, true);
                const results = await resultsPromise;
                return results;
            }
            catch (e) {
                throw mapHranaError(e);
            }
            finally {
                this._closeStream(streamState);
            }
        });
    }
    async transaction(mode = "write") {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                const version = await streamState.conn.client.getVersion();
                // the BEGIN statement will be batched with the first statement on the transaction to save a
                // network roundtrip
                return new WsTransaction(this, streamState, mode, version);
            }
            catch (e) {
                this._closeStream(streamState);
                throw mapHranaError(e);
            }
        });
    }
    async executeMultiple(sql) {
        return this.limit(async () => {
            const streamState = await this.#openStream();
            try {
                // Schedule all operations synchronously, so they will be pipelined and executed in a single
                // network roundtrip.
                const promise = streamState.stream.sequence(sql);
                streamState.stream.closeGracefully();
                await promise;
            }
            catch (e) {
                throw mapHranaError(e);
            }
            finally {
                this._closeStream(streamState);
            }
        });
    }
    sync() {
        throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
    }
    async #openStream() {
        if (this.closed) {
            throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
        const now = new Date();
        const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
        if (ageMillis > maxConnAgeMillis &&
            this.#futureConnState === undefined) {
            // The existing connection is too old, let's open a new one.
            const futureConnState = this.#openConn();
            this.#futureConnState = futureConnState;
            // However, if we used `futureConnState` immediately, we would introduce additional latency,
            // because we would have to wait for the WebSocket handshake to complete, even though we may a
            // have perfectly good existing connection in `this.#connState`!
            //
            // So we wait until the `hrana.Client.getVersion()` operation completes (which happens when the
            // WebSocket hanshake completes), and only then we replace `this.#connState` with
            // `futureConnState`, which is stored in `this.#futureConnState` in the meantime.
            futureConnState.client.getVersion().then((_version) => {
                if (this.#connState !== futureConnState) {
                    // We need to close `this.#connState` before we replace it. However, it is possible
                    // that `this.#connState` has already been replaced: see the code below.
                    if (this.#connState.streamStates.size === 0) {
                        this.#connState.client.close();
                    }
                }
                this.#connState = futureConnState;
                this.#futureConnState = undefined;
            }, (_e) => {
                // If the new connection could not be established, let's just ignore the error and keep
                // using the existing connection.
                this.#futureConnState = undefined;
            });
        }
        if (this.#connState.client.closed) {
            // An error happened on this connection and it has been closed. Let's try to seamlessly reconnect.
            try {
                if (this.#futureConnState !== undefined) {
                    // We are already in the process of opening a new connection, so let's just use it
                    // immediately.
                    this.#connState = this.#futureConnState;
                }
                else {
                    this.#connState = this.#openConn();
                }
            }
            catch (e) {
                throw mapHranaError(e);
            }
        }
        const connState = this.#connState;
        try {
            // Now we wait for the WebSocket handshake to complete (if it hasn't completed yet). Note that
            // this does not increase latency, because any messages that we would send on the WebSocket before
            // the handshake would be queued until the handshake is completed anyway.
            if (connState.useSqlCache === undefined) {
                connState.useSqlCache =
                    (await connState.client.getVersion()) >= 2;
                if (connState.useSqlCache) {
                    connState.sqlCache.capacity = sqlCacheCapacity$1;
                }
            }
            const stream = connState.client.openStream();
            stream.intMode = this.#intMode;
            const streamState = { conn: connState, stream };
            connState.streamStates.add(streamState);
            return streamState;
        }
        catch (e) {
            throw mapHranaError(e);
        }
    }
    #openConn(client) {
        try {
            client ??= openWs(this.#url, this.#authToken);
            return {
                client,
                useSqlCache: undefined,
                sqlCache: new SqlCache(client, 0),
                openTime: new Date(),
                streamStates: new Set(),
            };
        }
        catch (e) {
            throw mapHranaError(e);
        }
    }
    _closeStream(streamState) {
        streamState.stream.close();
        const connState = streamState.conn;
        connState.streamStates.delete(streamState);
        if (connState.streamStates.size === 0 &&
            connState !== this.#connState) {
            // We are not using this connection anymore and this is the last stream that was using it, so we
            // must close it now.
            connState.client.close();
        }
    }
    close() {
        this.#connState.client.close();
        this.closed = true;
    }
}
class WsTransaction extends HranaTransaction {
    #client;
    #streamState;
    /** @private */
    constructor(client, state, mode, version) {
        super(mode, version);
        this.#client = client;
        this.#streamState = state;
    }
    /** @private */
    _getStream() {
        return this.#streamState.stream;
    }
    /** @private */
    _getSqlCache() {
        return this.#streamState.conn.sqlCache;
    }
    close() {
        this.#client._closeStream(this.#streamState);
    }
    get closed() {
        return this.#streamState.stream.closed;
    }
}

/** @private */
function _createClient$1(config) {
    if (config.scheme !== "https" && config.scheme !== "http") {
        throw new LibsqlError('The HTTP client supports only "libsql:", "https:" and "http:" URLs, ' +
            `got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
    if (config.encryptionKey !== undefined) {
        throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
    }
    if (config.scheme === "http" && config.tls) {
        throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
    }
    else if (config.scheme === "https" && !config.tls) {
        throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
    }
    const url = encodeBaseUrl(config.scheme, config.authority, config.path);
    return new HttpClient(url, config.authToken, config.intMode, config.fetch, config.concurrency);
}
const sqlCacheCapacity = 30;
class HttpClient {
    #client;
    protocol;
    #authToken;
    #promiseLimitFunction;
    /** @private */
    constructor(url, authToken, intMode, customFetch, concurrency) {
        this.#client = openHttp(url, authToken, customFetch);
        this.#client.intMode = intMode;
        this.protocol = "http";
        this.#authToken = authToken;
        this.#promiseLimitFunction = promiseLimit(concurrency);
    }
    async limit(fn) {
        return this.#promiseLimitFunction(fn);
    }
    async execute(stmtOrSql, args) {
        let stmt;
        if (typeof stmtOrSql === "string") {
            stmt = {
                sql: stmtOrSql,
                args: args || [],
            };
        }
        else {
            stmt = stmtOrSql;
        }
        return this.limit(async () => {
            try {
                const hranaStmt = stmtToHrana(stmt);
                // Pipeline all operations, so `hrana.HttpClient` can open the stream, execute the statement and
                // close the stream in a single HTTP request.
                let rowsPromise;
                const stream = this.#client.openStream();
                try {
                    rowsPromise = stream.query(hranaStmt);
                }
                finally {
                    stream.closeGracefully();
                }
                const rowsResult = await rowsPromise;
                return resultSetFromHrana(rowsResult);
            }
            catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version = await this.#client.getVersion();
                // Pipeline all operations, so `hrana.HttpClient` can open the stream, execute the batch and
                // close the stream in a single HTTP request.
                let resultsPromise;
                const stream = this.#client.openStream();
                try {
                    // It makes sense to use a SQL cache even for a single batch, because it may contain the same
                    // statement repeated multiple times.
                    const sqlCache = new SqlCache(stream, sqlCacheCapacity);
                    sqlCache.apply(hranaStmts);
                    // TODO: we do not use a cursor here, because it would cause three roundtrips:
                    // 1. pipeline request to store SQL texts
                    // 2. cursor request
                    // 3. pipeline request to close the stream
                    const batch = stream.batch(false);
                    resultsPromise = executeHranaBatch(mode, version, batch, hranaStmts);
                }
                finally {
                    stream.closeGracefully();
                }
                const results = await resultsPromise;
                return results;
            }
            catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async migrate(stmts) {
        return this.limit(async () => {
            try {
                const hranaStmts = stmts.map(stmtToHrana);
                const version = await this.#client.getVersion();
                // Pipeline all operations, so `hrana.HttpClient` can open the stream, execute the batch and
                // close the stream in a single HTTP request.
                let resultsPromise;
                const stream = this.#client.openStream();
                try {
                    const batch = stream.batch(false);
                    resultsPromise = executeHranaBatch("deferred", version, batch, hranaStmts, true);
                }
                finally {
                    stream.closeGracefully();
                }
                const results = await resultsPromise;
                return results;
            }
            catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async transaction(mode = "write") {
        return this.limit(async () => {
            try {
                const version = await this.#client.getVersion();
                return new HttpTransaction(this.#client.openStream(), mode, version);
            }
            catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    async executeMultiple(sql) {
        return this.limit(async () => {
            try {
                // Pipeline all operations, so `hrana.HttpClient` can open the stream, execute the sequence and
                // close the stream in a single HTTP request.
                let promise;
                const stream = this.#client.openStream();
                try {
                    promise = stream.sequence(sql);
                }
                finally {
                    stream.closeGracefully();
                }
                await promise;
            }
            catch (e) {
                throw mapHranaError(e);
            }
        });
    }
    sync() {
        throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
    }
    close() {
        this.#client.close();
    }
    get closed() {
        return this.#client.closed;
    }
}
class HttpTransaction extends HranaTransaction {
    #stream;
    #sqlCache;
    /** @private */
    constructor(stream, mode, version) {
        super(mode, version);
        this.#stream = stream;
        this.#sqlCache = new SqlCache(stream, sqlCacheCapacity);
    }
    /** @private */
    _getStream() {
        return this.#stream;
    }
    /** @private */
    _getSqlCache() {
        return this.#sqlCache;
    }
    close() {
        this.#stream.close();
    }
    get closed() {
        return this.#stream.closed;
    }
}

function createClient(config) {
    return _createClient(expandConfig(config));
}
/** @private */
function _createClient(config) {
    if (config.scheme === "ws" || config.scheme === "wss") {
        return _createClient$2(config);
    }
    else if (config.scheme === "http" || config.scheme === "https") {
        return _createClient$1(config);
    }
    else {
        throw new LibsqlError('The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, ' +
            `got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
    }
}

const turso = createClient({
  url: "libsql://my-users-larry.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDExNzA4MTAsImlkIjoiNWYyYTA2NWItNWM2My00M2VjLWE5MDMtZjczY2VhZTY0NThiIn0.KeSWHMzYoeHG7pkTfPKULVUG2nAXh9FwAkD16HWmGuB-rmXX7le79I6IKRSWd4888WH4abw8WivzC05K1rREDQ"
});

export { turso as t };
