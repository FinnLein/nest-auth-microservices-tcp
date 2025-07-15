import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AuthModule } from './auth.module'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
        password: process.env.REDIS_PASSWORD
      }
    }
  )

  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen()
}
bootstrap()
