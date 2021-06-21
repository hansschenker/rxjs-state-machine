"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var statemanager_1 = require("./statemanager");
var INITIAL_USER_STATE = {
    name: 'John Doe',
    theme: 'light',
    mode: 1
};
var DEFAULT_STATE_DELAY = 2000;
var stateService = new statemanager_1.StateService();
var startTime = Date.now();
var consoleHandler = function (prefix) { return function (value) {
    return console.log("At " + (Date.now() - startTime) + ": " + prefix + " " + JSON.stringify(value));
}; };
stateService
    .stateObservable()
    .subscribe(consoleHandler("Consumer, result state: "));
stateService
    .statePartialObservable(operators_1.map(function (state) { return state.name; }))
    .subscribe(consoleHandler("User consumer, result state: "));
// of(true)
//   .pipe(delay(5000))
//   .subscribe(() => stateService.updateState({ mode: 2 }));
rxjs_1.interval(1000)
    .pipe(operators_1.take(5))
    .subscribe(function (i) { return stateService.updateState({ mode: i }); });
