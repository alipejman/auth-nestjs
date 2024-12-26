import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { sendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRipository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRipository: Repository<OTPEntity>
  ) {}
  async sendOtp(otpDto: sendOtpDto) {
    const {mobile} = otpDto;
    let user = await this.userRipository.findOneBy({mobile});
    const expiresIn = new Date(new Date().getTime() + 1000 * 60  * 2)
    if(!user) {
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

  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(new Date().getTime() + 1000 *60 *2);
    let otp = await this.otpRipository.findOneBy({
      userId: user.id
    })
    if(otp) {
      if(otp.expire_in > new Date()) {
        throw new BadRequestException("Otp Code Is Not Expired!");
      }
      otp.code = code;
      otp.expire_in = expiresIn
    } else {
      otp = await this.otpRipository.create({
        code,
        expire_in: expiresIn,
        userId: user.id
      })
    }
    await this.otpRipository.save(otp);
    user.OTPId = otp.id;
    await this.userRipository.save(user);
  }
  
}
