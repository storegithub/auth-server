import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/accountType.entity';
import { Dictionary } from './entities/dictionary.entity';
import { DictionaryDetail } from './entities/dictionaryDetail.entity';

@Injectable()
export class dbConnectService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(connectionName?: string): ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/mysql/MysqlConnectionOptions").MysqlConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/cockroachdb/CockroachConnectionOptions").CockroachConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqlite/SqliteConnectionOptions").SqliteConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqlserver/SqlServerConnectionOptions").SqlServerConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sap/SapConnectionOptions").SapConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/oracle/OracleConnectionOptions").OracleConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/cordova/CordovaConnectionOptions").CordovaConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/nativescript/NativescriptConnectionOptions").NativescriptConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/react-native/ReactNativeConnectionOptions").ReactNativeConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqljs/SqljsConnectionOptions").SqljsConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/mongodb/MongoConnectionOptions").MongoConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/aurora-data-api/AuroraDataApiConnectionOptions").AuroraDataApiConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/expo/ExpoConnectionOptions").ExpoConnectionOptions>) | Promise<TypeOrmModuleOptions> {
        return {
            name: 'default',
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
            dropSchema: false,
            logging: Boolean(process.env.DATABASE_LOGGING),
            entities: [
                User,
                Account,
                AccountType,
                Dictionary,
                DictionaryDetail
            ]
        };
    }

}