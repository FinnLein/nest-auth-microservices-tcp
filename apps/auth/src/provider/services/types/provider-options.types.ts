import { TypeBaseProviderOptions } from './base-provider-options.types'

export type TypeProviderOptions = Pick<TypeBaseProviderOptions, 'scopes' | 'client_id' | 'client_secret'>