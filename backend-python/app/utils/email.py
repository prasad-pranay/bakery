import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import Config

def send_email(to: str, subject: str, html: str):
    """
    Sends email via SMTP matching nodemailer config in backend/src/utils/email.ts.
    Catches errors gracefully so email failure does not abort user requests.
    """
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = Config.EMAIL_FROM or 'noreply@bakery.com'
        msg['To'] = to
        
        part = MIMEText(html, 'html')
        msg.attach(part)

        # Uses the same Gmail/SMTP settings as the original backend
        host = "smtp.gmail.com"
        port = 465
        user = "thehuntclub2026@gmail.com"
        password = "jhst bhhy guub hsat"

        with smtplib.SMTP_SSL(host, port, timeout=10) as server:
            server.login(user, password)
            server.sendmail(msg['From'], [to], msg.as_string())
    except Exception as e:
        print(f"Email sending failed: {e}")
