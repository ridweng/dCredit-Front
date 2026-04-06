import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';

@ApiExcludeController()
@Controller()
export class PublicVerificationController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify-email')
  async verifyEmailPage(
    @Query('token') token: string | undefined,
    @Res() response: Response,
  ) {
    if (!token) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .type('html')
        .send(
          renderVerificationPage({
            title: 'Verification failed',
            message: 'No verification token was provided.',
            tone: 'error',
          }),
        );
    }

    try {
      await this.authService.verifyEmailToken(token);

      return response.type('html').send(
        renderVerificationPage({
          title: 'Email verified',
          message:
            'Thanks, your email has been verified successfully. This window will try to close automatically in 10 seconds.',
          tone: 'success',
        }),
      );
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .type('html')
        .send(
          renderVerificationPage({
            title: 'Verification failed',
            message:
              error instanceof Error
                ? error.message
                : 'The verification link is invalid or has expired.',
            tone: 'error',
          }),
        );
    }
  }
}

function renderVerificationPage(input: {
  title: string;
  message: string;
  tone: 'success' | 'error';
}): string {
  const accent = input.tone === 'success' ? '#16847c' : '#c64242';
  const title = escapeHtml(input.title);
  const message = escapeHtml(input.message);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f4f7f7;
        color: #163138;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .card {
        width: min(520px, calc(100vw - 32px));
        background: white;
        border: 1px solid #d7e2e1;
        border-radius: 24px;
        padding: 28px;
        box-shadow: 0 18px 36px rgba(22, 49, 56, 0.08);
      }
      .badge {
        width: 56px;
        height: 56px;
        border-radius: 28px;
        display: grid;
        place-items: center;
        background: ${accent};
        color: white;
        font-size: 28px;
        font-weight: 700;
      }
      h1 {
        margin: 16px 0 10px;
        font-size: 28px;
      }
      p {
        margin: 0 0 12px;
        line-height: 1.6;
        color: #63737c;
      }
      .countdown {
        margin-top: 16px;
        color: #163138;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="badge">${input.tone === 'success' ? '✓' : '!'}</div>
      <h1>${title}</h1>
      <p>${message}</p>
      <p class="countdown">Closing in <span id="seconds">10</span> seconds…</p>
      <p>If this tab does not close automatically, you can close it manually.</p>
    </main>
    <script>
      let seconds = 10;
      const node = document.getElementById('seconds');
      const timer = window.setInterval(() => {
        seconds -= 1;
        if (node) node.textContent = String(seconds);
        if (seconds <= 0) {
          window.clearInterval(timer);
          window.close();
        }
      }, 1000);
    </script>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
