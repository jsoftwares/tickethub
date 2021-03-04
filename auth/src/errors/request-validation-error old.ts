// ValidatorError is a Type. It describes d Type dat is returned when we do a validation attempt using express-validator.
import {ValidationError} from 'express-validator';

export class RequestValidationError extends Error {
    constructor(public errors: ValidationError[]){
        super();
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}