"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var load_link_styles_1 = require("./load-link-styles");
var template_1 = require("./template");
var scope_1 = require("./scope");
var selectors_1 = require("./selectors");
var CustomStyle = /** @class */ (function () {
    function CustomStyle(win, doc) {
        this.win = win;
        this.doc = doc;
        this.count = 0;
        this.hostStyleMap = new WeakMap();
        this.hostScopeMap = new WeakMap();
        this.globalScopes = [];
        this.scopesMap = new Map();
        this.didInit = false;
    }
    CustomStyle.prototype.initShim = function () {
        var _this = this;
        if (this.didInit) {
            return Promise.resolve();
        }
        else {
            this.didInit = true;
            return new Promise(function (resolve) {
                _this.win.requestAnimationFrame(function () {
                    load_link_styles_1.startWatcher(_this.doc, _this.globalScopes);
                    load_link_styles_1.loadDocument(_this.doc, _this.globalScopes).then(function () { return resolve(); });
                });
            });
        }
    };
    CustomStyle.prototype.addLink = function (linkEl) {
        var _this = this;
        return load_link_styles_1.addGlobalLink(this.doc, this.globalScopes, linkEl).then(function () {
            _this.updateGlobal();
        });
    };
    CustomStyle.prototype.addGlobalStyle = function (styleEl) {
        if (scope_1.addGlobalStyle(this.globalScopes, styleEl)) {
            this.updateGlobal();
        }
    };
    CustomStyle.prototype.createHostStyle = function (hostEl, cssScopeId, cssText, isScoped) {
        if (this.hostScopeMap.has(hostEl)) {
            throw new Error('host style already created');
        }
        var baseScope = this.registerHostTemplate(cssText, cssScopeId, isScoped);
        var styleEl = this.doc.createElement('style');
        styleEl.setAttribute('data-no-shim', '');
        if (!baseScope.usesCssVars) {
            // This component does not use (read) css variables
            styleEl.textContent = cssText;
        }
        else if (isScoped) {
            // This component is dynamic: uses css var and is scoped
            styleEl['s-sc'] = cssScopeId = baseScope.scopeId + "-" + this.count;
            styleEl.textContent = '/*needs update*/';
            this.hostStyleMap.set(hostEl, styleEl);
            this.hostScopeMap.set(hostEl, scope_1.reScope(baseScope, cssScopeId));
            this.count++;
        }
        else {
            // This component uses css vars, but it's no-encapsulation (global static)
            baseScope.styleEl = styleEl;
            if (!baseScope.usesCssVars) {
                styleEl.textContent = template_1.executeTemplate(baseScope.template, {});
            }
            this.globalScopes.push(baseScope);
            this.updateGlobal();
            this.hostScopeMap.set(hostEl, baseScope);
        }
        return styleEl;
    };
    CustomStyle.prototype.removeHost = function (hostEl) {
        var css = this.hostStyleMap.get(hostEl);
        if (css) {
            css.remove();
        }
        this.hostStyleMap.delete(hostEl);
        this.hostScopeMap.delete(hostEl);
    };
    CustomStyle.prototype.updateHost = function (hostEl) {
        var scope = this.hostScopeMap.get(hostEl);
        if (scope && scope.usesCssVars && scope.isScoped) {
            var styleEl = this.hostStyleMap.get(hostEl);
            if (styleEl) {
                var selectors = selectors_1.getActiveSelectors(hostEl, this.hostScopeMap, this.globalScopes);
                var props = selectors_1.resolveValues(selectors);
                styleEl.textContent = template_1.executeTemplate(scope.template, props);
            }
        }
    };
    CustomStyle.prototype.updateGlobal = function () {
        scope_1.updateGlobalScopes(this.globalScopes);
    };
    CustomStyle.prototype.registerHostTemplate = function (cssText, scopeId, isScoped) {
        var scope = this.scopesMap.get(scopeId);
        if (!scope) {
            scope = scope_1.parseCSS(cssText);
            scope.scopeId = scopeId;
            scope.isScoped = isScoped;
            this.scopesMap.set(scopeId, scope);
        }
        return scope;
    };
    return CustomStyle;
}());
exports.CustomStyle = CustomStyle;
