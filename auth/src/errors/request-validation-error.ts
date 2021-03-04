// ValidatorError is a Type. It describes d Type dat is returned when we do a validation attempt using express-validator.
import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]){
        super('Invalid request parameter');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(){
        // return an array of error objects
        return this.errors.map( err => {
            return { message: err.msg, field: err.param}
        });
    }
}