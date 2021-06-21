//import { isEqual, pick } from "lodash-es";
import { BehaviorSubject, Observable, OperatorFunction, timer, Subject, merge, of, pipe, throwError } from "rxjs";
import { scan, filter, delay, shareReplay, tap, takeUntil, exhaustMap, map, distinctUntilChanged } from "rxjs/operators"
import { ExtractionResult, ExtractionSelector, FULL_STATE } from "./statemanager.interface";
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

export class StateService<T> {

    constructor(private initialState: T) {
        
    }
    
    private entityState: Subject<Partial<T>> = new Subject<Partial<T>>();
    private entityChange: Observable<Partial<T>> = of({} as Partial<T>);
    private resultState: Observable<Partial<T>> |  null = null;

    private dispose$ = new Subject<boolean>();



    updateState(partialState: Partial<T>): void {
        this.entityState.next((partialState));
    }

    stateObservable(): Observable<Partial<T>> {

        if (Boolean(this.resultState))
            return this.resultState as Observable<Partial<T>>;
        else
            return this.resultState  = this.stateObservableFabric() as Observable<Partial<T>> ;

    }

    statePartialObservable<R>(mapOperator: OperatorFunction<Partial<T>, R>) {
        if (this.resultState) {
            return this.resultState.pipe(mapOperator);
        } else {
            return throwError(() => console.log("no resultState"))
        }
    }

    private stateObservableFabric = (): Observable<Partial<T>> => {

        return merge(
            //of(DEFAULT_USER_STATE).pipe(delay(DEFAULT_STATE_DELAY)),
            this.entityChange
        ).pipe(
            exhaustMap((initState: Partial<T>) => this.entityState.pipe(
            //takeUntil(this.dispose$),
            scan((acc: Partial<T>, curr: Partial<T>) => ({ ...acc, ...curr } as Partial<T>), initState),
            tap(this.handleState),
            shareReplay(1)
        )));
    }

    private handleState(saveState: Partial<T>) {
        //this.persistanceSrv.Save(state)
        console.log(`Final state is ${JSON.stringify(saveState)}`)
    }

    stop(): void{
        this.dispose$.next(true);

        this.resultState = null;
    }
}
