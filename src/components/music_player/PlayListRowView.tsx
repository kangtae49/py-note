import React from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faCircleXmark,
  faMusic,
} from '@fortawesome/free-solid-svg-icons'
import { type RowComponentProps } from "react-window";
import {getFilename} from "@/components/utils.ts";
import {usePlayListStore} from "@/components/music_player/playListStore.ts";
import {useSelectedPlayListStore} from "@/components/music_player/selectedPlayListStore.ts";
import {useSelectionBeginStore} from "@/components/music_player/selectionBeginStore.ts";
import {usePlayPathStore} from "@/components/music_player/playPathStore.ts";
function PlayListRowView({
                           index,
                           playList,
                           style
                      }: RowComponentProps<{
  playList: string[];
}>) {
  const {removePlayList} = usePlayListStore();
  const {selectedPlayList, setSelectedPlayList, appendSelectedPlayList, removeSelectedPlayList} = useSelectedPlayListStore();
  const {selectionBegin, setSelectionBegin} = useSelectionBeginStore();
  const {playPath, setPlayPath} = usePlayPathStore();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>, item: string) => {
    e.preventDefault();
    window.getSelection()?.removeAllRanges();
    if (!e.shiftKey) {
      setSelectionBegin(item);
    }

    let selection: string[] = [];
    let begin = 0;
    let end = 0;
    if (e.shiftKey) {
      if (selectionBegin === null) {
        return;
      }
      begin = playList.indexOf(selectionBegin);
      end = playList.indexOf(item);
      selection = playList.slice(Math.min(begin, end), Math.max(begin, end) + 1);
    } else {
      selection = [item]
    }

    if (selection.length == 0) {
      return;
    }

    if (e.ctrlKey) {
      if (selection.length == 1) {
        if (selectedPlayList.includes(selection[0])) {
          removeSelectedPlayList(selection);
        } else {
          appendSelectedPlayList(selection);
        }
      } else {
        if (selectedPlayList.includes(playList[begin])) {
          appendSelectedPlayList(selection);
        } else {
          removeSelectedPlayList(selection);
        }
      }
    } else {
      if (selection.length == 1) {
        setSelectedPlayList(selection);
      } else {
        if (selectedPlayList.includes(playList[begin])) {
          setSelectedPlayList(selection);
        } else {
          removeSelectedPlayList(selection);
        }
      }
    }

  };

  const clickPlayPath = (path: string) => {
    window.getSelection()?.removeAllRanges();
    console.log(path)
    setSelectedPlayList([]);
    setPlayPath(path);
  }

  return (
    <div className={`row ${selectedPlayList.includes(playList[index]) ? 'selected': ''}`} style={style}>
      <div className="title" title={playList[index]}
           onClick={(e) => handleClick(e, playList[index])}
           onDoubleClick={() => clickPlayPath(playList[index])}
      >
        {playPath == playList[index] && <Icon icon={faMusic}/>}
        {getFilename(playList[index])}
      </div>
      <div
        onClick={() => removePlayList([playList[index]])}
      >
        <Icon icon={faCircleXmark} />
      </div>
    </div>
  );
}

export default PlayListRowView;