import { DynamicModule, Module } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { AsyncTypeOptions, ProviderOptionsSymbol, TypeOptions } from './services/providers.constant'
@Module({})
export class ProviderModule {
  public static register(options: TypeOptions): DynamicModule {
    return {
      module: ProviderModule,
      exports: [ProviderService],
      providers: [{
        useValue: options.services,
        provide: ProviderOptionsSymbol
      },
        ProviderService]
    }
  }
  public static registerAsync(options: AsyncTypeOptions): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      exports: [ProviderService],
      providers: [{
        useFactory: options.useFactory,
        provide: ProviderOptionsSymbol,
        inject: options.inject
      },
        ProviderService]
    }
  }
}
