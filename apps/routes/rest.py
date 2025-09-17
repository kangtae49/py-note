from flask import Blueprint, render_template, jsonify
rest_bp = Blueprint('rest', __name__)


@rest_bp.route("/")
def index():
    return render_template("index.html")

@rest_bp.route("/health")
def health():
    return jsonify(status="ok"), 200

@rest_bp.route("/hello")
def hello():
    return "Hello"