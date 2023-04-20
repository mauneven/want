// pages/api/compressImage.js
import sharp from 'sharp';
import { NextApiRequest, NextApiResponse } from 'next';

const compressImage = async (inputBuffer) => {
  try {
    const compressedBuffer = await sharp(inputBuffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    return compressedBuffer;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
  }
};

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const imageBuffer = Buffer.from(req.body, 'base64');
      const compressedBuffer = await compressImage(imageBuffer);
      const compressedBase64 = compressedBuffer.toString('base64');
      res.status(200).json({ compressedBase64 });
    } catch (error) {
      res.status(500).json({ error: 'Error al comprimir la imagen' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};