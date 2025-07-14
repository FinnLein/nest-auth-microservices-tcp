import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AuthModule } from './auth.module'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4001
      }
    }
  )

  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen()
}
bootstrap()
