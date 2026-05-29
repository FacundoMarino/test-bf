"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_blob_1 = require("@azure/storage-blob");
const ALLOWED_IMAGE_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
]);
const MIME_EXTENSION_MAP = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
};
let UploadsService = class UploadsService {
    configService;
    containerClient;
    constructor(configService) {
        this.configService = configService;
        const connectionString = this.configService.get('AZURE_STORAGE_CONNECTION_STRING');
        const containerName = this.configService.get('AZURE_CONTAINER_NAME');
        if (!connectionString || !containerName) {
            throw new Error('Missing Azure storage configuration. Set AZURE_STORAGE_CONNECTION_STRING and AZURE_CONTAINER_NAME.');
        }
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = blobServiceClient.getContainerClient(containerName);
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Archivo requerido');
        }
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException('Formato no soportado. Usa PNG, JPG o WEBP.');
        }
        if (!file.buffer || file.size === 0) {
            throw new common_1.BadRequestException('Archivo vacío');
        }
        const safeExt = this.resolveExtension(file);
        const blobName = `images/${Date.now()}-${(0, node_crypto_1.randomUUID)()}${safeExt}`;
        const blobClient = this.containerClient.getBlockBlobClient(blobName);
        try {
            await blobClient.uploadData(file.buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
            });
            return { url: blobClient.url, blobName };
        }
        catch {
            throw new common_1.InternalServerErrorException('No se pudo subir la imagen a almacenamiento');
        }
    }
    resolveExtension(file) {
        const mapped = MIME_EXTENSION_MAP[file.mimetype];
        if (mapped)
            return mapped;
        const fileExt = (0, node_path_1.extname)(file.originalname || '').toLowerCase();
        if (fileExt)
            return fileExt;
        return '.jpg';
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map