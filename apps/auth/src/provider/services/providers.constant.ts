import { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import { BaseOAuthService } from './base-oauth.service'

export const ProviderOptionsSymbol = Symbol()

export type TypeOptions = {
	baseUrl: string
	services: BaseOAuthService[]
}

export type AsyncTypeOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>