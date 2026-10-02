import os
import smtplib
from email.message import EmailMessage


SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
MAIL_FROM = os.getenv("MAIL_FROM", SMTP_USERNAME)
SMTP_FROM_NAME = os.getenv(
    "SMTP_FROM_NAME",
    "Catalogue de recettes",
)


def send_login_code_email(
    recipient_email: str,
    code: str,
) -> None:
    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST est obligatoire")

    if not SMTP_USERNAME:
        raise RuntimeError("SMTP_USERNAME est obligatoire")

    if not SMTP_PASSWORD:
        raise RuntimeError("SMTP_PASSWORD est obligatoire")

    message = EmailMessage()
    message["From"] = (
        f"{SMTP_FROM_NAME} <{MAIL_FROM}>"
    )
    message["To"] = recipient_email
    message["Subject"] = "Votre code de connexion"

    message.set_content(
        f"""Bonjour,

Voici votre code de connexion :

{code}

Ce code est valable pendant 5 minutes et ne peut être utilisé qu'une seule fois.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.

L'équipe Catalogue de recettes
"""
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(message)