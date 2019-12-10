"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
var INLINE_POLYFILLS = [
    'promise.js',
    'core-js.js',
    'dom.js',
    'es5-html-element.js',
    'system.js'
];
function getClientPolyfill(polyfillFile) {
    return __awaiter(this, void 0, void 0, function () {
        var polyfillFilePath, fileContents;
        return __generator(this, function (_a) {
            polyfillFilePath = path.join(path.resolve(__dirname), '../../prepped', polyfillFile);
            console.log(polyfillFilePath);
            fileContents = fs.readFileSync(polyfillFilePath, 'utf8');
            console.log(fileContents);
            return [2 /*return*/, fileContents];
        });
    });
}
exports.getClientPolyfill = getClientPolyfill;
function getAppBrowserCorePolyfills() {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(INLINE_POLYFILLS
                        .map(function (polyfillFile) { return getClientPolyfill(polyfillFile); }))];
                case 1:
                    results = _a.sent();
                    // concat the polyfills
                    return [2 /*return*/, results.join('\n').trim()];
            }
        });
    });
}
exports.getAppBrowserCorePolyfills = getAppBrowserCorePolyfills;
function getSystemLoader() {
    return __awaiter(this, void 0, void 0, function () {
        var polyfills;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAppBrowserCorePolyfills()];
                case 1:
                    polyfills = _a.sent();
                    return [2 /*return*/, "\n'use strict';\n(function () {\n  var doc = document;\n  var currentScript = doc.currentScript;\n\n  // Safari 10 support type=\"module\" but still download and executes the nomodule script\n  if (!currentScript || !currentScript.hasAttribute('nomodule') || !('onbeforeload' in currentScript)) {\n\n    " + polyfills + "\n\n    // Figure out currentScript (for IE11, since it does not support currentScript)\n    var regex = /\\/" + 'ionic' + "(\\.esm)?\\.js($|\\?|#)/;\n    var scriptElm = currentScript || Array.from(doc.querySelectorAll('script')).find(function(s) {\n      return regex.test(s.src) || s.getAttribute('data-stencil-namespace') === \"" + 'ionic' + "\";\n    });\n\n    var resourcesUrl = scriptElm ? scriptElm.getAttribute('data-resources-url') || scriptElm.src : '';\n    var start = function() {\n      var url = new URL('http://', resourcesUrl);\n      console.log(url)\n      System.import(url.href);\n    };\n\n    if (win.__stencil_cssshim) {\n      win.__stencil_cssshim.initShim().then(start);\n    } else {\n      start();\n    }\n\n    // Note: using .call(window) here because the self-executing function needs\n    // to be scoped to the window object for the ES6Promise polyfill to work\n  }\n}).call(window);\n"];
            }
        });
    });
}
function writeSystemLoader() {
    return __awaiter(this, void 0, void 0, function () {
        var loaderContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSystemLoader()];
                case 1:
                    loaderContent = _a.sent();
                    return [4 /*yield*/, fs.writeFileSync('./poly/ionic-config-polyfill.js', loaderContent)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.writeSystemLoader = writeSystemLoader;
writeSystemLoader();