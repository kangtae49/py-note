from flask import Blueprint, render_template
rest_bp = Blueprint('rest', __name__)


@rest_bp.route("/")
def index():
    # return "<html><body>Hello, World!</body></html>"
    return render_template("index.html")

@rest_bp.route("/hello")
def hello():
    return "Hello"