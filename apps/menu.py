import webview
from webview.menu import Menu, MenuAction, MenuSeparator
from apps.models import PyMenuEvent, PyMenuAction

def on_menu_click(action: PyMenuAction):
    window = webview.active_window()
    if window:
        event = PyMenuEvent(action=action)

        window.evaluate_js(f"""
            window.dispatchEvent(
                new CustomEvent("menu-click", {{detail: {event.model_dump_json()}}} )
            );
        """)

app_menu = [
    Menu('Help', [
        MenuAction('About', lambda: on_menu_click(PyMenuAction.ABOUT)),
        MenuAction('Help', lambda: on_menu_click(PyMenuAction.HELP)),
    ])
]