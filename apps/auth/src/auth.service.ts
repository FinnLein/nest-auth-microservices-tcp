import { ACCOUNTS_PATTERNS } from '@app/contracts/accounts/accounts.patterns'
import { LoginDto } from '@app/contracts/auth/login.dto'
import { RegisterDto } from '@app/contracts/auth/register.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { UserCreateDto } from '@app/contracts/users/user-create.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { AuthMethod } from '@prisma/client'
import { hash, verify } from 'argon2'
import { ACCOUNT_CLIENT, MAIL_CLIENT, USERS_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { USERS_PATTERNS } from './../../../libs/contracts/src/users/user.patterns'
import { ProviderService } from './provider/provider.service'

@Injectable()
export class AuthService {
  public constructor(
    private readonly providerService: ProviderService,
    private readonly jwt: JwtService,
    @Inject(USERS_CLIENT) private readonly usersClientProxy: ClientProxy,
    @Inject(ACCOUNT_CLIENT) private readonly accountClientProxy: ClientProxy,
    @Inject(MAIL_CLIENT) private readonly mailClientProxy: ClientProxy,
  ) { }
  public async register(dto: RegisterDto) {

    const user = await lastValueFrom(this.usersClientProxy.send<UserDto, string>(USERS_PATTERNS.FIND_BY_EMAIL, dto.email))

    if (user) throw new RpcException({ statusCode: 409, message: 'User with this email already exists' })

    const newUser = await lastValueFrom(this.usersClientProxy.send<UserDto, UserCreateDto>(USERS_PATTERNS.CREATE, {
      password: await hash(dto.password),
      email: dto.email,
      displayName: dto.displayName,
      method: AuthMethod.CREDENTIALS,
      isVerified: false
    }))

    await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.SEND_VERIFICATION, newUser.email))

    return {
      message: 'You have authorized successfully. Please accept your email. The message have sent on your email'
    }

  }
  public async login(dto: LoginDto) {
    const user = await lastValueFrom(this.usersClientProxy.send<UserDto, string>(USERS_PATTERNS.FIND_BY_EMAIL, dto.email))
    if (!user || !user.password) throw new RpcException({ statusCode: 404, message: 'User with this email not found' })
    const isValidPassword = await verify(user.password, dto.password)
    if (!isValidPassword) throw new RpcException({ statusCode: 401, message: 'Invalid password' })

    if (!user.isVerified) {
      await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.SEND_VERIFICATION, user.email))
      throw new RpcException({ statusCode: 401, message: 'Your email not confirmed. Please check your email and confirm' })
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.code) {
        await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.SEND_TWO_FACTOR_AUTH, user.email))
        return {
          message: "Check your email. Two Factor Authentication code is required"
        }
      }
      const userEmail = user.email
      const code = dto.code
      await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.VALIDATE_TWO_FACTOR_AUTH, { userEmail, code }))
    }

    return user
  }

  public async extractProfileByCode(
    provider: string,
    code: string
  ) {
    const providerInstance = this.providerService.findByService(provider)
    const profile = await providerInstance.findUserByCode(code)
    const profileId = profile.id
    const profileProvider = profile.provider
    const account = await lastValueFrom(this.accountClientProxy.send(ACCOUNTS_PATTERNS.FIND_ONE,
      { profileId, profileProvider }))

    let user = account?.userId
      ? await lastValueFrom(this.usersClientProxy.send<UserDto, string>(USERS_PATTERNS.FIND_BY_ID, account.userId))
      : null

    if (!user) {
      try {
        user = await lastValueFrom(this.usersClientProxy.send<UserDto, UserCreateDto>(USERS_PATTERNS.CREATE, {
          email: profile.email,
          password: '',
          displayName: profile.name,
          picture: profile.picture,
          method: AuthMethod[profile.provider.toUpperCase()],
          isVerified: true
        })
        )
        if (!account) {
          await lastValueFrom(this.accountClientProxy.send(ACCOUNTS_PATTERNS.CREATE, {
            userId: user.id,
            type: 'oauth',
            provider: profile.provider,
            accessToken: profile.access_token,
            refreshToken: profile.refresh_token,
            expiresAt: profile.expires_at
          }
          ))
        }
      } catch (error) {
        throw error
      }

    }

    return user
  }
}
