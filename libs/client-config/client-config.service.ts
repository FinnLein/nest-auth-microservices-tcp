import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientOptions, Transport } from '@nestjs/microservices'

@Injectable()
export class ClientConfigService {
	constructor(private config: ConfigService) { }
	private hostName = 'localhost'


	getUsersClientPort(): number {
		return this.config.getOrThrow<number>('USERS_CLIENT_PORT')
	}

	getAuthClientPort(): number {
		return this.config.getOrThrow<number>('AUTH_CLIENT_PORT')
	}
	getAccountClientPort(): number {
		return this.config.getOrThrow<number>('ACCOUNT_CLIENT_PORT')
	}
	getMailClientPort(): number {
		return this.config.getOrThrow<number>('MAIL_CLIENT_PORT')
	}


	get authClientOptions(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.hostName,
				port: this.getAuthClientPort()
			}
		}
	}
	get usersClientOptions(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.hostName,
				port: this.getUsersClientPort()
			}
		}
	}
	get accountsClientOptions(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.hostName,
				port: this.getAccountClientPort()
			}
		}
	}
	get mailClientOptions(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.hostName,
				port: this.getMailClientPort()
			}
		}
	}

}
