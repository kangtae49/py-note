import {usePlayPathStore} from "@/components/music_player/store/playPathStore.ts";
import {useAudioRefStore} from "@/components/music_player/store/audioRefStore.ts";
import {useEffect, useRef} from "react";
import {useDurationStore} from "@/components/music_player/store/durationStore.ts";
import {useCurrentTimeStore} from "@/components/music_player/store/currentTimeStore.ts";
import {useVolumeStore} from "@/components/music_player/store/volumeStore.ts";
import {useIsMutedStore} from "@/components/music_player/store/isMutedStore.ts";
import {useIsPlayStore} from "@/components/music_player/store/isPlayStore.ts";
import {usePlaybackRateStore} from "@/components/music_player/store/playbackRateStore.ts";

function AudioView() {
  const {playPath} = usePlayPathStore();
  const ref = useRef<HTMLAudioElement | null>(null);
  const {audioRef, setAudioRef} = useAudioRefStore();
  const {setDuration} = useDurationStore();
  const {setCurrentTime} = useCurrentTimeStore();
  const {setVolume} = useVolumeStore();
  const {setIsMuted} = useIsMutedStore();
  const {setIsPlay} = useIsPlayStore();
  const {setPlaybackRate} = usePlaybackRateStore();

  const onloadedMetaData = () => {
    if (!audioRef?.current) return;
    setDuration(audioRef.current.duration);
  }
  const onTimeUpdate = () => {
    if (!audioRef?.current) return;
    setCurrentTime(audioRef.current.currentTime);
  }

  const onVolumeChange = () => {
    if (!audioRef?.current) return;
    setVolume(audioRef.current.volume);
    setIsMuted(audioRef.current.muted);
  }

  const onPlay = () => {
    setIsPlay(true);
  }
  const onPause = () => {
    setIsPlay(false);
  }

  const onRateChange = () => {
    if (!audioRef?.current) return;
    setPlaybackRate(audioRef.current.playbackRate)
  }


  useEffect(() => {
    if (ref === null) return;
    setAudioRef(ref);
  }, [playPath])

  useEffect(() => {
    if (!audioRef?.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.addEventListener("loadedmetadata", onloadedMetaData);
    audioRef.current.addEventListener("timeupdate", onTimeUpdate);
    audioRef.current.addEventListener("volumechange", onVolumeChange);
    audioRef.current.addEventListener("play", onPlay);
    audioRef.current.addEventListener("pause", onPause);
    audioRef.current.addEventListener("ratechange", onRateChange);


    return () => {
      audioRef?.current?.removeEventListener("loadedmetadata", onloadedMetaData);
      audioRef?.current?.removeEventListener("timeupdate", onTimeUpdate);
      audioRef.current?.removeEventListener("volumechange", onVolumeChange);
      audioRef.current?.removeEventListener("play", onPlay);
      audioRef.current?.removeEventListener("pause", onPause);
      audioRef.current?.removeEventListener("ratechange", onRateChange);
    };

  }, [playPath, audioRef])

  if (playPath === null) return;
  return (
    <div className="audio-player">
      <audio key={playPath} ref={ref} controls autoPlay={true}>
        <source src={`/file?path=${playPath}`} />
      </audio>
    </div>
  )
}

export default AudioView