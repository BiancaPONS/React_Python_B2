import smtplib
from email.message import EmailMessage


from core.config import (
    MAIL_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USERNAME,
)


def send_login_code_email(
    recipient: str,
    code: str,
) -> None:
    message = EmailMessage()
    message["Subject"] = "Votre code de connexion - Ma Collection"
    message["From"] = MAIL_FROM
    message["To"] = recipient

    message.set_content(
        f"""Bonjour,

Voici votre code de connexion à Ma Collection :

{code}

Ce code est valable pendant 5 minutes.
Ne le communiquez à personne.

Si vous n'êtes pas à l'origine de cette tentative de connexion,
vous pouvez ignorer cet e-mail.

L'équipe Ma Collection
""",
    )

    with smtplib.SMTP_SSL(
        SMTP_HOST,
        SMTP_PORT,
    ) as smtp:
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(message)