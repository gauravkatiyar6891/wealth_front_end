import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
export function FieldLengthValidators(length: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        if (control && control.value != undefined) {
            let value = control.value.toString();
            if (value.length == length) return null;
            else return {
                length: true
            }
        }
        return null;
    }
}
