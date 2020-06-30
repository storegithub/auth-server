import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Dictionary } from './entities/dictionary.entity';
import { DictionaryDetail } from './entities/dictionaryDetail.entity';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { EmailLog } from './entities/email.log.entity';
import { Bank } from './entities/bank.entity';
import { Branch } from './entities/branch.entity';

@Injectable()
export class dbConnectService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(connectionName?: string): ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/mysql/MysqlConnectionOptions").MysqlConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/postgres/PostgresConnectionOptions").PostgresConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/cockroachdb/CockroachConnectionOptions").CockroachConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqlite/SqliteConnectionOptions").SqliteConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqlserver/SqlServerConnectionOptions").SqlServerConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sap/SapConnectionOptions").SapConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/oracle/OracleConnectionOptions").OracleConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/cordova/CordovaConnectionOptions").CordovaConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/nativescript/NativescriptConnectionOptions").NativescriptConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/react-native/ReactNativeConnectionOptions").ReactNativeConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/sqljs/SqljsConnectionOptions").SqljsConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/mongodb/MongoConnectionOptions").MongoConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/aurora-data-api/AuroraDataApiConnectionOptions").AuroraDataApiConnectionOptions>) | ({ retryAttempts?: number; retryDelay?: number; autoLoadEntities?: boolean; keepConnectionAlive?: boolean; } & Partial<import("typeorm/driver/expo/ExpoConnectionOptions").ExpoConnectionOptions>) | Promise<TypeOrmModuleOptions> {
        return {
            name: 'default',
            type: 'mysql',
            host: 'localhost',
            port: Number(process.env.DATABASE_PORT),
            username: 'root',
            password: null,
            database: 'test',
            synchronize: true,
            dropSchema: false,
            logging: true,
            entities: [
                User,
                Dictionary,
                Address,
                Customer,
                DictionaryDetail,
                EmailLog,
                Bank,
                Branch
            ]
        };
    }

}