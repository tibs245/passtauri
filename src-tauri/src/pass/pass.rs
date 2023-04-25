use super::{entities::action_result::ActionResult, service};

#[tauri::command]
pub fn read_password(password_path: &str) -> Result<String, String> {
    match serde_json::to_string(&service::get_password_data(password_path)?) {
        Ok(result) => Ok(result),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub fn generate_password(list_of_caractere: &str, size: usize) -> Result<String, String> {
    match serde_json::to_string(&service::generate_string(list_of_caractere, size)) {
        Ok(result) => Ok(result),
        Err(error) => Err(error.to_string()),
    }
}

pub fn delete_password(password_path: &str) -> Result<String, String> {
    match service::delete_password(password_path) {
        Ok(()) => Ok(serde_json::to_string(&ActionResult {
            result: true,
            error: None,
        })
        .unwrap()),
        Err(error) => Err(serde_json::to_string(&ActionResult {
            result: false,
            error: Some(error.into()),
        })
        .unwrap()),
    }
}
