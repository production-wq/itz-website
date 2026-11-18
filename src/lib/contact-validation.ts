export const contactLimits = {
  name: 120, business: 200, email: 254, phone: 40,
  industry: 120, service: 120, message: 5000, pagePath: 500,
} as const;

export function validateContact(body: Record<string, unknown>): string | null {
  for (const [key, limit] of Object.entries(contactLimits)) {
    const value = body[key];
    if (value !== undefined && (typeof value !== 'string' || value.length > limit)) {
      return `Please check the ${key} field.`;
    }
  }
  for (const key of ['name', 'business', 'email']) {
    if (!(body[key] as string | undefined)?.trim()) return `Please provide your ${key}.`;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((body.email as string).trim())) {
    return 'Please provide a valid email address.';
  }
  // Names are plain text, not links or markup. Keep punctuation and all languages.
  for (const key of ['name', 'business']) {
    if (/[<>\r\n]|https?:\/\/|www\./i.test(body[key] as string)) return `Please check the ${key} field.`;
  }
  if (typeof body.pagePath === 'string' && body.pagePath && (!body.pagePath.startsWith('/') || body.pagePath.startsWith('//'))) {
    return 'Please reload the page and try again.';
  }
  return null;
}

type RecaptchaAssessment = {
  success?: boolean; score?: number; action?: string; hostname?: string; challenge_ts?: string;
};

export function passesRecaptcha(data: RecaptchaAssessment, now = Date.now()): boolean {
  const age = now - Date.parse(data.challenge_ts || '');
  return data.success === true && typeof data.score === 'number' && data.score >= 0.5 &&
    data.action === 'contact_submit' &&
    ['itzdigital.co', 'www.itzdigital.co'].includes(data.hostname || '') &&
    Number.isFinite(age) && age >= -30_000 && age <= 120_000;
}
