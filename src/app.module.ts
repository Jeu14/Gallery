import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ImageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}