import { Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendOtpDto } from './dto/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  sendOtp(@Body() otpDto: sendOtpDto) {
    return this.authService.sendOtp(otpDto);
  }

}
