import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, switchMap, catchError, take } from 'rxjs/operators';
/**
 * source : https://stackoverflow.com/questions/36919011/how-to-add-debounce-time-to-an-async-validator-in-angular-2
 * Usage:
 * const validator = debouncedAsyncValidator<string>(v => {
 * return this.myService.validateMyString(v).pipe(
 *      map(r => {
 *          return r.isValid ? { foo: "String not valid" } : null;
 *      })
 *  );
 * });
 * const control = new FormControl('', null, validator);
 */

/**
 * From a given remove validation fn, it returns the AsyncValidatorFn
 * @param remoteValidation: The remote validation fn that returns an observable of <ValidationErrors | null>
 * @param ignore: Ignore this value
 * @param remoteValidation: The remote validation fn that returns an observable of <ValidationErrors | null>
 * @param debounceMs: The debounce time
 */
function debouncedAsyncValidator<T>(
    remoteValidation: (v: T) => Observable<ValidationErrors | null>,
    ignore: T = null,
    remoteError: ValidationErrors = { remote: 'Unhandled error occurred.' },
    debounceMs = 800
): AsyncValidatorFn {
    const values = new BehaviorSubject<T>(null);
    const validity$ = values.pipe(
        debounceTime(debounceMs),
        filter((v: T) => v !== ignore),
        distinctUntilChanged(),
        switchMap(remoteValidation),
        catchError(() => of(remoteError)),
        take(1)
    );
    return (control: AbstractControl) => {
        if (!control.value) {
            return of(null);
        }
        values.next(control.value);
        return validity$;
    };
}

export { debouncedAsyncValidator };
