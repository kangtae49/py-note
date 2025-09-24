import "./MusicPlayerView.css"
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
import { List } from 'react-window'
import {usePlayListStore} from "@/components/music_player/store/playListStore.ts";
import PlayListRowView from "@/components/music_player/PlayListRowView.tsx";
import {useSelectedPlayListStore} from "@/components/music_player/store/selectedPlayListStore.ts";
import {useSelectionBeginStore} from "@/components/music_player/store/selectionBeginStore.ts";
import {usePlayPathStore} from "@/components/music_player/store/playPathStore.ts";
import AudioView from "@/components/music_player/AudioView.tsx";

// import {useDurationStore} from "@/components/music_player/store/durationStore.ts";
// import {useCurrentTimeStore} from "@/components/music_player/store/currentTimeStore.ts";
// import {useVolumeStore} from "@/components/music_player/store/volumeStore.ts";
// import {useIsMutedStore} from "@/components/music_player/store/isMutedStore.ts";
// import {useIsPlayStore} from "@/components/music_player/store/isPlayStore.ts";
// import {usePlaybackRateStore} from "@/components/music_player/store/playbackRateStore.ts";
import {formatSeconds, getFilename} from "@/components/utils.ts";
import {useAudioRefStore} from "@/components/music_player/store/audioRefStore.ts";
import {useEffect} from "react";

function MusicPlayerView() {
  const {playList, appendPlayList, removePlayList, shufflePlayList, natsortPlayList} = usePlayListStore();
  const {selectedPlayList, setSelectedPlayList} = useSelectedPlayListStore();
  const {setSelectionBegin} = useSelectionBeginStore();
  const {playPath, setPlayPath} = usePlayPathStore();
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
  // const {duration} = useDurationStore();
  // const {currentTime, setCurrentTime} = useCurrentTimeStore();
  // const {volume, setVolume} = useVolumeStore();
  // const {isMuted} = useIsMutedStore();
  // const {isPlay} = useIsPlayStore();
  // const {playbackRate} = usePlaybackRateStore();


  const openDialogPlayList = async () => {
    window.pywebview.api.open_file_dialog_open(true, ["Audio files(*.mp3;*.wav;*.ogg;*.m4a;*.opus;*.webm)"])
      .then((res) => {
        if (res === null) { return }
        appendPlayList(res);
        let playList = [];
        if (shuffle) {
          playList = shufflePlayList()
        } else {
          playList = natsortPlayList()
        }

        setSelectedPlayList([])
        setSelectionBegin(null)
        if (playList.length > 0) {
          setPlayPath(playList[0]);
        }
      })
  }

  const clickRemovePlayList = () => {
    if (selectedPlayList.length == 0) { return }
    removePlayList(selectedPlayList);
    setSelectedPlayList([])
    setSelectionBegin(null)
  }

  const openDialogOpenJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_open(false, ["Save files(*.json)"]);
    console.log(result);
  }
  const openDialogSaveAsJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_save(["Save files(*.json)"]);
    console.log(result);
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

  return (
    <div className="widget movie-player">
      <AudioView />
      <div className="top">
        <div className="row first">
          <div className="icon" onClick={() => toggleShuffle()}>
            <Icon icon={faShuffle} className={shuffle ? '': 'inactive'}/>
          </div>
          <div className="icon"><Icon icon={faBackwardStep}/></div>
          <div className="icon middle"
               onClick={async () => {
                 setAutoPlay(paused);
                 await togglePlay();
               }}
          >
            <Icon icon={paused ? faCirclePlay : faCirclePause }/>
          </div>
          <div className="icon"><Icon icon={faForwardStep}/></div>
          <div className="icon" onClick={() => toggleRepeat()}>
            {repeat === 'repeat_all' && <Icon icon={faArrowsSpin}/>}
            {repeat === 'repeat_one' && <Icon icon={faRotateRight}/>}
            {repeat === 'repeat_none' && <Icon icon={faMinus}/>}
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
          <div className="icon" onClick={openDialogPlayList}><Icon icon={faFolderPlus}/></div>
          <div className="icon" onClick={clickRemovePlayList}><Icon icon={faTrashCan} className={selectedPlayList.length > 0 ? '': 'inactive'}/></div>
          <div className="icon" onClick={openDialogOpenJson}><Icon icon={faBookMedical}/></div>
          <div className="icon" onClick={openDialogSaveAsJson}><Icon icon={faFloppyDisk}/></div>
        </div>
        <div className="row second">
          <div className="title">{getFilename(playPath ?? '')}</div>
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
            rowHeight={22}
            rowCount={playList.length}
            rowComponent={PlayListRowView} rowProps={{playList}} />
    </div>
  )
}

export default MusicPlayerView;
