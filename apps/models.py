from enum import Enum
from pydantic import BaseModel


class PyMenuAction(str, Enum):
    ABOUT = "about"
    HELP = "help"

class PyMenuEvent(BaseModel):
    action: PyMenuAction



