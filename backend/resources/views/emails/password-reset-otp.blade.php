<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reset Password - ITS</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
    <!-- Wrapper Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px 12px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                            Reset Password
                                        </h1>
                                        <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                                            ITS (Integrated Task System)
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 24px; color: #1d2939; font-size: 16px; line-height: 1.6;">
                                Halo <strong style="color: #f97316;">{{ $userName }}</strong>,
                            </p>

                            <p style="margin: 0 0 32px; color: #475467; font-size: 15px; line-height: 1.6;">
                                Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode OTP berikut untuk melanjutkan proses reset password:
                            </p>

                            <!-- OTP Code Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding: 0 0 32px;">
                                        <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #f97316; border-radius: 16px; padding: 32px 24px; text-align: center; box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);">
                                            <p style="margin: 0 0 12px; color: #475467; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                                Kode OTP Anda
                                            </p>
                                            <div style="display: inline-block; background-color: #ffffff; border-radius: 12px; padding: 20px 32px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                                <h2 style="margin: 0; color: #f97316; font-size: 42px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', monospace; line-height: 1;">
                                                    {{ $otp }}
                                                </h2>
                                            </div>
                                            <p style="margin: 16px 0 0; color: #667085; font-size: 13px;">
                                                Berlaku selama <strong style="color: #f97316;">10 menit</strong>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Important Notes -->
                            <div style="background-color: #fef3f2; border-left: 4px solid #f04438; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                                <p style="margin: 0 0 12px; color: #b42318; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; flex-shrink: 0;">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#b42318"/>
                                    </svg>
                                    Catatan Penting
                                </p>
                                <ul style="margin: 0; padding-left: 24px; color: #7a271a; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 8px;">Kode OTP ini berlaku selama <strong>10 menit</strong></li>
                                    <li style="margin-bottom: 8px;">Jangan bagikan kode ini kepada siapapun, termasuk tim support</li>
                                    <li style="margin-bottom: 0;">Jika Anda tidak meminta reset password, abaikan email ini dan pastikan akun Anda aman</li>
                                </ul>
                            </div>

                            <!-- Security Info -->
                            <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 32px; border: 1px solid #b9e6fe;">
                                <p style="margin: 0; color: #026aa2; font-size: 13px; line-height: 1.6; display: flex; align-items: flex-start;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; margin-top: 2px; flex-shrink: 0;">
                                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#026aa2"/>
                                    </svg>
                                    <span>Email ini dikirim secara otomatis dari sistem. Mohon jangan membalas email ini. Jika Anda memiliki pertanyaan, hubungi tim support melalui aplikasi.</span>
                                </p>
                            </div>

                            <!-- Divider -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 0 0 32px;">
                                        <div style="height: 1px; background-color: #e4e7ec; width: 100%;"></div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer Text -->
                            <p style="margin: 0; color: #98a2b3; font-size: 13px; text-align: center; line-height: 1.6;">
                                © {{ date('Y') }} <strong style="color: #475467;">ITS (Integrated Task System)</strong>. All rights reserved.<br>
                                <span style="font-size: 12px;">Smart and Structured Task Management Platform</span>
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Bottom Spacing -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="padding: 24px 20px 0; text-align: center;">
                            <p style="margin: 0; color: #98a2b3; font-size: 12px; line-height: 1.5;">
                                Email ini dikirim ke alamat email terdaftar Anda.<br>
                                Jika Anda tidak meminta reset password, abaikan email ini.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
