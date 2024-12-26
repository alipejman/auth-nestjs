import { registerAs } from "@nestjs/config"

export enum ConfigKeys {
    App = "App",
    Db = "Db"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
    port: 3000
}))
const DbConfig = registerAs(ConfigKeys.Db, () => ({
        type: 'postgres', // نوع پایگاه داده
        host: 'localhost', // آدرس سرور پایگاه داده
        port: 5432, // پورت پایگاه داده
        username: 'postgres', // نام کاربری پایگاه داده
        password: 'aliapi', // رمز عبور پایگاه داده
        database: 'auth-nestjs', // نام پایگاه داده
        entities: [], // مدل‌های Entity
        synchronize: true, // برای همگام‌سازی مدل‌ها با پایگاه داده (فقط در محیط توسعه)
}))

export const configurations = [AppConfig, DbConfig]