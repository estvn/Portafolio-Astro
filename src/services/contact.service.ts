const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const ACCESS_KEY = '37a0cd95-fa98-44c4-8fe8-cc1fa40ae700';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResult {
  success: boolean;
  message: string;
}

// User-facing messages, picked by the current page language (<html lang>)
const MESSAGES = {
  es: {
    httpError: 'Error al enviar el mensaje. Intenta nuevamente.',
    ok: 'Mensaje enviado correctamente.',
    fail: 'Error al enviar.',
  },
  en: {
    httpError: 'Could not send the message. Please try again.',
    ok: 'Message sent successfully.',
    fail: 'Could not send.',
  },
} as const;

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  const t = MESSAGES[document.documentElement.lang === 'en' ? 'en' : 'es'];
  const response = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      ...payload,
    }),
  });

  if (!response.ok) {
    return { success: false, message: t.httpError };
  }

  const data = await response.json();
  // the API's own message is English-only, so only our localized strings are shown
  return {
    success: data.success,
    message: data.success ? t.ok : t.fail,
  };
}
