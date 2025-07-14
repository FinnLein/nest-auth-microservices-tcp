import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AccountsModule } from './accounts.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AccountsModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4011
      }
    }
  )
  await app.listen()

}
bootstrap()
