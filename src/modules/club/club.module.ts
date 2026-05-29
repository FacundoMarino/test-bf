import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [MailModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
