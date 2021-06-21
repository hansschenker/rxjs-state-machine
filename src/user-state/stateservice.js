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
exports.StateService = void 0;
//import { isEqual, pick } from "lodash-es";
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var StateService = /** @class */ (function () {
    function StateService() {
        var _this = this;
        this.persistanceObservable = rxjs_1.of({});
        this.dispose$ = new rxjs_1.Subject();
        this.stateObs = new rxjs_1.Subject();
        this.resultState = null;
        this.stateObservableFabric = function () {
            return rxjs_1.merge(
            //of(DEFAULT_USER_STATE).pipe(delay(DEFAULT_STATE_DELAY)),
            _this.persistanceObservable).pipe(operators_1.exhaustMap(function (initState) { return _this.stateObs.pipe(
            //takeUntil(this.dispose$),
            operators_1.scan(function (acc, curr) { return (__assign(__assign({}, acc), curr)); }, initState), operators_1.tap(_this.handleState), operators_1.shareReplay(1)); }));
        };
    }
    StateService.prototype.changeState = function (partialState) {
        this.stateObs.next((partialState));
    };
    StateService.prototype.stateObservable = function () {
        if (Boolean(this.resultState))
            return this.resultState;
        else
            return this.resultState = this.stateObservableFabric();
    };
    StateService.prototype.statePartialObservable = function (mapOperator) {
        if (this.resultState) {
            return this.resultState.pipe(mapOperator);
        }
        else {
            return rxjs_1.throwError(function () { return console.log("no resultState"); });
        }
    };
    StateService.prototype.handleState = function (saveState) {
        //this.persistanceSrv.Save(state)
        console.log("Final state is " + JSON.stringify(saveState));
    };
    StateService.prototype.stop = function () {
        this.dispose$.next(true);
        this.resultState = null;
    };
    return StateService;
}());
exports.StateService = StateService;
