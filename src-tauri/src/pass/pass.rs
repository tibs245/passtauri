use super::{
    entities::{
        action_result::ActionResult, key_serializable::KeySerializable, password_data::PasswordData,
    },
    error::PassError,
    service,
};

#[tauri::command]
pub fn read_password(password_path: &str) -> Result<PasswordData, PassError> {
    service::get_password_data(password_path)
}

#[tauri::command]
pub fn generate_password(list_of_caractere: &str, size: usize) -> String {
    service::generate_string(list_of_caractere, size)
}

#[tauri::command]
pub fn create_password(
    password_path: &str,
    name: &str,
    password: &str,
    username: Option<&str>,
    otp: Option<&str>,
    extra: Option<&str>,
) -> Result<(), PassError> {
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

    service::create_password(password_data, password_path)
}

#[tauri::command]
pub fn update_password(
    password_path: &str,
    name: &str,
    password: &str,
    username: Option<&str>,
    otp: Option<&str>,
    extra: Option<&str>,
) -> Result<(), PassError> {
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

    service::update_password(password_data, password_path)
}

#[tauri::command]
pub fn delete_password(password_path: &str) -> Result<ActionResult, ActionResult> {
    match service::delete_password(password_path) {
        Ok(()) => Ok(ActionResult {
            result: true,
            error: None,
        }),
        Err(error) => Err(ActionResult {
            result: false,
            error: Some(error.into()),
        }),
    }
}

#[tauri::command]
pub fn get_all_keys<'a>() -> Result<Vec<KeySerializable>, PassError> {
    match service::get_all_keys() {
        Ok(keys) => Ok(keys.iter().map(KeySerializable::from).collect()),
        Err(error) => Err(error),
    }
}
