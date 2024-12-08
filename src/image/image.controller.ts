import { Body, Controller, Delete, Get, HttpCode, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('upload')
  @ApiOperation({ summary: 'Upload an image for the user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.userId;
    const savedImage = await this.imageService.uploadImage(file, userId);
    return savedImage;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({ summary: 'List all images of the authenticated user' })
  @HttpCode(200)
  async listImages(@Request() req) {
    const userId = req.user.userId
    return this.imageService.listImages(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('index/:image_id')
  @ApiOperation({ summary: 'Get a single image by ID' })
  @HttpCode(200)
  async indexImage(@Request() req, @Param('image_id') image_id: string) {
    const userId = req.user.userId
    return this.imageService.indexImage(userId, image_id)
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('delete/single/:image_id')
  @ApiOperation({ summary: 'Delete a single image by ID' })
  @HttpCode(200)
  async deleteImage(@Request() req, @Param('image_id') image_id: string) {
    const userId = req.user.userId;
    return this.imageService.deleteImage(userId, image_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('delete/multiple')
  @ApiBody({
    description: 'Array of image UUIDs to delete',
    type: [String], 
    required: true,
    schema: {
      type: 'object',
      properties: {
        image_Ids: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid', 
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Delete multiple images' })
  @HttpCode(200)
  async deleteMultipleImages(@Request() req, @Body('image_Ids') image_Ids: string[]) {
    const userId = req.user.userId;
    return this.imageService.deleteMultipleImages(userId, image_Ids);
  }
}