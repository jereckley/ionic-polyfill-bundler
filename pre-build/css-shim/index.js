"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_style_1 = require("./custom-style");
// @ts-ignore: window is not defined
var win = window;
function needsShim() {
    return !(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'));
}
if (!win.__stencil_cssshim && needsShim()) {
    win.__stencil_cssshim = new custom_style_1.CustomStyle(win, document);
}
