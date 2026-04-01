import Compressor from 'compressorjs';

export async function apiFetch(url: string, options?: RequestInit) {
  let res = await fetch(url, options);
  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
    if (refreshRes.ok) {
      res = await fetch(url, options);
    }
  }
  return res;
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        // Compressor returns a Blob; convert back to File to preserve the name
        const compressed = new File([result], file.name, { type: result.type });
        resolve(compressed);
      },
      error: reject
    });
  });
}

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

export async function uploadFile(folder: 'photos' | 'projects', file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await apiFetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (res.ok) return data.url as string;
  throw new Error(data.error ?? 'Upload failed');
}
