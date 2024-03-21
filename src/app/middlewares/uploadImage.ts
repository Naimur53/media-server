import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';
// cloudinary config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadMulter = multer({
  dest: './uploads/',
  storage,
});
const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image file not found!');
    }

    const file = req.file;
    console.log(file);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      file.filename
    }`;
    console.log(imageUrl);
    req.body.uploadedImageUrl = imageUrl;
    next();
  } catch (e) {
    next(e);
  }
};

// async function uploadToCloudinary(file: UploadedFile, publicId: string) {
//   return new Promise<UploadApiResponse>((resolve, reject) => {
//     cloudinary.uploader
//       .upload(file.tempFilePath, {
//         resource_type: 'auto', // Automatically determine the resource type
//         public_id: publicId,
//       })
//       .then(result => {
//         resolve(result);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
// }

export default uploadImage;
