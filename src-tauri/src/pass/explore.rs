use crate::pass::service;

#[tauri::command]
pub fn list_password() -> Result<String, String> {
    match serde_json::to_string(&service::list_password_path("")?) {
        Ok(result) => Ok(result),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub fn list_password_path(path: &str) -> Result<String, String> {
    match serde_json::to_string(&service::list_password_path(path)?) {
        Ok(result) => Ok(result),
        Err(error) => Err(error.to_string()),
    }
}
