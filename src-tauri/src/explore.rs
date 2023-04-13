use serde::Serialize;
use std::fs;

#[tauri::command]
pub fn list_password() -> String {
    let paths = fs::read_dir("/home/tibs/.password-store").unwrap();
    let paths_name: Vec<String> = paths
        .map(|f| f.unwrap().file_name().to_string_lossy().to_string())
        .filter(|filename| filename != ".git" && filename != ".gpg-id")
        .collect();

    serde_json::to_string(&paths_name).unwrap()
}
