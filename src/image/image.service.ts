import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { env } from 'process';
import { s3 } from 'src/providers/b2.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.mimetype.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Each image cannot exceed 15 MB.');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only images are allowed.');
    }

    const bucketName = env.BUCKET_NAME;
    const fileName = file.originalname;
    const uploadParams = {
      Bucket: bucketName,
      Key: `images/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${bucketName}.s3.${env.REGION}.backblazeb2.com/images/${encodeURIComponent(fileName)}`;

    const savedImage = await this.prisma.image.create({
      data: {
        url: fileUrl,
        path: fileName,
      },
    });

    return savedImage;
  }
}
