/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type PyMenuAction = "about" | "help" | "music_player";

export interface MusicPlayerSetting {
  playPath: string;
  currentTime: number;
  volume: number;
}
export interface PyMenuEvent {
  action: PyMenuAction;
}
