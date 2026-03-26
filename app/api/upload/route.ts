import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { uploadFile } from '@/lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return error('Invalid form data');
  }

  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) ?? 'photos';

  if (!file) return error('No file provided');
  if (!ALLOWED_TYPES.includes(file.type)) return error('File type not allowed');
  if (file.size > MAX_SIZE) return error('File too large (max 5MB)');

  const validFolders = ['photos', 'resumes', 'projects'] as const;
  if (!validFolders.includes(folder as (typeof validFolders)[number])) {
    return error('Invalid folder');
  }

  const { url, path } = await uploadFile(file, folder as 'photos' | 'resumes' | 'projects');

  return json({ url, path }, 201);
}
