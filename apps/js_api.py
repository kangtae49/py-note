import os
from typing import List
import webview


class JsApi:
    # def sayHelloTo(self, name):
    #     response = {'message': 'Hello {0}!'.format(name)}
    #     return response

    def save_config(self, name, content):
        appdata_local = os.getenv("LOCALAPPDATA")
        fullpath = os.path.join(appdata_local, "py-note", name)
        dirpath = os.path.dirname(fullpath)
        if not os.path.exists(dirpath):
            os.makedirs(dirpath)
        with open(fullpath, "w") as f:
            f.write(content)
        return

    def open_file_dialog_open(self, allow_multiple: bool, file_types: List[str]):
        if file_types is None:
            file_types = ['All files (*.*)']
        window = webview.active_window()
        result = window.create_file_dialog(
            webview.FileDialog.OPEN,
            allow_multiple=allow_multiple,
            file_types=tuple(file_types)
        )
        return result

    def open_file_dialog_folder(self, allow_multiple: bool, file_types: List[str]):
        if file_types is None:
            file_types = ['All files (*.*)']
        window = webview.active_window()
        result = window.create_file_dialog(
            webview.FileDialog.FOLDER,
            allow_multiple=allow_multiple,
            file_types=tuple(file_types)
        )
        return result

    def open_file_dialog_save(self, file_types: List[str]):
        window = webview.active_window()
        result = window.create_file_dialog(
            webview.FileDialog.SAVE,
            save_filename='playlist.json',
            file_types=tuple(file_types)
        )
        return result