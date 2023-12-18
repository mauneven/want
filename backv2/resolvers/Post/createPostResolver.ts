import { IResolvers } from '@graphql-tools/utils';
import Post, { IPost } from '../../models/postModel';
import User from '../../models/userModel';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import geolib from 'geolib';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).array('photos[]', 4);

exports.uploadPhotoMiddleware = upload;

const postResolver: IResolvers = {
  Mutation: {
    createPost: async (_, { input }, { req }): Promise<IPost> => {
      try {
        const { title, description, latitude, longitude, mainCategory, price } = input;

        const photos = req.files.map((file: Express.Multer.File) => ({
            type: file.mimetype,
            path: file.path,
            originalname: file.originalname,
        }));

        let compressedImagePaths = [];

        if (photos.length > 0) {
            compressedImagePaths = await Promise.all(
                photos.map(async (photo: Express.Multer.File) => {
                    const compressedImagePath = `uploads/${uuidv4()}.webp`;
                    const fileBuffer = await fs.readFile(photo.path);
                    await sharp(fileBuffer)
                        .resize({ width: 500 })
                        .toFormat('webp')
                        .toFile(compressedImagePath);
                    await fs.unlink(photo.path);
                    return compressedImagePath;
                })
            );
        }

        const newPosition = geolib.computeDestinationPoint(
          { latitude, longitude },
          1000,
          Math.random() * 360
        );
        const newLatitude = newPosition.latitude;
        const newLongitude = newPosition.longitude;

        const post = new Post({
          title,
          description,
          createdBy: req.session.userId,
          latitude: newLatitude,
          longitude: newLongitude,
          mainCategory,
          price,
          photos: compressedImagePaths,
        });

        await post.save();

        await User.findByIdAndUpdate(req.session.userId, {
          $inc: { totalPosts: 1 },
        });

        return post;
    } catch (err) {
        throw new Error((err as Error).message);
    }
    },
  },
};

export default postResolver;