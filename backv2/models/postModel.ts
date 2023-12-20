import mongoose from 'mongoose';

interface IPost extends Document {
  title: string;
  description: string;
  createdAt: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
  mainCategory: string;
  price: number;
  photos: string[];
  reports: mongoose.Schema.Types.ObjectId[];
}

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  mainCategory: { type: String, required: true },
  price: { type: Number, required: true },
  photos: [{ type: String, required: true }],  
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }]
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
export type { IPost };
