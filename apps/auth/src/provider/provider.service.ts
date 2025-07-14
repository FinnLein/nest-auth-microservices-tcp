import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { BaseOAuthService } from './services/base-oauth.service'
import { ProviderOptionsSymbol, TypeOptions } from './services/providers.constant'

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions
	) { }

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseURL === this.options.baseUrl
		}
	}

	public findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
