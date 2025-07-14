import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { CustomRpcExceptionFilter } from './filters/rpc-exception.filter'
import { MailModule } from './mail.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4003
      }
    }
  )
  app.useGlobalFilters(new CustomRpcExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen()
}
bootstrap()
