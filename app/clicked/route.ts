import { NextRequest, NextResponse } from 'next/server';

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
  const dest = new URL('/', request.nextUrl);
  const from = request.nextUrl.searchParams.get('from');
  const applicationFrom = request.nextUrl.searchParams.get('application-from');
  if (from) dest.searchParams.set('from', from);
  if (applicationFrom) dest.searchParams.set('application-from', applicationFrom);
  return NextResponse.redirect(dest);
}
