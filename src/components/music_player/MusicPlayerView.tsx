import "./MusicPlayerView.css"
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import {
  faBookMedical,
  faFolderPlus, faTrashCan,
  faCirclePlay, faCirclePause, faVolumeHigh, faVolumeMute,
  faBackwardStep, faForwardStep,
  faShuffle, faRepeat,
  faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons'
import { List } from 'react-window'
import {usePlayListStore} from "@/components/music_player/store/playListStore.ts";
import PlayListRowView from "@/components/music_player/PlayListRowView.tsx";
import {useSelectedPlayListStore} from "@/components/music_player/store/selectedPlayListStore.ts";
import {useSelectionBeginStore} from "@/components/music_player/store/selectionBeginStore.ts";
import {usePlayPathStore} from "@/components/music_player/store/playPathStore.ts";
import AudioView from "@/components/music_player/AudioView.tsx";
import {useDurationStore} from "@/components/music_player/store/durationStore.ts";
import {useCurrentTimeStore} from "@/components/music_player/store/currentTimeStore.ts";
import {useVolumeStore} from "@/components/music_player/store/volumeStore.ts";
import {useIsMutedStore} from "@/components/music_player/store/isMutedStore.ts";
import {useIsPlayStore} from "@/components/music_player/store/isPlayStore.ts";
import {usePlaybackRateStore} from "@/components/music_player/store/playbackRateStore.ts";
import {formatSeconds, getFilename} from "@/components/utils.ts";
import {useAudioRefStore} from "@/components/music_player/store/audioRefStore.ts";

function MusicPlayerView() {
  const {playList, appendPlayList, removePlayList} = usePlayListStore();
  const {selectedPlayList, setSelectedPlayList} = useSelectedPlayListStore();
  const {setSelectionBegin} = useSelectionBeginStore();
  const {audioRef} = useAudioRefStore();
  const {playPath, setPlayPath} = usePlayPathStore();
  const {duration} = useDurationStore();
  const {currentTime, setCurrentTime} = useCurrentTimeStore();
  const {volume, setVolume} = useVolumeStore();
  const {isMuted} = useIsMutedStore();
  const {isPlay} = useIsPlayStore();
  const {playbackRate} = usePlaybackRateStore();


  const openDialogPlayList = async () => {
    window.pywebview.api.open_file_dialog_open(true, ["Audio files(*.mp3;*.wav;*.ogg;*.m4a;*.opus;*.webm)"])
      .then((res) => {
        if (res === null) { return }
        appendPlayList(res);
        setSelectedPlayList([])
        setSelectionBegin(null)
        if (res.length > 0) {
          setPlayPath(res[0]);
        }
      })
  }

  const clickRemovePlayList = () => {
    if (selectedPlayList.length == 0) { return }
    removePlayList(selectedPlayList);
    setSelectedPlayList([])
    setSelectionBegin(null)
  }

  // const openFileDialogFolder = async () => {
  //   const result = await window.pywebview.api.open_file_dialog_open(true, ["Audio files(*.mp3;*.wav;*.ogg;*.m4a;*.opus;*.webm)"]);
  //   console.log(result);
  // }

  const openDialogOpenJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_open(false, ["Save files(*.json)"]);
    console.log(result);
  }
  const openDialogSaveAsJson = async () => {
    const result = await window.pywebview.api.open_file_dialog_save(["Save files(*.json)"]);
    console.log(result);
  }

  return (
    <div className="widget movie-player">
      <AudioView />
      <div className="top">
        <div className="row first">
          <div className="icon"><Icon icon={faCirclePlay}/></div>
          <div className="icon"><Icon icon={faCirclePause}/></div>
          <div className="icon"><Icon icon={faBackwardStep}/></div>
          <div className="icon"><Icon icon={faForwardStep}/></div>
          <div className="icon"><Icon icon={faShuffle}/></div>
          <div className="icon"><Icon icon={faRepeat}/></div>

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
          <div className="icon"><Icon icon={faVolumeHigh}/></div>
          <div className="icon"><Icon icon={faVolumeMute}/></div>
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
                      setCurrentTime(tm);
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
