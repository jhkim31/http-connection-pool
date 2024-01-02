"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJson(jsonStr) {
    try {
        JSON.parse(jsonStr);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.default = isJson;
