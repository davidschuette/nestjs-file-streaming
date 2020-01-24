import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FileModel } from './models/file.entity'

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${
        process.env.NODE_ENV === 'docker' ? 'streaming-api-db' : 'localhost'
      }:27017/streaming`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    ),
    MongooseModule.forFeature([{ name: 'fs.files', schema: FileModel }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
