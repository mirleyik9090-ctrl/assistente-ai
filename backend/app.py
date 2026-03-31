from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this in a real application
jwt = JWTManager(app)

# Simulating a database of users
USERS = {'admin': 'password'}  # Replace with your user data management system

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if username in USERS and USERS[username] == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify({'msg': 'Bad credentials'}), 401

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    current_user = get_jwt_identity()
    message = request.json.get('message')
    # Process the message (this part should be your chat logic)
    return jsonify({'message': f'{current_user} says: {message}'}), 200

@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def chat_history():
    # Return chat history (implement your own logic)
    return jsonify({'history': []}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
