import { ConfigService } from '@nestjs/config';
type UploadImageResult = {
    url: string;
    blobName: string;
};
export declare class UploadsService {
    private readonly configService;
    private readonly containerClient;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<UploadImageResult>;
    private resolveExtension;
}
export {};
