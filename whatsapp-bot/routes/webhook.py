from flask import Blueprint, request, jsonify, current_app
import requests

webhook_bp = Blueprint('webhook', __name__)

@webhook_bp.route("/", methods=["POST"])
def receive_message():
    from_number = request.form.get("From")
    message_body = request.form.get("Body")

    if not from_number or not message_body:
        return jsonify({"error": "Invalid message format"}), 400

    payload = {
        "from": from_number,
        "body": message_body
    }

    try:
        res = requests.post(current_app.config["FORWARD_URL"], json=payload)
        return jsonify({"forwarded_status": res.status_code}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
