import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { v4 as uuid } from 'uuid'
import { TypeBaseProviderOptions } from './types/base-provider-options.types'
import { TypeUserInfo } from './types/user-info.types'

@Injectable()
export class BaseOAuthService {
	private BASE_URL: string

	constructor(private readonly options: TypeBaseProviderOptions) { }

	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return {
			id: uuid(),
			...data,
			provider: this.options.name
		}
	}
	public getAuthURL() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectURL(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'consent'
		})

		return `${this.options.authorize_url}?${query}`
	}
	public getRedirectURL() {
		return `http://localhost:4000/auth/oauth/callback/${this.options.name}`
	}
	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		try {
			const tokenQuery = new URLSearchParams({
				client_id: this.options.client_id,
				client_secret: this.options.client_secret,
				code,
				redirect_uri: this.getRedirectURL(),
				grant_type: 'authorization_code'
			}).toString()

			const tokenRequest = await fetch(this.options.access_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				body: tokenQuery
			})

			if (!tokenRequest.ok) {
				const errorText = await tokenRequest.text()
				console.error('Token request failed:', tokenRequest.status, errorText)
				throw new RpcException(`Cannot get token from ${this.options.access_url}. Status ${tokenRequest.status}`)
			}

			const tokenResponse = await tokenRequest.json()

			if (!tokenResponse.access_token) {
				console.error('No access_token in token response:', tokenResponse)
				throw new RpcException(`No access_token received from ${this.options.access_url}`)
			}

			const userRequest = await fetch(this.options.profile_url, {
				headers: {
					Authorization: `Bearer ${tokenResponse.access_token}`
				}
			})

			if (!userRequest.ok) {
				const errorText = await userRequest.text()
				console.error('User info request failed:', userRequest.status, errorText)
				throw new RpcException(`Cannot get user info from ${this.options.profile_url}. Status ${userRequest.status}`)
			}

			const user = await userRequest.json()
			const userData = await this.extractUserInfo(user)
			return {
				...userData,
				access_token: tokenResponse.access_token,
				refresh_token: tokenResponse.refresh_token,
				expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
				provider: this.options.name
			}

		} catch (error) {
			throw error
		}
	}

	set baseURL(value: string) {
		this.BASE_URL = value
	}

	get name() {
		return this.options.name
	}
	get access_url() {
		return this.options.access_url
	}
	get profile_url() {
		return this.options.profile_url
	}
	get scopes() {
		return this.options.scopes
	}
}