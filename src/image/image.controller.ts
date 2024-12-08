import { Body, Controller, Delete, Get, HttpCode, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

  @UseGuards(AuthGuard('jwt'))
  @Get('index/:image_id')
  @HttpCode(200)
  async indexImage(@Request() req, @Param('image_id') image_id: string) {
    const userId = req.user.userId
    return this.imageService.indexImage(userId, image_id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/single/:image_id')
  @HttpCode(200)
  async deleteImage(@Request() req, @Param('image_id') image_id: string) {
    const userId = req.user.userId;
    return this.imageService.deleteImage(userId, image_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/multiple')
  @HttpCode(200)
  async deleteMultipleImages(@Request() req, @Body('image_Ids') image_Ids: string[]) {
    const userId = req.user.userId;
    return this.imageService.deleteMultipleImages(userId, image_Ids);
  }
}