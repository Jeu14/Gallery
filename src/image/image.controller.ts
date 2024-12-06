import { Controller, Get, HttpCode, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.userId;
    const savedImage = await this.imageService.uploadImage(file, userId);
    return savedImage;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  @HttpCode(200)
  async listImages(@Request() req) {
    const userId = req.user.userId
    return this.imageService.listImages(userId)
  }
}
 