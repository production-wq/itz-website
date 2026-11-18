declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (key: string, options: { action: string }) => PromiseLike<string>;
    };
  }
}

export function contactCaptchaToken(siteKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('Verification timed out. Please try again.')), 12_000);
    const captcha = window.grecaptcha;
    if (!captcha) {
      window.clearTimeout(timeout);
      reject(new Error('Verification could not load. Please reload the page.'));
      return;
    }
    captcha.ready(() => {
      // Google's thenable does not implement native Promise.finally().
      Promise.resolve().then(() => captcha.execute(siteKey, { action: 'contact_submit' }))
        .then(resolve, () => reject(new Error('Verification failed. Please try again.')))
        .finally(() => window.clearTimeout(timeout));
    });
  });
}
