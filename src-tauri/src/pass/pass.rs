use super::{
    entities::{error::PassError, key_serializable::KeySerializable, password_data::PasswordData},
    services,
};

#[tauri::command]
pub fn read_password(password_path: &str) -> Result<PasswordData, PassError> {
    services::password::get_password_data(password_path)
}

#[tauri::command]
pub fn generate_password(list_of_caractere: &str, size: usize) -> String {
    services::password::generate_string(list_of_caractere, size)
}

#[tauri::command]
pub fn create_password(
    path: &str,
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

    services::password::create_password(password_data, path)
}

#[tauri::command]
pub fn init_pass_folder(
    path: &str,
    keys: Vec<&str>,
    has_parent_keys: bool,
) -> Result<(), PassError> {
    services::folder::init_pass_folder(path, keys, has_parent_keys)
}

#[tauri::command]
pub fn update_pass_folder(
    actual_path: &str,
    new_path: &str,
    keys: Vec<&str>,
    has_parent_keys: bool,
) -> Result<(), PassError> {
    services::folder::update_pass_folder(actual_path, new_path, keys, has_parent_keys)
}

#[tauri::command]
pub fn update_password(
    path: &str,
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

    services::password::update_password(password_data, path)
}

#[tauri::command]
pub fn delete_password(password_path: &str) -> Result<(), PassError> {
    services::password::delete_password(password_path)
}

#[tauri::command]
pub fn delete_password_folder(folder_path: &str) -> Result<(), PassError> {
    services::folder::delete_password_folder(folder_path)
}

#[tauri::command]
pub fn get_all_keys() -> Result<Vec<KeySerializable>, PassError> {
    match services::keys::get_all_keys() {
        Ok(keys) => Ok(keys.iter().map(KeySerializable::from).collect()),
        Err(error) => Err(error),
    }
}
