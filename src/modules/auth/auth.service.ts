import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { checkOtpDto, sendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensPayload } from './types/payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRipository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRipository: Repository<OTPEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }
  async sendOtp(otpDto: sendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRipository.findOneBy({ mobile });
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2)
    if (!user) {
      user = await this.userRipository.create({
        mobile,
      });
      user = await this.userRipository.save(user);
    }
    this.createOtpForUser(user);

    return {
      message: "Sent Otp Successfully.."
    }
  }

  async checkOtp(otpDto: checkOtpDto) {
    const { code, mobile } = otpDto;
    console.log('Checking OTP for mobile:', mobile); // لاگ شماره موبایل
  
    const now = new Date();
    const user = await this.userRipository.findOne({
      where: { mobile },
      relations: ['otp'], // بارگذاری ارتباطات
    });
  
    if (!user) {
      console.log('User not found'); // لاگ در صورت عدم وجود کاربر
      throw new UnauthorizedException('not found account');
    }
  
    if (!user.otp) {
      console.log('OTP not found for user'); // لاگ در صورت عدم وجود OTP
      throw new UnauthorizedException('OTP not found for user');
    }
  
    if (user.otp.code !== code) {
      console.log('OTP code is incorrect'); // لاگ در صورت نادرست بودن کد OTP
      throw new UnauthorizedException('otp code is not incorrect');
    }
  
    if (user.otp.expire_in < now) {
      console.log('OTP code is expired'); // لاگ در صورت منقضی بودن کد OTP
      throw new UnauthorizedException('otp code is expired');
    }
  
    if (!user.mobile_verfy) {
      await this.userRipository.update(
        { id: user.id },
        { mobile_verfy: true }
      );
    }
      const {accessToken, refreshToken} = this.makeTokensForUser({id: user.id, mobile: user.mobile})
      return {
        accessToken,
        refreshToken,
        message: "you logged in successfully .."
      };
    
  }

  makeTokensForUser(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.accessTokenSecret"),
      expiresIn: "30d"
      })
      const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.refreshTokenSecret"),
      expiresIn: "1y"
      })
      return {
        accessToken,
        refreshToken
      };
  }
  
  

  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRipository.findOneBy({
      userId: user.id
    });
  
    if (otp) {
      if (otp.expire_in > new Date()) {
        throw new BadRequestException("Otp Code Is Not Expired!");
      }
      otp.code = code;
      otp.expire_in = expiresIn;
    } else {
      otp = await this.otpRipository.create({
        code,
        expire_in: expiresIn,
        userId: user.id
      });
    }
  
    await this.otpRipository.save(otp);
    user.OTPId = otp.id; // اطمینان از اینکه OTPId به درستی تنظیم شده است
    await this.userRipository.save(user);
  }
  

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify<TokensPayload>(token, {
        secret: await this.configService.get("jwt.accessTokenSecret")
      });
      if(typeof payload === "object" && payload?.id) {
        const user = await this.userRipository.findOneBy({id: payload.id});
        if(!user) {
          throw new UnauthorizedException("login on your account");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account");
    } catch (error) {
      throw new UnauthorizedException("login on your account");
    }
  }

}
