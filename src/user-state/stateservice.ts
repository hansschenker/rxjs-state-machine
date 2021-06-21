//import { isEqual, pick } from "lodash-es";
import { BehaviorSubject, Observable, OperatorFunction, timer, Subject, merge, of, pipe, throwError, Subscription } from "rxjs";
import { scan, filter, delay, shareReplay, tap, takeUntil, exhaustMap, map, distinctUntilChanged } from "rxjs/operators"

export class StateService<T> {

    //private persistanceObservable: Observable<Partial<T>> ;

    private entityState: Subject<Partial<T>> = new Subject<Partial<T>>();
    private entityChange: Observable<Partial<T>> = this.entityState.asObservable();
    //private entitySubscription: Subscription;

    private dispose$ = new Subject<boolean>();

    constructor(private initialState: T) {
        //this.persistanceObservable = of(initialState);
        this.updateState(initialState);
    }

    updateState(partialState: Partial<T>): void {
        this.entityState.next((partialState));
    }

    stateObservable(): Observable<Partial<T>> {

        if (Boolean(this.entityChange))
            return this.entityChange as Observable<Partial<T>>;
        else
            return this.entityChange  = this.stateObservableFabric() as Observable<Partial<T>> ;

    }

    statePartialObservable<R>(mapOperator: OperatorFunction<Partial<T>, R>) {
        if (this.entityChange) {
            return this.entityChange.pipe(mapOperator);
        } else {
            return throwError(() => console.log("no resultState"))
        }
    }

    private stateObservableFabric = (): Observable<Partial<T>> => {

        return merge(
            //of(DEFAULT_USER_STATE).pipe(delay(DEFAULT_STATE_DELAY)),
            //this.persistanceObservable
            this.entityChange
        ).pipe(
            exhaustMap((initState: Partial<T>) => this.entityState.pipe(
            takeUntil(this.dispose$),
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

        //this.entityChange = null;
    }
}
