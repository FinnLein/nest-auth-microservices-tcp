import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { UserModule } from './user.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
      password: process.env.REDIS_PASSWORD
    }
  })

  app.useGlobalFilters(new CustomRpcExceptionFilter())

  await app.listen()
}
bootstrap()
