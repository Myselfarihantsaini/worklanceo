export async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  html: string
) {
  if (!resendApiKey) {
    console.warn('Email skipped: RESEND_API_KEY is not set');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Worklanceo Notifications <notifications@worklanceo.com>',
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to send email:', error);
  }
}
