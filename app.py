from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']
    
    msg = Message('New Portfolio Message',
                  sender=email,
                  recipients=['jawadahmad.swe@gmail.com'])
    msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
    
    try:
        mail.send(msg)
        return jsonify({"status": "success"})
    except Exception as e:
        print(e)
        return jsonify({"status": "error"})

if __name__ == '__main__':
    app.run(debug=True)