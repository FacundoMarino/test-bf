import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';

type UploadImageResult = {
  url: string;
  blobName: string;
};

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
};

@Injectable()
export class UploadsService {
  private readonly containerClient;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName = this.configService.get<string>(
      'AZURE_CONTAINER_NAME',
    );

    if (!connectionString || !containerName) {
      throw new Error(
        'Missing Azure storage configuration. Set AZURE_STORAGE_CONNECTION_STRING and AZURE_CONTAINER_NAME.',
      );
    }

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadImageResult> {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Formato no soportado. Usa PNG, JPG o WEBP.',
      );
    }
    if (!file.buffer || file.size === 0) {
      throw new BadRequestException('Archivo vacío');
    }

    const safeExt = this.resolveExtension(file);
    const blobName = `images/${Date.now()}-${randomUUID()}${safeExt}`;
    const blobClient = this.containerClient.getBlockBlobClient(blobName);

    try {
      await blobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });
      return { url: blobClient.url, blobName };
    } catch {
      throw new InternalServerErrorException(
        'No se pudo subir la imagen a almacenamiento',
      );
    }
  }

  private resolveExtension(file: Express.Multer.File): string {
    const mapped = MIME_EXTENSION_MAP[file.mimetype];
    if (mapped) return mapped;
    const fileExt = extname(file.originalname || '').toLowerCase();
    if (fileExt) return fileExt;
    return '.jpg';
  }
}
