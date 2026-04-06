interface VerificationEmailTemplateInput {
  fullName: string;
  verificationUrl: string;
}

export function buildVerificationEmailTemplate(input: VerificationEmailTemplateInput) {
  const greetingName = input.fullName.trim() || 'there';

  return {
    subject: 'Verify your dCredit account',
    text: [
      `Hi ${greetingName},`,
      '',
      'Thanks for creating your dCredit account.',
      'Verify your email by opening the link below:',
      input.verificationUrl,
      '',
      'This link expires in 24 hours.',
      '',
      'If you did not create this account, you can ignore this email.',
    ].join('\n'),
    html: `
      <p>Hi ${escapeHtml(greetingName)},</p>
      <p>Thanks for creating your dCredit account.</p>
      <p>
        Verify your email by opening this link:
        <a href="${escapeHtml(input.verificationUrl)}">${escapeHtml(input.verificationUrl)}</a>
      </p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create this account, you can ignore this email.</p>
    `,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
