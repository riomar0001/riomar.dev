import { NextRequest } from 'next/server';
import { redirectTo } from '@/lib/api-helpers';

/**
 * Shareable tracking link for resumes, LinkedIn, job applications, etc.
 *
 *   riomar.dev/clicked?from=linkedin
 *   riomar.dev/clicked?from=application&application-from=jobstreet
 *
 * Redirects to the homepage with the tracking params intact so the
 * visitor beacon records them (and then cleans them from the URL).
 */
export function GET(request: NextRequest) {
  const params = new URLSearchParams();
  const from = request.nextUrl.searchParams.get('from');
  const applicationFrom = request.nextUrl.searchParams.get('application-from');
  if (from) params.set('from', from);
  if (applicationFrom) params.set('application-from', applicationFrom);

  const query = params.toString();
  return redirectTo(query ? `/?${query}` : '/');
}
