import type { Request } from "express";
import multer from "multer";
import { join } from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

interface UploaderOptions {
  limits?: multer.Options["limits"];
  fileFilter?: multer.Options["fileFilter"];
}

export const uploader = (filePrefix: string, folderName: string, options?: UploaderOptions) => {
  const defaultDir = join(__dirname, "../public");

  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
      const destination = folderName ? join(defaultDir, folderName) : defaultDir;
      cb(null, destination);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
      const originalNameParts = file.originalname.split(".");
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + "." + fileExtension;

      cb(null, newFileName);
    },
  });

  return multer({
    storage: storage,
    limits: options?.limits,
    fileFilter: options?.fileFilter,
  });
};
