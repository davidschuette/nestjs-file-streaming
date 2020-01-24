import { Schema, SchemaTypes, Document } from 'mongoose'

export const FileModel = new Schema({
  _id: SchemaTypes.ObjectId,
  length: SchemaTypes.Number,
  chunkSize: SchemaTypes.Number,
  uploadDate: SchemaTypes.Date,
  filename: SchemaTypes.String,
  md5: SchemaTypes.String,
  contentType: SchemaTypes.String,
})

export interface File extends Document {
  _id: string
  length: number
  chunkSize: number
  uploadDate: string
  filename: string
  md5: string
  contentType: string
}
