"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const enums_1 = require("../../generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
let MailService = MailService_1 = class MailService {
    config;
    prisma;
    logger = new common_1.Logger(MailService_1.name);
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
    }
    async sendTransactional(params) {
        const fromRaw = this.config.get('MAIL_FROM')?.trim() ??
            this.config.get('SMTP_USER')?.trim() ??
            '';
        const enabled = this.config.get('MAIL_ENABLED') !== 'false' &&
            this.config.get('DISABLE_MAIL') !== 'true';
        if (!fromRaw || !enabled) {
            await this.prisma.emailSendLog.create({
                data: {
                    status: enums_1.EmailSendStatus.SKIPPED,
                    eventType: params.eventType,
                    fromEmail: fromRaw || '(sin MAIL_FROM)',
                    toEmail: params.to,
                    subject: params.subject,
                    bodyText: params.text,
                    bodyHtml: params.html,
                    errorDetail: !enabled
                        ? 'MAIL deshabilitado (MAIL_ENABLED=false o DISABLE_MAIL=true)'
                        : 'Falta MAIL_FROM / SMTP_USER',
                },
            });
            return;
        }
        const host = this.config.get('SMTP_HOST') ?? 'smtp.gmail.com';
        const port = Number(this.config.get('SMTP_PORT') ?? '465');
        const secure = this.config.get('SMTP_SECURE') !== 'false' && port === 465;
        const user = this.config.get('SMTP_USER')?.trim();
        const pass = this.config.get('SMTP_PASS') ?? '';
        if (!user || !pass) {
            await this.prisma.emailSendLog.create({
                data: {
                    status: enums_1.EmailSendStatus.SKIPPED,
                    eventType: params.eventType,
                    fromEmail: fromRaw,
                    toEmail: params.to,
                    subject: params.subject,
                    bodyText: params.text,
                    bodyHtml: params.html,
                    errorDetail: 'Faltan SMTP_USER / SMTP_PASS',
                },
            });
            return;
        }
        try {
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            });
            await transporter.sendMail({
                from: fromRaw,
                to: params.to,
                subject: params.subject,
                text: params.text,
                html: params.html,
            });
            await this.prisma.emailSendLog.create({
                data: {
                    status: enums_1.EmailSendStatus.SENT,
                    eventType: params.eventType,
                    fromEmail: fromRaw,
                    toEmail: params.to,
                    subject: params.subject,
                    bodyText: params.text,
                    bodyHtml: params.html,
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Mail send failed (${params.eventType}): ${message}`);
            await this.prisma.emailSendLog.create({
                data: {
                    status: enums_1.EmailSendStatus.FAILED,
                    eventType: params.eventType,
                    fromEmail: fromRaw,
                    toEmail: params.to,
                    subject: params.subject,
                    bodyText: params.text,
                    bodyHtml: params.html,
                    errorDetail: message.slice(0, 4000),
                },
            });
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map