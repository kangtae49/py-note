import "./MusicPlayerView.css"
import React, {useEffect, useRef} from "react";
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faBookMedical,
  faFolderPlus, faTrashCan,
  faCirclePlay, faCirclePause, faVolumeHigh, faVolumeMute,
  faBackwardStep, faForwardStep,
  faShuffle,
  faFloppyDisk,
  faArrowsSpin, faRotateRight, faMinus,
} from '@fortawesome/free-solid-svg-icons'
import {List,  type ListImperativeAPI} from 'react-window'
import {usePlayListStore} from "@/components/music_player/store/playListStore.ts";
import PlayListRowView from "@/components/music_player/PlayListRowView.tsx";
import {useSelectedPlayListStore} from "@/components/music_player/store/selectedPlayListStore.ts";
import AudioView from "@/components/music_player/AudioView.tsx";
import {formatSeconds, getFilename} from "@/components/utils.ts";
import {useAudioRefStore} from "@/components/music_player/store/audioRefStore.ts";

function MusicPlayerView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListImperativeAPI>(null);


  const {
    playList, appendPlayList, removePlayList, shufflePlayList, natsortPlayList,
    playPath, setPlayPath,
    prevPlayPath, nextPlayPath,
    getPrev, getNext,
    setPlayListRef,
    scrollPlayPath,
  } = usePlayListStore();
  const {
    selectedPlayList, setSelectedPlayList,
    selectionBegin, setSelectionBegin,
  } = useSelectedPlayListStore();
  const {
    audioRef,
    paused, pause, play, togglePlay,
    volume, setVolume,
    duration, currentTime, changeCurrentTime,
    muted, changeMuted,
    repeat, toggleRepeat,
    shuffle, toggleShuffle,
    ended, setEnded,
    autoPlay, setAutoPlay,
  } = useAudioRefStore();


  const openDialogPlayList = async () => {
    window.pywebview.api.open_file_dialog_open(true, ["Audio files(*.mp3;*.wav;*.ogg;*.m4a;*.opus;*.webm)"])
      .then((res) => {
        if (res === null) { return }
        appendPlayList(res);
        let shuffledPlayList: string[];
        if (shuffle) {
          shuffledPlayList = shufflePlayList()
        } else {
          shuffledPlayList = natsortPlayList()
        }

        setSelectedPlayList([])
        setSelectionBegin(null)
        if (playPath == null) {
          setPlayPath(shuffledPlayList[0]);
        }

        const content = JSON.stringify(shuffledPlayList, null, 2);
        window.pywebview.api.write_json_audio_list_latest(content).then(() => {
          console.log("save(latest) success");
        })


      })
  }

  const loadJson = (jsonStr: string): string [] => {

    const newList: string [] = JSON.parse(jsonStr);
    appendPlayList(newList);
    let shuffledPlayList: string[];
    if (shuffle) {
      shuffledPlayList = shufflePlayList()
    } else {
      shuffledPlayList = natsortPlayList()
    }
    console.log('playPath', playPath)
    if (playPath == null) {
      setPlayPath(shuffledPlayList[0]);
    }
    return shuffledPlayList;
  }

  const openDialogOpenJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_open(false, ["Save files(*.json)"]);
    if (result === null || result.length <= 0) { return }
    window.pywebview.api.read_json_audio_list(result[0]).then((jsonStr) => {
      if (jsonStr === null) return;
      const shuffledPlayList = loadJson(jsonStr);
      const content = JSON.stringify(shuffledPlayList, null, 2);
      window.pywebview.api.write_json_audio_list_latest(content).then(() => {
        console.log("save(latest) success");
      })
    })

  }


  const openDialogSaveAsJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_save(["Save files(*.json)"]);
    if (result === null || result.length <= 0) { return }
    const content = JSON.stringify(playList, null, 2);
    window.pywebview.api.write_json_audio_list(result[0], content).then(() => {
      console.log("save success");
    });
  }

  const clickRemovePlayList = () => {
    if (selectedPlayList.length == 0) { return }
    removePlayList(selectedPlayList);
    setSelectedPlayList([])
    setSelectionBegin(null)
  }

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    window.getSelection()?.removeAllRanges();

    if (e.ctrlKey && e.key === 'a') {
      setSelectedPlayList(playList);
    } else if (e.key === "Delete") {
      clickRemovePlayList();
    } else if (e.key === "ArrowLeft") {
      const newPlayPath = prevPlayPath()
      if (newPlayPath !== null) {
        scrollPlayPath(newPlayPath)
      }
    } else if (e.key === "ArrowRight") {
      const newPlayPath = nextPlayPath()
      if (newPlayPath !== null) {
        scrollPlayPath(newPlayPath)
      }
    } else if (e.key === "ArrowUp") {
      const newSelection = getPrev(selectionBegin)
      if(newSelection !== null) {
        setSelectionBegin(newSelection)
        setSelectedPlayList([newSelection])
        scrollPlayPath(newSelection)
      }
    } else if (e.key === "ArrowDown") {
      const newSelection = getNext(selectionBegin)
      if(newSelection !== null) {
        setSelectionBegin(newSelection)
        setSelectedPlayList([newSelection])
        scrollPlayPath(newSelection)
      }
    } else if (e.key === "Enter") {
      if (selectedPlayList.length == 1) {
        if (paused) {
          setAutoPlay(true);
        }
        setPlayPath(selectedPlayList[0]);
      }
    }
  }

  useEffect(() => {
    if (shuffle) {
      shufflePlayList()
    } else {
      natsortPlayList()
    }
  }, [shuffle])

  useEffect(() => {
    if (ended) {
      console.log("ended");
      setEnded(false);
      if (playList.length == 0) {
        return;
      }
      console.log("repeat", repeat);
      if (repeat === 'repeat_all') {
        let nextPlay = playList[0];
        if (playPath !== null) {
          let idx = playList.indexOf(playPath);
          let shuffledPlayList = playList;
          if (shuffle && idx === playList.length -1) {
            shuffledPlayList = shufflePlayList();
          }

          if (idx < 0) {
            idx = 0;
          } else {
            idx++;
          }
          if (idx > shuffledPlayList.length - 1) {
            idx = 0;
          }
          nextPlay = shuffledPlayList[idx]
        }
        setPlayPath(nextPlay);
        if (autoPlay) {
          play();
        }
      } else if (repeat === 'repeat_one') {
        changeCurrentTime(0);
        if (autoPlay) {
          play();
        }
      } else if (repeat === 'repeat_none') {
        pause();
      }
    }
  }, [ended])

  useEffect(() => {
    if (listRef?.current !== null) {
      setPlayListRef(listRef.current);
    }
  }, [listRef?.current])

  useEffect(() => {
    containerRef.current?.focus();
    window.pywebview.api.read_json_audio_list_latest().then((jsonStr) => {
      if (jsonStr === null) return;
      loadJson(jsonStr);
    })
  }, [])

  return (
    <div className="widget movie-player" ref={containerRef} onKeyDown={onKeyDownHandler} tabIndex={0}>
      <AudioView />
      <div className="top">
        <div className="row first">
          <div className="icon" onClick={openDialogPlayList} title="Open Audio Files"><Icon icon={faFolderPlus}/></div>
          <div className="icon" onClick={openDialogOpenJson} title="Open Audio Book"><Icon icon={faBookMedical}/></div>
          <div className="icon" onClick={openDialogSaveAsJson} title="Save Audio Book"><Icon icon={faFloppyDisk}/></div>
          <div className="icon badge-wrap" onClick={clickRemovePlayList} title="Delete Selection Files">
            <Icon icon={faTrashCan} className={selectedPlayList.length > 0 ? '': 'inactive'}/>
            {selectedPlayList.length > 0 && <div className="badge">{selectedPlayList.length}</div>}
          </div>
          <div className="center">
            <div className="icon" onClick={() => toggleShuffle()}>
              <Icon icon={faShuffle} className={shuffle ? '': 'inactive'}/>
            </div>
            <div className="icon" onClick={() => prevPlayPath()}>
              <Icon icon={faBackwardStep}/>
            </div>
            <div className="icon middle"
                 onClick={async () => {
                   setAutoPlay(paused);
                   await togglePlay();
                 }}
            >
              <Icon icon={paused ? faCirclePlay : faCirclePause }/>
            </div>
            <div className="icon" onClick={() => nextPlayPath()}>
              <Icon icon={faForwardStep}/>
            </div>
            {repeat === 'repeat_all' && <div className="icon" onClick={() => toggleRepeat()} title="Repeat All"><Icon icon={faArrowsSpin}/></div>}
            {repeat === 'repeat_one' && <div className="icon" onClick={() => toggleRepeat()} title="Repeat One"><Icon icon={faRotateRight}/></div>}
            {repeat === 'repeat_none' && <div className="icon" onClick={() => toggleRepeat()} title="Repeat Off"><Icon icon={faMinus}/></div>}
          </div>

          <div className="slider">
            <input type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVolume(v);
                      if (audioRef?.current) {
                        audioRef.current.volume = v;
                      }
                    }}/>
          </div>
          <div className="icon" onClick={() => changeMuted(!muted)}>
            <Icon icon={muted ? faVolumeMute : faVolumeHigh}/>
          </div>
        </div>
        <div className={`row second ${(!paused && playPath) ? 'playing' : ''}`}>
          <div className="title" title={playPath ?? ''}>{getFilename(playPath ?? '')}</div>
          <div className="tm">{formatSeconds(currentTime)}</div>
          <div className="slider">
            <input type="range" min={0} max={duration} step={0.01} value={currentTime}
                    onChange={(e) => {
                      const tm = Number(e.target.value);
                      changeCurrentTime(tm);
                      if (audioRef?.current) {
                        audioRef.current.currentTime = tm;
                      }
                    }}/>
          </div>
          <div className="tm">{formatSeconds(duration)}</div>
        </div>
      </div>
      <List className="play-list"
            listRef={listRef}
            rowHeight={22}
            rowCount={playList.length}
            rowComponent={PlayListRowView} rowProps={{playList}}

      />
    </div>
  )
}

export default MusicPlayerView;
