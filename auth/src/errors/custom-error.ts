export abstract class CustomError extends Error {

    abstract statusCode: number;

    constructor(message: string) {  //this message argument is only for logging purpose
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string, field?:string }[];
}