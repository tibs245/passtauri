use super::{
    entities::{action_result::ActionResult, password_data::PasswordData},
    service,
};

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

pub fn create_password(
    password_path: &str,
    name: &str,
    password: &str,
    username: Option<&str>,
    otp: Option<&str>,
    extra: Option<&str>,
) -> Result<(), String> {
    let password_data = PasswordData {
        name: name.to_string(),
        password: password.to_string(),
        username: match username {
            Some(username) => Some(username.to_string()),
            None => None,
        },
        otp: match otp {
            Some(otp) => Some(otp.to_string()),
            None => None,
        },
        extra: match extra {
            Some(extra) => Some(extra.to_string()),
            None => None,
        },
    };

    match service::create_password(password_data, password_path) {
        Ok(()) => Ok(()),
        Err(error) => Err(error.into()),
    }
}

#[tauri::command]
pub fn update_password(
    password_path: &str,
    name: &str,
    password: &str,
    username: Option<&str>,
    otp: Option<&str>,
    extra: Option<&str>,
) -> Result<(), String> {
    let password_data = PasswordData {
        name: name.to_string(),
        password: password.to_string(),
        username: match username {
            Some(username) => Some(username.to_string()),
            None => None,
        },
        otp: match otp {
            Some(otp) => Some(otp.to_string()),
            None => None,
        },
        extra: match extra {
            Some(extra) => Some(extra.to_string()),
            None => None,
        },
    };

    match service::update_password(password_data, password_path) {
        Ok(()) => Ok(()),
        Err(error) => Err(error.into()),
    }
}

#[tauri::command]
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
