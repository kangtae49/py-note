declare global {
  interface Window {
    pywebview: {
        api: {
          open_file_dialog_open: (allow_multiple: boolean, file_types: string []) => Promise<string[] | null>,
          open_file_dialog_folder: (allow_multiple: boolean, file_types: string []) => Promise<string[] | null>,
          open_file_dialog_save: (file_types: string []) => Promise<string[] | null>,
        }
    };
  }
}

export {};
