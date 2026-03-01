import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveUploadedFile(
  file: File,
  subDir: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(file.name);
  const safeName = `${timestamp}-${randomSuffix}${ext}`;

  const filePath = path.join(uploadDir, safeName);
  await writeFile(filePath, buffer);

  return `/uploads/${subDir}/${safeName}`;
}
