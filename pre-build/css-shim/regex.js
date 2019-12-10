"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAR_USAGE_START = /\bvar\(/;
exports.VAR_ASSIGN_START = /\B--[\w-]+\s*:/;
exports.COMMENTS = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim;
exports.TRAILING_LINES = /^[\t ]+\n/gm;
