import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { OTPEntity } from "src/modules/user/entities/otp.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
    private readonly logger = new Logger(TypeOrmDbConfig.name); 
    constructor (private configService : ConfigService) {}
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        const options: TypeOrmModuleOptions = {
            type: "postgres",
            port: this.configService.get('Db.port'),
            host: this.configService.get('Db.host'),
            username: this.configService.get('Db.username'),
            password: this.configService.get('Db.password'),
            database: this.configService.get('Db.database'),
            synchronize : true,
            autoLoadEntities: false,
            entities: [UserEntity, OTPEntity]
        };
        this.logger.log('DataBase Connecting Successfully ...');

        return options;
    }
}