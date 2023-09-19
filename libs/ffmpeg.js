!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.FFmpeg = t() : e.FFmpeg = t()
}(self, (function() {
    return (()=>{
        var e = {
            725: (e,t,r)=>{
                "use strict";
                e.exports = r.p + "046d0074eee1d99a674a.js"
            }
            ,
            839: (e,t,r)=>{
                "use strict";
                r.r(t),
                r.d(t, {
                    defaultOptions: ()=>o,
                    fetchFile: ()=>m,
                    getCreateFFmpegCore: ()=>u
                });
                var n = r(306);
                const o = {
                    corePath: "https://unpkg.com/@ffmpeg/core@".concat(n.devDependencies["@ffmpeg/core"].substring(1), "/dist/ffmpeg-core.js")
                };
                var a = r(185)
                  , i = r(835);
                function c(e, t, r, n, o, a, i) {
                    try {
                        var c = e[a](i)
                          , s = c.value
                    } catch (e) {
                        return void r(e)
                    }
                    c.done ? t(s) : Promise.resolve(s).then(n, o)
                }
                function s(e) {
                    return function() {
                        var t = this
                          , r = arguments;
                        return new Promise((function(n, o) {
                            var a = e.apply(t, r);
                            function i(e) {
                                c(a, n, o, i, s, "next", e)
                            }
                            function s(e) {
                                c(a, n, o, i, s, "throw", e)
                            }
                            i(void 0)
                        }
                        ))
                    }
                }
                var f = function() {
                    var e = s(regeneratorRuntime.mark((function e(t, r) {
                        var n, o, i;
                        return regeneratorRuntime.wrap((function(e) {
                            for (; ; )
                                switch (e.prev = e.next) {
                                case 0:
                                    return (0,
                                    a.log)("info", "fetch ".concat(t)),
                                    e.next = 3,
                                    fetch(t);
                                case 3:
                                    return e.next = 5,
                                    e.sent.arrayBuffer();
                                case 5:
                                    return n = e.sent,
                                    (0,
                                    a.log)("info", "".concat(t, " file size = ").concat(n.byteLength, " bytes")),
                                    o = new Blob([n],{
                                        type: r
                                    }),
                                    i = URL.createObjectURL(o),
                                    (0,
                                    a.log)("info", "".concat(t, " blob URL = ").concat(i)),
                                    e.abrupt("return", i);
                                case 11:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )));
                    return function(t, r) {
                        return e.apply(this, arguments)
                    }
                }()
                  , u = function() {
                    var e = s(regeneratorRuntime.mark((function e(t) {
                        var r, n, o, c, s, u, l, p, m, h, g;
                        return regeneratorRuntime.wrap((function(e) {
                            for (; ; )
                                switch (e.prev = e.next) {
                                case 0:
                                    if (r = t.corePath,
                                    n = t.workerPath,
                                    o = t.wasmPath,
                                    !("undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope)) {
                                        e.next = 18;
                                        break
                                    }
                                    if ("string" == typeof r) {
                                        e.next = 4;
                                        break
                                    }
                                    throw Error("corePath should be a string!");
                                case 4:
                                    return c = new URL(r,"file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/getCreateFFmpegCore.js").href,
                                    e.next = 7,
                                    f(c, "application/javascript");
                                case 7:
                                    return s = e.sent,
                                    e.next = 10,
                                    f(void 0 !== o ? o : c.replace("ffmpeg-core.js", "ffmpeg-core.wasm"), "application/wasm");
                                case 10:
                                    return u = e.sent,
                                    e.next = 13,
                                    f(void 0 !== n ? n : c.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"), "application/javascript");
                                case 13:
                                    if (l = e.sent,
                                    "undefined" != typeof createFFmpegCore) {
                                        e.next = 16;
                                        break
                                    }
                                    return e.abrupt("return", new Promise((function(e) {
                                        if (globalThis.importScripts(s),
                                        "undefined" == typeof createFFmpegCore)
                                            throw Error((0,
                                            i.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(c));
                                        (0,
                                        a.log)("info", "ffmpeg-core.js script loaded"),
                                        e({
                                            createFFmpegCore,
                                            corePath: s,
                                            wasmPath: u,
                                            workerPath: l
                                        })
                                    }
                                    )));
                                case 16:
                                    return (0,
                                    a.log)("info", "ffmpeg-core.js script is loaded already"),
                                    e.abrupt("return", Promise.resolve({
                                        createFFmpegCore,
                                        corePath: s,
                                        wasmPath: u,
                                        workerPath: l
                                    }));
                                case 18:
                                    if ("string" == typeof r) {
                                        e.next = 20;
                                        break
                                    }
                                    throw Error("corePath should be a string!");
                                case 20:
                                    return p = new URL(r,"file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/getCreateFFmpegCore.js").href,
                                    e.next = 23,
                                    f(p, "application/javascript");
                                case 23:
                                    return m = e.sent,
                                    e.next = 26,
                                    f(void 0 !== o ? o : p.replace("ffmpeg-core.js", "ffmpeg-core.wasm"), "application/wasm");
                                case 26:
                                    return h = e.sent,
                                    e.next = 29,
                                    f(void 0 !== n ? n : p.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"), "application/javascript");
                                case 29:
                                    if (g = e.sent,
                                    "undefined" != typeof createFFmpegCore) {
                                        e.next = 32;
                                        break
                                    }
                                    return e.abrupt("return", new Promise((function(e) {
                                        var t = document.createElement("script");
                                        t.src = m,
                                        t.type = "text/javascript",
                                        t.addEventListener("load", (function r() {
                                            if (t.removeEventListener("load", r),
                                            "undefined" == typeof createFFmpegCore)
                                                throw Error((0,
                                                i.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(p));
                                            (0,
                                            a.log)("info", "ffmpeg-core.js script loaded"),
                                            e({
                                                createFFmpegCore,
                                                corePath: m,
                                                wasmPath: h,
                                                workerPath: g
                                            })
                                        }
                                        )),
                                        document.getElementsByTagName("head")[0].appendChild(t)
                                    }
                                    )));
                                case 32:
                                    return (0,
                                    a.log)("info", "ffmpeg-core.js script is loaded already"),
                                    e.abrupt("return", Promise.resolve({
                                        createFFmpegCore,
                                        corePath: m,
                                        wasmPath: h,
                                        workerPath: g
                                    }));
                                case 34:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }();
                function l(e, t, r, n, o, a, i) {
                    try {
                        var c = e[a](i)
                          , s = c.value
                    } catch (e) {
                        return void r(e)
                    }
                    c.done ? t(s) : Promise.resolve(s).then(n, o)
                }
                var p = function(e) {
                    return new Promise((function(t, r) {
                        var n = new FileReader;
                        n.onload = function() {
                            t(n.result)
                        }
                        ,
                        n.onerror = function(e) {
                            var t = e.target.error.code;
                            r(Error("File could not be read! Code=".concat(t)))
                        }
                        ,
                        n.readAsArrayBuffer(e)
                    }
                    ))
                }
                  , m = function() {
                    var e, t = (e = regeneratorRuntime.mark((function e(t) {
                        var r, n;
                        return regeneratorRuntime.wrap((function(e) {
                            for (; ; )
                                switch (e.prev = e.next) {
                                case 0:
                                    if (r = t,
                                    void 0 !== t) {
                                        e.next = 3;
                                        break
                                    }
                                    return e.abrupt("return", new Uint8Array);
                                case 3:
                                    if ("string" != typeof t) {
                                        e.next = 16;
                                        break
                                    }
                                    if (!/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(t)) {
                                        e.next = 8;
                                        break
                                    }
                                    r = atob(t.split(",")[1]).split("").map((function(e) {
                                        return e.charCodeAt(0)
                                    }
                                    )),
                                    e.next = 14;
                                    break;
                                case 8:
                                    return e.next = 10,
                                    fetch(new URL(t,"file:///home/jeromewu/repos/ffmpeg.wasm/src/browser/fetchFile.js").href);
                                case 10:
                                    return n = e.sent,
                                    e.next = 13,
                                    n.arrayBuffer();
                                case 13:
                                    r = e.sent;
                                case 14:
                                    e.next = 20;
                                    break;
                                case 16:
                                    if (!(t instanceof File || t instanceof Blob)) {
                                        e.next = 20;
                                        break
                                    }
                                    return e.next = 19,
                                    p(t);
                                case 19:
                                    r = e.sent;
                                case 20:
                                    return e.abrupt("return", new Uint8Array(r));
                                case 21:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )),
                    function() {
                        var t = this
                          , r = arguments;
                        return new Promise((function(n, o) {
                            var a = e.apply(t, r);
                            function i(e) {
                                l(a, n, o, i, c, "next", e)
                            }
                            function c(e) {
                                l(a, n, o, i, c, "throw", e)
                            }
                            i(void 0)
                        }
                        ))
                    }
                    );
                    return function(e) {
                        return t.apply(this, arguments)
                    }
                }()
            }
            ,
            500: e=>{
                e.exports = {
                    defaultArgs: ["./ffmpeg", "-nostdin", "-y"],
                    baseOptions: {
                        log: !1,
                        logger: function() {},
                        progress: function() {},
                        corePath: ""
                    }
                }
            }
            ,
            906: (e,t,r)=>{
                function n(e) {
                    return function(e) {
                        if (Array.isArray(e))
                            return s(e)
                    }(e) || function(e) {
                        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                            return Array.from(e)
                    }(e) || c(e) || function() {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }
                function o(e, t, r, n, o, a, i) {
                    try {
                        var c = e[a](i)
                          , s = c.value
                    } catch (e) {
                        return void r(e)
                    }
                    c.done ? t(s) : Promise.resolve(s).then(n, o)
                }
                function a(e) {
                    return function() {
                        var t = this
                          , r = arguments;
                        return new Promise((function(n, a) {
                            var i = e.apply(t, r);
                            function c(e) {
                                o(i, n, a, c, s, "next", e)
                            }
                            function s(e) {
                                o(i, n, a, c, s, "throw", e)
                            }
                            c(void 0)
                        }
                        ))
                    }
                }
                function i(e, t) {
                    return function(e) {
                        if (Array.isArray(e))
                            return e
                    }(e) || function(e, t) {
                        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) {
                            var r = []
                              , n = !0
                              , o = !1
                              , a = void 0;
                            try {
                                for (var i, c = e[Symbol.iterator](); !(n = (i = c.next()).done) && (r.push(i.value),
                                !t || r.length !== t); n = !0)
                                    ;
                            } catch (e) {
                                o = !0,
                                a = e
                            } finally {
                                try {
                                    n || null == c.return || c.return()
                                } finally {
                                    if (o)
                                        throw a
                                }
                            }
                            return r
                        }
                    }(e, t) || c(e, t) || function() {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }
                function c(e, t) {
                    if (e) {
                        if ("string" == typeof e)
                            return s(e, t);
                        var r = Object.prototype.toString.call(e).slice(8, -1);
                        return "Object" === r && e.constructor && (r = e.constructor.name),
                        "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? s(e, t) : void 0
                    }
                }
                function s(e, t) {
                    (null == t || t > e.length) && (t = e.length);
                    for (var r = 0, n = new Array(t); r < t; r++)
                        n[r] = e[r];
                    return n
                }
                function f(e, t) {
                    var r = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                        var n = Object.getOwnPropertySymbols(e);
                        t && (n = n.filter((function(t) {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable
                        }
                        ))),
                        r.push.apply(r, n)
                    }
                    return r
                }
                function u(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? f(Object(r), !0).forEach((function(t) {
                            l(e, t, r[t])
                        }
                        )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : f(Object(r)).forEach((function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
                        }
                        ))
                    }
                    return e
                }
                function l(e, t, r) {
                    return t in e ? Object.defineProperty(e, t, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = r,
                    e
                }
                function p(e, t) {
                    if (null == e)
                        return {};
                    var r, n, o = function(e, t) {
                        if (null == e)
                            return {};
                        var r, n, o = {}, a = Object.keys(e);
                        for (n = 0; n < a.length; n++)
                            r = a[n],
                            t.indexOf(r) >= 0 || (o[r] = e[r]);
                        return o
                    }(e, t);
                    if (Object.getOwnPropertySymbols) {
                        var a = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < a.length; n++)
                            r = a[n],
                            t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r])
                    }
                    return o
                }
                var m = r(500)
                  , h = m.defaultArgs
                  , g = m.baseOptions
                  , d = r(319)
                  , y = r(839)
                  , v = y.defaultOptions
                  , w = y.getCreateFFmpegCore
                  , b = r(306).version
                  , x = Error("ffmpeg.wasm is not ready, make sure you have completed load().");
                e.exports = function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                      , t = u(u(u({}, g), v), e)
                      , r = t.log
                      , o = (t.logger,
                    t.progress)
                      , c = p(t, ["log", "logger", "progress"])
                      , s = null
                      , f = null
                      , l = null
                      , m = null
                      , y = !1
                      , F = function() {}
                      , j = r
                      , E = o
                      , P = 0
                      , O = 0
                      , k = !1
                      , L = 0
                      , S = function(e) {
                        "FFMPEG_END" === e && null !== l && (l(),
                        l = null,
                        m = null,
                        y = !1)
                    }
                      , _ = function(e, t) {
                        F({
                            type: e,
                            message: t
                        }),
                        j && console.log("[".concat(e, "] ").concat(t))
                    }
                      , C = function(e) {
                        var t = i(e.split(":"), 3)
                          , r = t[0]
                          , n = t[1]
                          , o = t[2];
                        return 60 * parseFloat(r) * 60 + 60 * parseFloat(n) + parseFloat(o)
                    }
                      , A = function(e, t) {
                        if ("string" == typeof e)
                            if (e.startsWith("  Duration")) {
                                var r = e.split(", ")[0].split(": ")[1]
                                  , n = C(r);
                                t({
                                    duration: n,
                                    ratio: L
                                }),
                                (0 === P || P > n) && (P = n,
                                k = !0)
                            } else if (k && e.startsWith("    Stream")) {
                                var o = e.match(/([\d.]+) fps/);
                                if (o) {
                                    var a = parseFloat(o[1]);
                                    O = P * a
                                } else
                                    O = 0;
                                k = !1
                            } else if (e.startsWith("frame") || e.startsWith("size")) {
                                var i = e.split("time=")[1].split(" ")[0]
                                  , c = C(i)
                                  , s = e.match(/frame=\s*(\d+)/);
                                if (O && s) {
                                    var f = parseFloat(s[1]);
                                    L = Math.min(f / O, 1)
                                } else
                                    L = c / P;
                                t({
                                    ratio: L,
                                    time: c
                                })
                            } else
                                e.startsWith("video:") && (t({
                                    ratio: 1
                                }),
                                P = 0)
                    }
                      , T = function(e) {
                        var t = e.type
                          , r = e.message;
                        _(t, r),
                        A(r, E),
                        S(r)
                    }
                      , R = function() {
                        var e = a(regeneratorRuntime.mark((function e() {
                            var t, r, n, o, a;
                            return regeneratorRuntime.wrap((function(e) {
                                for (; ; )
                                    switch (e.prev = e.next) {
                                    case 0:
                                        if (_("info", "load ffmpeg-core"),
                                        null !== s) {
                                            e.next = 17;
                                            break
                                        }
                                        return _("info", "loading ffmpeg-core"),
                                        e.next = 5,
                                        w(c);
                                    case 5:
                                        return t = e.sent,
                                        r = t.createFFmpegCore,
                                        n = t.corePath,
                                        o = t.workerPath,
                                        a = t.wasmPath,
                                        e.next = 12,
                                        r({
                                            mainScriptUrlOrBlob: n,
                                            printErr: function(e) {
                                                return T({
                                                    type: "fferr",
                                                    message: e
                                                })
                                            },
                                            print: function(e) {
                                                return T({
                                                    type: "ffout",
                                                    message: e
                                                })
                                            },
                                            locateFile: function(e, t) {
                                                if ("undefined" != typeof window || "undefined" != typeof WorkerGlobalScope) {
                                                    if (void 0 !== a && e.endsWith("ffmpeg-core.wasm"))
                                                        return a;
                                                    if (void 0 !== o && e.endsWith("ffmpeg-core.worker.js"))
                                                        return o
                                                }
                                                return t + e
                                            }
                                        });
                                    case 12:
                                        s = e.sent,
                                        f = s.cwrap(c.mainName || "proxy_main", "number", ["number", "number"]),
                                        _("info", "ffmpeg-core loaded"),
                                        e.next = 18;
                                        break;
                                    case 17:
                                        throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");
                                    case 18:
                                    case "end":
                                        return e.stop()
                                    }
                            }
                            ), e)
                        }
                        )));
                        return function() {
                            return e.apply(this, arguments)
                        }
                    }()
                      , N = function() {
                        return null !== s
                    }
                      , I = function() {
                        for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
                            t[r] = arguments[r];
                        if (_("info", "run ffmpeg command: ".concat(t.join(" "))),
                        null === s)
                            throw x;
                        if (y)
                            throw Error("ffmpeg.wasm can only run one command at a time");
                        return y = !0,
                        new Promise((function(e, r) {
                            var o = [].concat(n(h), t).filter((function(e) {
                                return 0 !== e.length
                            }
                            ));
                            l = e,
                            m = r,
                            f.apply(void 0, n(d(s, o)))
                        }
                        ))
                    }
                      , U = function(e) {
                        for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
                            r[n - 1] = arguments[n];
                        if (_("info", "run FS.".concat(e, " ").concat(r.map((function(e) {
                            return "string" == typeof e ? e : "<".concat(e.length, " bytes binary file>")
                        }
                        )).join(" "))),
                        null === s)
                            throw x;
                        var o = null;
                        try {
                            var a;
                            o = (a = s.FS)[e].apply(a, r)
                        } catch (t) {
                            throw "readdir" === e ? Error("ffmpeg.FS('readdir', '".concat(r[0], "') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')")) : "readFile" === e ? Error("ffmpeg.FS('readFile', '".concat(r[0], "') error. Check if the path exists")) : Error("Oops, something went wrong in FS operation.")
                        }
                        return o
                    }
                      , G = function() {
                        if (null === s)
                            throw x;
                        m && m("ffmpeg has exited"),
                        y = !1;
                        try {
                            s.exit(1)
                        } catch (e) {
                            _(e.message),
                            m && m(e)
                        } finally {
                            s = null,
                            f = null,
                            l = null,
                            m = null
                        }
                    }
                      , D = function(e) {
                        E = e
                    }
                      , W = function(e) {
                        F = e
                    }
                      , B = function(e) {
                        j = e
                    };
                    return _("info", "use ffmpeg.wasm v".concat(b)),
                    {
                        setProgress: D,
                        setLogger: W,
                        setLogging: B,
                        load: R,
                        isLoaded: N,
                        run: I,
                        exit: G,
                        FS: U
                    }
                }
            }
            ,
            352: (e,t,r)=>{
                r(666);
                var n = r(906)
                  , o = r(839).fetchFile;
                e.exports = {
                    createFFmpeg: n,
                    fetchFile: o
                }
            }
            ,
            835: e=>{
                e.exports = {
                    CREATE_FFMPEG_CORE_IS_NOT_DEFINED: function(e) {
                        return "\ncreateFFmpegCore is not defined. ffmpeg.wasm is unable to find createFFmpegCore after loading ffmpeg-core.js from ".concat(e, ". Use another URL when calling createFFmpeg():\n\nconst ffmpeg = createFFmpeg({\n  corePath: 'http://localhost:3000/ffmpeg-core.js',\n});\n")
                    }
                }
            }
            ,
            185: e=>{
                var t = !1
                  , r = function() {};
                e.exports = {
                    logging: t,
                    setLogging: function(e) {
                        t = e
                    },
                    setCustomLogger: function(e) {
                        r = e
                    },
                    log: function(e, n) {
                        r({
                            type: e,
                            message: n
                        }),
                        t && console.log("[".concat(e, "] ").concat(n))
                    }
                }
            }
            ,
            319: e=>{
                e.exports = function(e, t) {
                    var r = e._malloc(t.length * Uint32Array.BYTES_PER_ELEMENT);
                    return t.forEach((function(t, n) {
                        var o = e.lengthBytesUTF8(t) + 1
                          , a = e._malloc(o);
                        e.stringToUTF8(t, a, o),
                        e.setValue(r + Uint32Array.BYTES_PER_ELEMENT * n, a, "i32")
                    }
                    )),
                    [t.length, r]
                }
            }
            ,
            666: e=>{
                var t = function(e) {
                    "use strict";
                    var t, r = Object.prototype, n = r.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, a = o.iterator || "@@iterator", i = o.asyncIterator || "@@asyncIterator", c = o.toStringTag || "@@toStringTag";
                    function s(e, t, r) {
                        return Object.defineProperty(e, t, {
                            value: r,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }),
                        e[t]
                    }
                    try {
                        s({}, "")
                    } catch (e) {
                        s = function(e, t, r) {
                            return e[t] = r
                        }
                    }
                    function f(e, t, r, n) {
                        var o = t && t.prototype instanceof d ? t : d
                          , a = Object.create(o.prototype)
                          , i = new L(n || []);
                        return a._invoke = function(e, t, r) {
                            var n = l;
                            return function(o, a) {
                                if (n === m)
                                    throw new Error("Generator is already running");
                                if (n === h) {
                                    if ("throw" === o)
                                        throw a;
                                    return _()
                                }
                                for (r.method = o,
                                r.arg = a; ; ) {
                                    var i = r.delegate;
                                    if (i) {
                                        var c = P(i, r);
                                        if (c) {
                                            if (c === g)
                                                continue;
                                            return c
                                        }
                                    }
                                    if ("next" === r.method)
                                        r.sent = r._sent = r.arg;
                                    else if ("throw" === r.method) {
                                        if (n === l)
                                            throw n = h,
                                            r.arg;
                                        r.dispatchException(r.arg)
                                    } else
                                        "return" === r.method && r.abrupt("return", r.arg);
                                    n = m;
                                    var s = u(e, t, r);
                                    if ("normal" === s.type) {
                                        if (n = r.done ? h : p,
                                        s.arg === g)
                                            continue;
                                        return {
                                            value: s.arg,
                                            done: r.done
                                        }
                                    }
                                    "throw" === s.type && (n = h,
                                    r.method = "throw",
                                    r.arg = s.arg)
                                }
                            }
                        }(e, r, i),
                        a
                    }
                    function u(e, t, r) {
                        try {
                            return {
                                type: "normal",
                                arg: e.call(t, r)
                            }
                        } catch (e) {
                            return {
                                type: "throw",
                                arg: e
                            }
                        }
                    }
                    e.wrap = f;
                    var l = "suspendedStart"
                      , p = "suspendedYield"
                      , m = "executing"
                      , h = "completed"
                      , g = {};
                    function d() {}
                    function y() {}
                    function v() {}
                    var w = {};
                    w[a] = function() {
                        return this
                    }
                    ;
                    var b = Object.getPrototypeOf
                      , x = b && b(b(S([])));
                    x && x !== r && n.call(x, a) && (w = x);
                    var F = v.prototype = d.prototype = Object.create(w);
                    function j(e) {
                        ["next", "throw", "return"].forEach((function(t) {
                            s(e, t, (function(e) {
                                return this._invoke(t, e)
                            }
                            ))
                        }
                        ))
                    }
                    function E(e, t) {
                        function r(o, a, i, c) {
                            var s = u(e[o], e, a);
                            if ("throw" !== s.type) {
                                var f = s.arg
                                  , l = f.value;
                                return l && "object" == typeof l && n.call(l, "__await") ? t.resolve(l.__await).then((function(e) {
                                    r("next", e, i, c)
                                }
                                ), (function(e) {
                                    r("throw", e, i, c)
                                }
                                )) : t.resolve(l).then((function(e) {
                                    f.value = e,
                                    i(f)
                                }
                                ), (function(e) {
                                    return r("throw", e, i, c)
                                }
                                ))
                            }
                            c(s.arg)
                        }
                        var o;
                        this._invoke = function(e, n) {
                            function a() {
                                return new t((function(t, o) {
                                    r(e, n, t, o)
                                }
                                ))
                            }
                            return o = o ? o.then(a, a) : a()
                        }
                    }
                    function P(e, r) {
                        var n = e.iterator[r.method];
                        if (n === t) {
                            if (r.delegate = null,
                            "throw" === r.method) {
                                if (e.iterator.return && (r.method = "return",
                                r.arg = t,
                                P(e, r),
                                "throw" === r.method))
                                    return g;
                                r.method = "throw",
                                r.arg = new TypeError("The iterator does not provide a 'throw' method")
                            }
                            return g
                        }
                        var o = u(n, e.iterator, r.arg);
                        if ("throw" === o.type)
                            return r.method = "throw",
                            r.arg = o.arg,
                            r.delegate = null,
                            g;
                        var a = o.arg;
                        return a ? a.done ? (r[e.resultName] = a.value,
                        r.next = e.nextLoc,
                        "return" !== r.method && (r.method = "next",
                        r.arg = t),
                        r.delegate = null,
                        g) : a : (r.method = "throw",
                        r.arg = new TypeError("iterator result is not an object"),
                        r.delegate = null,
                        g)
                    }
                    function O(e) {
                        var t = {
                            tryLoc: e[0]
                        };
                        1 in e && (t.catchLoc = e[1]),
                        2 in e && (t.finallyLoc = e[2],
                        t.afterLoc = e[3]),
                        this.tryEntries.push(t)
                    }
                    function k(e) {
                        var t = e.completion || {};
                        t.type = "normal",
                        delete t.arg,
                        e.completion = t
                    }
                    function L(e) {
                        this.tryEntries = [{
                            tryLoc: "root"
                        }],
                        e.forEach(O, this),
                        this.reset(!0)
                    }
                    function S(e) {
                        if (e) {
                            var r = e[a];
                            if (r)
                                return r.call(e);
                            if ("function" == typeof e.next)
                                return e;
                            if (!isNaN(e.length)) {
                                var o = -1
                                  , i = function r() {
                                    for (; ++o < e.length; )
                                        if (n.call(e, o))
                                            return r.value = e[o],
                                            r.done = !1,
                                            r;
                                    return r.value = t,
                                    r.done = !0,
                                    r
                                };
                                return i.next = i
                            }
                        }
                        return {
                            next: _
                        }
                    }
                    function _() {
                        return {
                            value: t,
                            done: !0
                        }
                    }
                    return y.prototype = F.constructor = v,
                    v.constructor = y,
                    y.displayName = s(v, c, "GeneratorFunction"),
                    e.isGeneratorFunction = function(e) {
                        var t = "function" == typeof e && e.constructor;
                        return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
                    }
                    ,
                    e.mark = function(e) {
                        return Object.setPrototypeOf ? Object.setPrototypeOf(e, v) : (e.__proto__ = v,
                        s(e, c, "GeneratorFunction")),
                        e.prototype = Object.create(F),
                        e
                    }
                    ,
                    e.awrap = function(e) {
                        return {
                            __await: e
                        }
                    }
                    ,
                    j(E.prototype),
                    E.prototype[i] = function() {
                        return this
                    }
                    ,
                    e.AsyncIterator = E,
                    e.async = function(t, r, n, o, a) {
                        void 0 === a && (a = Promise);
                        var i = new E(f(t, r, n, o),a);
                        return e.isGeneratorFunction(r) ? i : i.next().then((function(e) {
                            return e.done ? e.value : i.next()
                        }
                        ))
                    }
                    ,
                    j(F),
                    s(F, c, "Generator"),
                    F[a] = function() {
                        return this
                    }
                    ,
                    F.toString = function() {
                        return "[object Generator]"
                    }
                    ,
                    e.keys = function(e) {
                        var t = [];
                        for (var r in e)
                            t.push(r);
                        return t.reverse(),
                        function r() {
                            for (; t.length; ) {
                                var n = t.pop();
                                if (n in e)
                                    return r.value = n,
                                    r.done = !1,
                                    r
                            }
                            return r.done = !0,
                            r
                        }
                    }
                    ,
                    e.values = S,
                    L.prototype = {
                        constructor: L,
                        reset: function(e) {
                            if (this.prev = 0,
                            this.next = 0,
                            this.sent = this._sent = t,
                            this.done = !1,
                            this.delegate = null,
                            this.method = "next",
                            this.arg = t,
                            this.tryEntries.forEach(k),
                            !e)
                                for (var r in this)
                                    "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t)
                        },
                        stop: function() {
                            this.done = !0;
                            var e = this.tryEntries[0].completion;
                            if ("throw" === e.type)
                                throw e.arg;
                            return this.rval
                        },
                        dispatchException: function(e) {
                            if (this.done)
                                throw e;
                            var r = this;
                            function o(n, o) {
                                return c.type = "throw",
                                c.arg = e,
                                r.next = n,
                                o && (r.method = "next",
                                r.arg = t),
                                !!o
                            }
                            for (var a = this.tryEntries.length - 1; a >= 0; --a) {
                                var i = this.tryEntries[a]
                                  , c = i.completion;
                                if ("root" === i.tryLoc)
                                    return o("end");
                                if (i.tryLoc <= this.prev) {
                                    var s = n.call(i, "catchLoc")
                                      , f = n.call(i, "finallyLoc");
                                    if (s && f) {
                                        if (this.prev < i.catchLoc)
                                            return o(i.catchLoc, !0);
                                        if (this.prev < i.finallyLoc)
                                            return o(i.finallyLoc)
                                    } else if (s) {
                                        if (this.prev < i.catchLoc)
                                            return o(i.catchLoc, !0)
                                    } else {
                                        if (!f)
                                            throw new Error("try statement without catch or finally");
                                        if (this.prev < i.finallyLoc)
                                            return o(i.finallyLoc)
                                    }
                                }
                            }
                        },
                        abrupt: function(e, t) {
                            for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                                var o = this.tryEntries[r];
                                if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                                    var a = o;
                                    break
                                }
                            }
                            a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
                            var i = a ? a.completion : {};
                            return i.type = e,
                            i.arg = t,
                            a ? (this.method = "next",
                            this.next = a.finallyLoc,
                            g) : this.complete(i)
                        },
                        complete: function(e, t) {
                            if ("throw" === e.type)
                                throw e.arg;
                            return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg,
                            this.method = "return",
                            this.next = "end") : "normal" === e.type && t && (this.next = t),
                            g
                        },
                        finish: function(e) {
                            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                var r = this.tryEntries[t];
                                if (r.finallyLoc === e)
                                    return this.complete(r.completion, r.afterLoc),
                                    k(r),
                                    g
                            }
                        },
                        catch: function(e) {
                            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                var r = this.tryEntries[t];
                                if (r.tryLoc === e) {
                                    var n = r.completion;
                                    if ("throw" === n.type) {
                                        var o = n.arg;
                                        k(r)
                                    }
                                    return o
                                }
                            }
                            throw new Error("illegal catch attempt")
                        },
                        delegateYield: function(e, r, n) {
                            return this.delegate = {
                                iterator: S(e),
                                resultName: r,
                                nextLoc: n
                            },
                            "next" === this.method && (this.arg = t),
                            g
                        }
                    },
                    e
                }(e.exports);
                try {
                    regeneratorRuntime = t
                } catch (e) {
                    Function("r", "regeneratorRuntime = r")(t)
                }
            }
            ,
            306: e=>{
                "use strict";
                e.exports = JSON.parse('{"name":"@ffmpeg/ffmpeg","version":"0.11.6","description":"FFmpeg WebAssembly version","main":"src/index.js","types":"src/index.d.ts","directories":{"example":"examples"},"scripts":{"start":"node scripts/server.js","start:worker":"node scripts/worker-server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","build:worker":"rimraf dist && webpack --config scripts/webpack.config.worker.prod.js","prepublishOnly":"npm run build","lint":"eslint src","wait":"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:node":"node node_modules/mocha/bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html"},"browser":{"./src/node/index.js":"./src/browser/index.js"},"repository":{"type":"git","url":"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},"keywords":["ffmpeg","WebAssembly","video"],"author":"Jerome Wu <jeromewus@gmail.com>","license":"MIT","bugs":{"url":"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},"engines":{"node":">=12.16.1"},"homepage":"https://github.com/ffmpegwasm/ffmpeg.wasm#readme","dependencies":{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},"devDependencies":{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.11.0","@types/emscripten":"^1.39.4","babel-eslint":"^10.1.0","babel-loader":"^8.1.0","chai":"^4.2.0","cors":"^2.8.5","eslint":"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1","express":"^4.17.1","mocha":"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.3.0","webpack":"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"}}')
            }
        }
          , t = {};
        function r(n) {
            if (t[n])
                return t[n].exports;
            var o = t[n] = {
                exports: {}
            };
            return e[n](o, o.exports, r),
            o.exports
        }
        return r.m = e,
        r.d = (e,t)=>{
            for (var n in t)
                r.o(t, n) && !r.o(e, n) && Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: t[n]
                })
        }
        ,
        r.g = function() {
            if ("object" == typeof globalThis)
                return globalThis;
            try {
                return this || new Function("return this")()
            } catch (e) {
                if ("object" == typeof window)
                    return window
            }
        }(),
        r.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t),
        r.r = e=>{
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
        ,
        (()=>{
            var e;
            r.g.importScripts && (e = r.g.location + "");
            var t = r.g.document;
            if (!e && t && (t.currentScript && (e = t.currentScript.src),
            !e)) {
                var n = t.getElementsByTagName("script");
                n.length && (e = n[n.length - 1].src)
            }
            if (!e)
                throw new Error("Automatic publicPath is not supported in this browser");
            e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"),
            r.p = e
        }
        )(),
        r.b = self.location.href,
        r(352)
    }
    )()
}
));
