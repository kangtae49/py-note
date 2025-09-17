import sys
import threading
import time
import socket

import requests
import webview
from flask import Flask
from apps.routes.rest import rest_bp
from apps.utils import get_random_port, resource_path
from apps.js_api import JsApi


# html = """
# Hello World!!!!!!
# """
# def load_css(window):
#     window.load_css('body { background: transparent !important; }')

def run_flask(host, port):
    template_folder = resource_path("gui")
    static_folder = resource_path("gui\\static")
    print(f"template_folder: {template_folder}", flush=True)
    print(f"static_folder: {static_folder}", flush=True)
    # server = Flask(__name__, static_folder='./assets', template_folder='./templates')
    server = Flask(__name__, 
                   static_folder=static_folder, # static_url_path="/assets",
                   template_folder=template_folder)
    server.register_blueprint(rest_bp)
    server.run(host=host, port=port)

def wait_for_flask(host, port, timeout=10):
    start = time.time()
    while time.time() - start < timeout:
        # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        #     if sock.connect_ex((host, port)) == 0:
        #         print("flask server started")
        #         return True
        # print("flask server not started yet")
        r = requests.get(f"http://{host}:{port}/health")
        if r.status_code == 200:
            print("flask server started", flush=True)
            return True
        print("flask server not started yet", flush=True)
        time.sleep(0.1)

    raise RuntimeError("flask server did not start")


def run():
    host = "127.0.0.1"
    port = get_random_port()
    url = f"http://{host}:{port}"
    print(url, flush=True)
    
    t = threading.Thread(target=run_flask, args=(host, port), daemon=True)
    t.start()
    wait_for_flask(host, port, 30)

    # run_flask(port)
    js_api = JsApi()
    webview.create_window(
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
    debug = False if hasattr(sys, "_MEIPASS") else True
    webview.start(debug=debug)

