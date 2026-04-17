"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Ok = void 0;
class Ok {
    value;
    type = "ok";
    constructor(value) {
        this.value = value;
    }
}
exports.Ok = Ok;
class Err {
    error;
    type = "err";
    constructor(error) {
        this.error = error;
    }
}
exports.Err = Err;
