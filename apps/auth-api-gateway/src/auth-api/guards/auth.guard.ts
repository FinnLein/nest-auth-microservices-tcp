import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersApiService } from '../../users-api/users-api.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UsersApiService) { }

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		if (typeof request.session.userId === 'undefined') throw new UnauthorizedException('User not authorize')

		const user = await this.userService.findById(request?.session?.userId)

		request.user = user

		return true
	}
}