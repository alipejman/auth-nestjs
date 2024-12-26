import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";import { configurations } from "src/config/config";
 "@nestjs/config"
@Module({
    imports: [ConfigModule.forRoot({
        load: configurations,
        isGlobal: true
    })]
})
export class customConfigModule {}