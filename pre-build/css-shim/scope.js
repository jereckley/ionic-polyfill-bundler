"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var css_parser_1 = require("./css-parser");
var selectors_1 = require("./selectors");
var template_1 = require("./template");
function parseCSS(original) {
    var ast = css_parser_1.parse(original);
    var template = template_1.compileTemplate(original);
    var selectors = selectors_1.getSelectors(ast);
    return {
        original: original,
        template: template,
        selectors: selectors,
        usesCssVars: template.length > 1
    };
}
exports.parseCSS = parseCSS;
function addGlobalStyle(globalScopes, styleEl) {
    if (globalScopes.some(function (css) { return css.styleEl === styleEl; })) {
        return false;
    }
    var css;
    if (styleEl.textContent) {
        css = parseCSS(styleEl.textContent);
        css.styleEl = styleEl;
        globalScopes.push(css);
    }
    return true;
}
exports.addGlobalStyle = addGlobalStyle;
function updateGlobalScopes(scopes) {
    var selectors = selectors_1.getSelectorsForScopes(scopes);
    var props = selectors_1.resolveValues(selectors);
    scopes.forEach(function (scope) {
        if (scope.usesCssVars) {
            if (scope.styleEl) {
                scope.styleEl.textContent = template_1.executeTemplate(scope.template, props);
            }
        }
    });
}
exports.updateGlobalScopes = updateGlobalScopes;
function reScope(scope, scopeId) {
    var template = scope.template.map(function (segment) {
        return (typeof segment === 'string')
            ? replaceScope(segment, scope.scopeId, scopeId)
            : segment;
    });
    var selectors = scope.selectors.map(function (sel) {
        return __assign(__assign({}, sel), { selector: replaceScope(sel.selector, scope.scopeId, scopeId) });
    });
    return __assign(__assign({}, scope), { template: template,
        selectors: selectors,
        scopeId: scopeId });
}
exports.reScope = reScope;
function replaceScope(original, oldScopeId, newScopeId) {
    original = replaceAll(original, "\\." + oldScopeId, "." + newScopeId);
    return original;
}
exports.replaceScope = replaceScope;
function replaceAll(input, find, replace) {
    return input.replace(new RegExp(find, 'g'), replace);
}
exports.replaceAll = replaceAll;
