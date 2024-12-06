import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { env } from 'process';
import { s3 } from 'src/providers/b2.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
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
