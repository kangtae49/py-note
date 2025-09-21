import os

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

