import {useEffect, useRef} from "react";
import {useAudioRefStore} from "./store/audioRefStore.ts";
import {usePlayListStore} from "./store/playListStore.ts";


function AudioView() {
  const {playPath} = usePlayListStore();
  const ref = useRef<HTMLAudioElement | null>(null);
  const {
    audioRef, setAudioRef,
    autoPlay,
    setDuration,
    setCurrentTime,
    volume, setVolume, changeVolume,
    play,
    pause, setPaused,
    muted, setMuted, changeMuted,
    setPlaybackRate,
    setEnded,
  } = useAudioRefStore();


  const onloadedMetaData = () => {
    if (!audioRef?.current) return;
    changeVolume(volume);
    changeMuted(muted);
    console.log('autoPlay', autoPlay);
    if (autoPlay) {
      play();
    } else {
      pause();

    }

    setDuration(audioRef.current.duration);
  }
  const onTimeUpdate = () => {
    if (!audioRef?.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }

  const onVolumeChange = () => {
    if (!audioRef?.current) return;
    setVolume(audioRef.current.volume);
    setMuted(audioRef.current.muted);
  }
  const onRateChange = () => {
    if (!audioRef?.current) return;
    setPlaybackRate(audioRef.current.playbackRate)
  }
  const onPlay = () => {
    setPaused(false);
  }
  const onPause = () => {
    setPaused(true);
  }

  const onEnded = () => {
    setPaused(true);
    setEnded(true);
  }


  useEffect(() => {
    if (ref === null) return;

    setAudioRef(ref);
  }, [playPath])

  useEffect(() => {
    if (!audioRef?.current) return;

    // audioRef.current.volume = 0.5;
    audioRef.current.addEventListener("loadedmetadata", onloadedMetaData);
    audioRef.current.addEventListener("timeupdate", onTimeUpdate);
    audioRef.current.addEventListener("volumechange", onVolumeChange);
    audioRef.current.addEventListener("ratechange", onRateChange);
    audioRef.current.addEventListener("play", onPlay);
    audioRef.current.addEventListener("pause", onPause);
    audioRef.current.addEventListener("ended", onEnded);


    return () => {
      audioRef?.current?.removeEventListener("loadedmetadata", onloadedMetaData);
      audioRef?.current?.removeEventListener("timeupdate", onTimeUpdate);
      audioRef.current?.removeEventListener("volumechange", onVolumeChange);
      audioRef.current?.removeEventListener("ratechange", onRateChange);
      audioRef.current?.removeEventListener("play", onPlay);
      audioRef.current?.removeEventListener("pause", onPause);
      audioRef.current?.removeEventListener("ended", onEnded);
    };

  }, [playPath, audioRef])

  if (playPath === null) return;
  return (
    <div className="audio-player">
      <audio key={playPath} ref={ref} controls autoPlay={false}>
        <source src={`/file?path=${encodeURIComponent(playPath)}`} />
      </audio>
    </div>
  )
}

export default AudioView