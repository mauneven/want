import { IResolvers } from "@graphql-tools/utils";
import Post, { IPost } from "../../models/postModel";
import User from "../../models/userModel";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import geolib from "geolib";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).array("photos[]", 4);

exports.uploadPhotoMiddleware = upload;

const createPostResolver: IResolvers = {
  Mutation: {
    createPost: async (_, { input, files }, { req }): Promise<IPost> => {
      try {
        const { title, description, latitude, longitude, mainCategory, price } =
          input;

        let compressedImagePaths = [];

        if (files && files.length > 0) {
          compressedImagePaths = await Promise.all(
            files.map(async (file: any) => {
              const { createReadStream, filename } = await file;
              const stream = createReadStream();
              const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
              const filePath = `uploads/${uniqueSuffix}-${filename}`;
              const out = fs.createWriteStream(filePath);
              stream.pipe(out);
              await new Promise((resolve) => out.on("finish", resolve));

              const compressedImagePath = `uploads/compressed-${uniqueSuffix}.webp`;
              await sharp(filePath)
                .resize({ width: 500 })
                .toFormat("webp")
                .toFile(compressedImagePath);
              await fs.promises.unlink(filePath);
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

export default createPostResolver;
