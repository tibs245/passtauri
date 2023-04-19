use std::fs;

#[tauri::command]
pub fn list_password() -> Result<String, String> {
    list_password_path("")
}

#[tauri::command]
pub fn list_password_path(path: &str) -> Result<String, String> {
    let paths = fs::read_dir("/home/tibs/.password-store/".to_owned() + path);

    if paths.is_err() {
        return Err(String::from("Impossible d'ouvrir le dossier correspondant"));
    }

    let paths_name: Vec<String> = paths
        .unwrap()
        .map(|f| f.unwrap().file_name().to_string_lossy().to_string())
        .filter(|filename| filename.chars().next().unwrap() != '.')
        .collect();

    Ok(serde_json::to_string(&paths_name).unwrap())
}
