import { interval, of } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { StateService } from './stateservice';

export interface UserState {
    name: string;
    theme: string;
    mode: number;
}

const INITIAL_USER_STATE  = {
    name: 'John Doe',
    theme: 'light',
    mode: 1
} as UserState

const DEFAULT_STATE_DELAY = 2000;


const stateService = new StateService<UserState>(INITIAL_USER_STATE);

const startTime = Date.now();

const consoleHandler = (prefix: any) => (value: any) =>
  console.log(
    `At ${Date.now() - startTime}: ${prefix} ${JSON.stringify(value)}`
  );

stateService
  .stateObservable()
  .subscribe(consoleHandler("Consumer, result state: "));

stateService
  .statePartialObservable(map((state: Partial<UserState>) => state.name))
  .subscribe(consoleHandler("User consumer, result state: "));

// of(true)
//   .pipe(delay(5000))
//   .subscribe(() => stateService.updateState({ mode: 2 }));

  interval(1000)
  .pipe(
    take(5)
  )
  .subscribe((i:number) => stateService.updateState({ mode: i }));