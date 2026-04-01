export type IpLocation = {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
};

const PRIVATE_IP_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|::ffff:(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)|fe80:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:|localhost)/i;

export async function getIpLocation(ip: string): Promise<IpLocation | null> {
  if (!ip || ip === 'unknown' || PRIVATE_IP_RE.test(ip)) return null;

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return {
      country: data.country ?? '',
      countryCode: data.countryCode ?? '',
      region: data.regionName ?? '',
      city: data.city ?? '',
      isp: data.isp ?? ''
    };
  } catch {
    return null;
  }
}
