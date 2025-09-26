import os
import json
from typing import List
import webview


class JsApi:
    # def sayHelloTo(self, name):
    #     response = {'message': 'Hello {0}!'.format(name)}
    #     return response
    def read_json_audio_list(self, fullpath):
        if not os.path.isfile(fullpath):
            return None
        with open(fullpath, "r") as f:
            content = f.read()
            jpath = json.loads(content)
            existing_files: List[str] = [p for p in jpath if os.path.isfile(p)]
            return json.dumps(existing_files)

    def write_json_audio_list(self, fullpath, content):
        dirpath = os.path.dirname(fullpath)
        if not os.path.exists(dirpath):
            os.makedirs(dirpath)
        with open(fullpath, "w") as f:
            f.write(content)
        return

    def read_json_audio_list_latest(self):
        appdata_local = os.getenv("LOCALAPPDATA")
        fullpath = os.path.join(appdata_local, "py-note", "music_player.latest_list.json")
        return self.read_json_audio_list(fullpath)

    def write_json_audio_list_latest(self, content):
        appdata_local = os.getenv("LOCALAPPDATA")
        fullpath = os.path.join(appdata_local, "py-note", "music_player.latest_list.json")
        self.write_json_audio_list(fullpath, content)

    def read_setting_music_player(self):
        appdata_local = os.getenv("LOCALAPPDATA")
        fullpath = os.path.join(appdata_local, "py-note", "music_player.setting.json")
        if not os.path.isfile(fullpath):
            return None
        with open(fullpath, "r") as f:
            content = f.read()
            return content

    def write_setting_music_player(self, content):
        appdata_local = os.getenv("LOCALAPPDATA")
        fullpath = os.path.join(appdata_local, "py-note", "music_player.setting.json")
        dirpath = os.path.dirname(fullpath)
        if not os.path.exists(dirpath):
            os.makedirs(dirpath)
        with open(fullpath, "w") as f:
            f.write(content)


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