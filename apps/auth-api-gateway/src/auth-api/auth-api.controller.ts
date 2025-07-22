import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ProviderService } from 'apps/auth/src/provider/provider.service'
import { Request, Response } from 'express'
import { AuthApiService } from './auth-api.service'
import { LoginApiDto } from './dto/login-api.dto'
import { RegisterApiDto } from './dto/register-api.dto'
import { ProvidersGuard } from './guards/provider.guard'

@Controller('auth')
export class AuthApiController {
  constructor(private readonly authService: AuthApiService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() dto: RegisterApiDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: LoginApiDto, @Req() req: Request) {
    return this.authService.login(req, dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res)
  }
  @UseGuards(ProvidersGuard)
  @Get('/oauth/callback/:provider')
  public async callback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string) {
    if (!code) throw new BadRequestException('Code not pass')
    await this.authService.extractProfileByCode(req, provider, code)

    return res.redirect(`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`)
  }

  @UseGuards(ProvidersGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    const providerInstance = this.providerService.findByService(provider)
    return {
      url: providerInstance.getAuthURL()
    }
  }
}
