import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { UserModule } from './user.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4002
    }
  })

  app.useGlobalFilters(new CustomRpcExceptionFilter())

  await app.listen()
}
bootstrap()
