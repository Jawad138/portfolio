import os
import re

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_mail import Mail, Message

load_dotenv()

app = Flask(__name__)

# Gmail SMTP (set EMAIL_USER / EMAIL_PASS as environment variables on Vercel;
# EMAIL_PASS must be a Google App Password, not your normal password)
app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),
)
mail = Mail(app)

RECIPIENT = "jawadahmad.swe@gmail.com"
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/send_message", methods=["POST"])
def send_message():
    # Honeypot field: real users never fill this in, bots usually do
    if request.form.get("website"):
        return jsonify({"status": "success"})

    name = request.form.get("name", "").strip()[:100]
    email = request.form.get("email", "").strip()[:150]
    message = request.form.get("message", "").strip()[:3000]

    if not name or not message or not EMAIL_RE.match(email):
        return jsonify({"status": "error", "message": "Please fill in all fields with a valid email."}), 400

    if not app.config["MAIL_USERNAME"] or not app.config["MAIL_PASSWORD"]:
        app.logger.error("EMAIL_USER / EMAIL_PASS are not configured")
        return jsonify({"status": "error", "message": "Contact form is not configured. Please email me directly."}), 500

    # Send from our own authenticated account (Gmail rejects spoofed senders)
    # and use reply_to so replying goes to the visitor.
    msg = Message(
        subject=f"Portfolio message from {name}",
        sender=app.config["MAIL_USERNAME"],
        recipients=[RECIPIENT],
        reply_to=email,
    )
    msg.body = f"Name: {name}\nEmail: {email}\n\n{message}"

    try:
        mail.send(msg)
        return jsonify({"status": "success"})
    except Exception:
        app.logger.exception("Failed to send contact email")
        return jsonify({"status": "error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
