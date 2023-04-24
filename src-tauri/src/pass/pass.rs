use super::service;

#[tauri::command]
pub fn read_password(password_path: &str) -> Result<String, String> {
    match serde_json::to_string(&service::get_password_data(password_path)?) {
        Ok(result) => Ok(result),
        Err(error) => Err(error.to_string()),
    }
}
