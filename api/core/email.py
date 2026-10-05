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
    print("APPEL send_login_code_email")

    send_code_email(
        recipient_email=recipient_email,
        code=code,
        subject="Votre code de connexion",
        purpose="connexion",
    )


def send_password_reset_code_email(
    recipient_email: str,
    code: str,
) -> None:
    print("APPEL send_password_reset_code_email")

    send_code_email(
        recipient_email=recipient_email,
        code=code,
        subject="Réinitialisation de votre mot de passe",
        purpose="réinitialisation de votre mot de passe",
    )


def send_code_email(
    recipient_email: str,
    code: str,
    subject: str,
    purpose: str,
) -> None:
    print(
        "SMTP DEBUG:",
        {
            "host": SMTP_HOST,
            "port": SMTP_PORT,
            "username": SMTP_USERNAME,
            "password_defined": bool(SMTP_PASSWORD),
            "mail_from": MAIL_FROM,
            "recipient": recipient_email,
        },
    )

    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST est obligatoire")

    if not SMTP_USERNAME:
        raise RuntimeError("SMTP_USERNAME est obligatoire")

    if not SMTP_PASSWORD:
        raise RuntimeError("SMTP_PASSWORD est obligatoire")

    message = EmailMessage()
    message["From"] = f"{SMTP_FROM_NAME} <{MAIL_FROM}>"
    message["To"] = recipient_email
    message["Subject"] = subject

    message.set_content(
        f"""Bonjour,

Voici votre code de {purpose} :

{code}

Ce code est valable pendant 10 minutes et ne peut être utilisé qu'une seule fois.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.

L'équipe Catalogue de recettes
"""
    )

    print("CONNEXION SMTP EN COURS")

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT,
        timeout=20,
    ) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(
            SMTP_USERNAME,
            SMTP_PASSWORD,
        )
        smtp.send_message(message)

    print("EMAIL ENVOYE")