import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export type SendMailArgs = {
    to: string;
    subject: string;
    text: string;
    html: string;
    eventType: string;
};
export declare class MailService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService);
    sendTransactional(params: SendMailArgs): Promise<void>;
}
