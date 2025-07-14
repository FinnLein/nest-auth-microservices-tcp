import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { ProviderService } from 'apps/auth/src/provider/provider.service'
import { Request } from 'express'

@Injectable()
export class ProvidersGuard implements CanActivate {
	constructor(private readonly providerService: ProviderService) { }
	canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest() as Request
		const provider = req.params.provider
		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) throw new NotFoundException(`Provider ${provider} not found`)

		return true
	}
}