import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import fastifyMulipart from 'fastify-multipart'
import { version } from '../package.json'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.enableShutdownHooks()

  app.register(fastifyMulipart)

  const options = new DocumentBuilder()
    .setTitle('NestJS Fastify Streaming Server')
    .setDescription('Stream files to and from a MongoDB.')
    .setVersion(version)
    .addTag('File')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(3101, '0.0.0.0', () => {
    console.log('Server listening at http://0.0.0.0:' + 3101 + '/api/')
  })
}
bootstrap()
