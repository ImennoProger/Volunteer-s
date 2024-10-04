import smtplib
import ssl
from email.message import EmailMessage

class SendEmailVerify:
    
    @staticmethod
    def sendVerify(token, receiver):
        email_address = "loskutnikova.all@gmail.com"
        email_app_password = "nuoj nnpt cuup sjls"  # Внешний пароль приложения mail.ru
        context = ssl.SSLContext(ssl.PROTOCOL_TLS)
        
        html_content = f"""
        <html>
        <body>
            <h2>Подтверждение аккаунта</h2>
            <p>Нажмите на кнопку ниже, чтобы подтвердить ваш аккаунт:</p>
            <a href="https://volunteers-portal.ru/verify-token/{token}" style="
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                color: white;
                background-color: #4CAF50;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
            ">Подтвердить аккаунт</a>
        </body>
        </html>
        """
        
        msg = EmailMessage()
        msg['Subject'] = "Подтверждение email"
        msg['From'] = email_address
        msg['To'] = receiver
        msg.set_content("Для подтверждения аккаунта нажмите на кнопку ниже.")
        msg.add_alternative(html_content, subtype='html')
        
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls(context=context)
        server.login(email_address, email_app_password)
        server.sendmail(email_address, receiver, msg.as_string())
        server.quit()
