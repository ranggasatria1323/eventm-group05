import { Request } from "express";
import multer from "multer";
import { join } from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, folderName: string) => {
  // Tentukan direktori default
  const defaultDir = join(__dirname, "./public");

  // Konfigurasi penyimpanan menggunakan multer.diskStorage
  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      // Jika folderName diberikan, gunakan folderName; jika tidak gunakan defaultDir
      const destination = folderName ? join(defaultDir, folderName) : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      // Pecahkan nama file asli untuk mendapatkan ekstensi
      const originalNameParts = file.originalname.split(".");
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      // Buat nama file baru dengan prefix, timestamp, dan ekstensi
      const newFileName = `${filePrefix}${Date.now()}.${fileExtension}`;

      cb(null, newFileName);
    },
  });

  // Kembalikan multer instance dengan konfigurasi storage
  return multer({ storage: storage });
};
