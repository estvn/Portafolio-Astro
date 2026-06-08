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

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
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
    return { success: false, message: 'Error al enviar el mensaje. Intenta nuevamente.' };
  }

  const data = await response.json();
  return {
    success: data.success,
    message: data.message ?? (data.success ? 'Mensaje enviado correctamente.' : 'Error al enviar.'),
  };
}
