from enum import Enum
from pydantic import BaseModel


class PyMenuAction(str, Enum):
    ABOUT = "about"
    HELP = "help"
    MUSIC_PLAYER = "music_player"

class PyMenuEvent(BaseModel):
    action: PyMenuAction


