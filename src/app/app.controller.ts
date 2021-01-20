import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common'
import { AppService } from './app.service'

import { FastifyRequest, FastifyReply } from 'fastify'
import { Http2ServerResponse } from 'http2'
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { File } from './models/file.entity'

type Request = FastifyRequest
type Response = FastifyReply

@ApiTags('File')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Upload a file.',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    schema: {
      properties: {
        id: {
          type: 'string',
          example: '5e2b4cb75876c93e38b6e6aa',
        },
      },
    },
  })
  @Post()
  uploadFile(@Req() request: Request): Promise<{ id: string }> {
    return this.appService.upload(request)
  }

  @ApiOperation({
    summary: 'Get a list of all uploaded files.',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5e2b447e4aadb800bccfb339' },
          length: { type: 'number', example: 730416 },
          chunkSize: { type: 'number', example: 261120 },
          uploadDate: { type: 'Date', example: '2020-01-24T19:24:46.366Z' },
          filename: { type: 'string', example: 'IMG_0359.jpeg' },
          md5: { type: 'string', example: 'ba230f0322784443c84ffbc5b6160c30' },
          contentType: { type: 'string', example: 'image/jpeg' },
        },
      },
    },
  })
  @Get()
  getAllFiles(): Promise<File[]> {
    return this.appService.getList()
  }

  @ApiOperation({ summary: 'Download a file.' })
  @Get(':id')
  downloadFile(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.appService.download(id, request, response)
  }
}
