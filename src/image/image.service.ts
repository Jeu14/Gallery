import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { env } from 'process';
import { s3 } from 'src/providers/b2.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File, user_id: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.mimetype.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Each image cannot exceed 15 MB.');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only images are allowed.');
    }

    const bucketName = env.BUCKET_NAME;
    const fileName = `${uuidv4()}-${file.originalname}`;
    const uploadParams = {
      Bucket: bucketName,
      Key: `images/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      throw new BadRequestException('Failed to upload image.');
    }

    const fileUrl = `https://${bucketName}.s3.${env.REGION}.backblazeb2.com/images/${encodeURIComponent(fileName)}`;

    try {
      const savedImage = await this.prisma.image.create({
        data: {
          url: fileUrl,
          path: fileName,
          user_id,
        },
      });
      return savedImage;
    } catch (error) {
      throw new BadRequestException('Failed to save image data.');
    }
  }
}
