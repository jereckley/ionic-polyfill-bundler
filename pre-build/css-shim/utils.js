"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLOBAL_SCOPE = ':root';
function findRegex(regex, cssText, offset) {
    regex['lastIndex'] = 0;
    var r = cssText.substring(offset).match(regex);
    if (r && r['index']) {
        var start = offset + r['index'];
        return {
            start: start,
            end: start + r[0].length
        };
    }
    return null;
}
exports.findRegex = findRegex;
