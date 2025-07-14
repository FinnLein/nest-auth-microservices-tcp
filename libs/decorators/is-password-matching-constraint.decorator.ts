import { RegisterDto } from '@app/contracts/auth/register.dto'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
	validate(passwordRepeat: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
		const obj = validationArguments.object as RegisterDto
		return obj.password === passwordRepeat
	}
	defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Password not match'
	}
}