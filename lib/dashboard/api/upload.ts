import Compressor from 'compressorjs';
import { apiFetch } from './client';

export type UploadFolder = 'photos' | 'projects' | 'certificates' | 'achievements';

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.9,
      mimeType: 'image/webp',
      convertSize: 0,
      success(result) {
        const name = file.name.replace(/\.[^.]+$/, '.webp');
        resolve(new File([result], name, { type: 'image/webp' }));
      },
      error: reject
    });
  });
}

/**
 * Opens the OS file picker and hands back the (already compressed) file plus a
 * local object URL for preview. Nothing is uploaded here — the form's Save
 * handler calls uploadFile.
 */
export function handleFilePick(onFile: (file: File, previewUrl: string) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const compressed = file.type.startsWith('image/') ? await compressImage(file) : file;
    const previewUrl = URL.createObjectURL(compressed);
    onFile(compressed, previewUrl);
  };
  input.click();
}

export async function uploadFile(folder: UploadFolder, file: File): Promise<string> {
  // `file` is already compressed to WebP by handleFilePick — do NOT compress
  // again here, or the second lossy pass produces crunchy/blocky artifacts.
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await apiFetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (res.ok) return data.url as string;
  throw new Error(data.error ?? 'Upload failed');
}
