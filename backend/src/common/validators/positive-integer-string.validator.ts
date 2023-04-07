import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'positiveIntegerString', async: false })
export class PositiveIntegerStringValidator implements ValidatorConstraintInterface {
    validate(value: string) {
        return parseInt(value) > 0;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} has to be a positive integer`;
    }
}
