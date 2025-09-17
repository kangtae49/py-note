import os
import mimetypes
from flask import Blueprint, render_template, jsonify, Response, request

rest_bp = Blueprint('rest', __name__)


@rest_bp.route("/")
def index():
    return render_template("index.html")

@rest_bp.route("/health")
def health():
    return jsonify(status="ok"), 200

@rest_bp.route("/file")
def file():
    path = request.args.get("path")
    mime_type, _ = mimetypes.guess_type(path)
    if mime_type is None:
        mime_type = "application/octet-stream"

    file_size = os.path.getsize(path)
    range_header = request.headers.get('Range', None)
    if not range_header:
        return Response(open(path, 'rb'), mimetype=mime_type)

    byte1, byte2 = 0, None
    m = range_header.replace("bytes=", "").split("-")
    if m[0]:
        byte1 = int(m[0])
    if len(m) > 1 and m[1]:
        byte2 = int(m[1])

    length = (byte2 or file_size - 1) - byte1 + 1

    def generate():
        with open(path, "rb") as f:
            f.seek(byte1)
            remaining = length
            while remaining > 0:
                chunk = f.read(min(8192, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    rv = Response(generate(), status=206, mimetype=mime_type,
                  headers={
                      "Content-Range": f"bytes {byte1}-{byte1 + length - 1}/{file_size}",
                      "Accept-Ranges": "bytes",
                      "Content-Length": str(length),
                  })
    return rv


@rest_bp.route("/hello")
def hello():
    return "Hello"