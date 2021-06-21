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
//import { UserState } from "./user-state";
// export interface UserState{
//     user: string,
//     theme: string,
//     mode: number
// }
// const DEFAULT_USER_STATE: T = {
//     user: 'John Do',
//     theme: 'light',
//     mode: 1
// }
// const DEFAULT_STATE_DELAY = 2000;
//const persistanceObservable: Observable<Partial<UserState>> = of({user: 'Bart Simpson'} as Partial<UserState> ).pipe(delay(4000));
// const persistanceObservable: Observable<Partial<T>> = of({user: 'Bart Simpson'} as Partial<UserState> ).pipe(delay(4000));
// export const referenceEqualer = <T>(first: T, second: T): boolean => first === second;
// //todo: make auto-transformer to curried function
// //can be inspired by https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/
// export const referenceEqualerCurried = <T>(first: T) => (second: T): boolean => referenceEqualer(first, second);
// export const non = <T extends ((...args: Array<unknown>) => boolean)>(fun: T) => (...params: Parameters<T>): boolean => !fun(...params);
// /**
//  * Extract from input object full\partial\only one prop
//  * @param request Can be ALL, Array of properties, one property name, Works only with flat objects
//  */
// export const partialExtractor = <T, K extends ExtractionSelector<T>>(request: K) =>
//     (state: T) : ExtractionResult<T, K> =>
//         (request === FULL_STATE
//             ? state
//             : Array.isArray(request)
//                 ? {state, request}
//                 : state[request as keyof T]) as ExtractionResult<T, K>;
// /**
//  * provide only changed partial original state
//  * @param request Can be ALL, Array of properties, one property name
//  */
// export const observableSelector = <T, K extends ExtractionSelector<T>>(request: K): OperatorFunction<T, ExtractionResult<T, K>> =>
//     pipe(
//         map(partialExtractor(request)),
//         //distinctUntilChanged(Array.isArray(request) ? isEqual : referenceEqualer),
//         distinctUntilChanged(),
//     );
var StateService = /** @class */ (function () {
    function StateService() {
        var _this = this;
        this.entityState = new rxjs_1.Subject();
        this.entityChange = rxjs_1.of({});
        this.resultState = null;
        this.dispose$ = new rxjs_1.Subject();
        this.stateObservableFabric = function () {
            return rxjs_1.merge(
            //of(DEFAULT_USER_STATE).pipe(delay(DEFAULT_STATE_DELAY)),
            _this.entityChange).pipe(operators_1.exhaustMap(function (initState) { return _this.entityState.pipe(
            //takeUntil(this.dispose$),
            operators_1.scan(function (acc, curr) { return (__assign(__assign({}, acc), curr)); }, initState), operators_1.tap(_this.handleState), operators_1.shareReplay(1)); }));
        };
    }
    StateService.prototype.updateState = function (partialState) {
        this.entityState.next((partialState));
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
