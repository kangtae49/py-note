import sys
import threading
import webview
from flask import Flask
from apps.routes.rest import rest_bp
from apps.utils import get_free_port, resource_path
from apps.js_api import JsApi


# html = """
# Hello World!!!!!!
# """
# def load_css(window):
#     window.load_css('body { background: transparent !important; }')

def run_flask(port):
    template_folder = resource_path("gui")
    static_folder = resource_path("gui\\assets")
    print(f"template_folder: {template_folder}")
    print(f"static_folder: {static_folder}")
    # server = Flask(__name__, static_folder='./assets', template_folder='./templates')
    server = Flask(__name__, 
                   static_folder=static_folder, static_url_path="/assets",
                   template_folder=template_folder)
    server.register_blueprint(rest_bp)
    server.run(host="127.0.0.1", port=port)

def run():
    port = get_free_port()
    # port = 3000
    host = "127.0.0.1"
    ssl = False
    debug = True
    if hasattr(sys, "_MEIPASS"):
        debug = False
    scheme = "https" if ssl else "http"
    url = f"{scheme}://{host}:{port}"
    print(url)
    
    t = threading.Thread(target=run_flask, args=(port, ), daemon=True)
    t.start()
    # run_flask(port)
    js_api = JsApi()
    window = webview.create_window(
        title='py-note', 
        url=url,
        js_api=js_api, 
        text_select=True,
        # transparent=True,
        # server=server, 
        # html=html, 
        # frameless=True,
        # http_port=port
        # draggable=True,
        )
    # webview.start(load_css, window, debug=debug, ssl=ssl)
    webview.start(debug=debug, ssl=ssl)

