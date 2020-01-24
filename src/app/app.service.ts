import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Http2ServerResponse } from 'http2'
import { GridFSBucket, ObjectId } from 'mongodb'
import { Connection, Model, mongo } from 'mongoose'
import { File } from './models/file.entity'
import { Stream } from 'stream'

type Request = FastifyRequest
type Response = FastifyReply<Http2ServerResponse>

@Injectable()
export class AppService {
  private readonly bucket: GridFSBucket

  constructor(
    @InjectModel('fs.files') private readonly fileModel: Model<File>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.bucket = new mongo.GridFSBucket(this.connection.db)
  }

  async upload(request: Request): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      try {
        request.multipart(
          (field, file: Stream, filename, encoding, mimetype) => {
            const uploadStream = this.bucket.openUploadStream(filename, {
              contentType: mimetype,
            })

            file.on('end', () => {
              resolve({
                id: uploadStream.id.toString(),
              })
            })

            file.pipe(uploadStream)
          },
          err => {
            console.error(err)
            reject(new ServiceUnavailableException())
          },
        )
      } catch (e) {
        console.error(e)
        reject(new ServiceUnavailableException())
      }
    })
  }

  async download(id: string, request: Request, response: Response) {
    try {
      const oId = new ObjectId(id)
      const fileInfo = await this.fileModel.findOne({ _id: oId })

      if (!fileInfo) {
        throw new NotFoundException(null, 'VideoNotFound')
      }

      if (request.headers.range) {
        const range = request.headers.range.substr(6).split('-')
        const start = parseInt(range[0], 10)
        const end = parseInt(range[1], 10) || null
        const readstream = this.bucket.openDownloadStream(oId, {
          start,
          end,
        })

        response.status(206)
        response.headers({
          'Accept-Ranges': 'bytes',
          'Content-Type': fileInfo.contentType,
          'Content-Range': `bytes ${start}-${end ? end : fileInfo.length - 1}/${
            fileInfo.length
          }`,
          'Content-Length': (end ? end : fileInfo.length) - start,
        })

        response.send(readstream)
      } else {
        const readstream = this.bucket.openDownloadStream(oId)

        response.status(200)
        response.headers({
          'Accept-Range': 'bytes',
          'Content-Type': fileInfo.contentType,
          'Content-Length': fileInfo.length,
        })

        response.send(readstream)
      }
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }

  getList() {
    return this.fileModel.find().exec()
  }
}
