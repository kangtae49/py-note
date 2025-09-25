export {};

declare global {
  interface Window {
    pywebview: {
        api: {
          read_json_audio_list: (fullpath: string) => Promise<string | null>,
          write_json_audio_list: (fullpath: string, content: string) => Promise<void>,
          read_json_audio_list_latest: () => Promise<string | null>,
          write_json_audio_list_latest: (content: string) => Promise<void>,

          open_file_dialog_open: (allow_multiple: boolean, file_types: string []) => Promise<string[] | null>,
          open_file_dialog_folder: (allow_multiple: boolean, file_types: string []) => Promise<string[] | null>,
          open_file_dialog_save: (file_types: string []) => Promise<string[] | null>,
        }
    };
  }

}


