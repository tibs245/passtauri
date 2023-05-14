use std::fs;
extern crate dirs;
use crate::pass::error::PassError;

pub fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store"),
        None => Err(PassError::PasswordStorePathNotFound),
    }
}

pub fn create_pass_folder(folder_path: &str, keys: Vec<&str>) -> Result<(), PassError> {
    match fs::create_dir(folder_path) {
        Ok(()) => write_keys_file(folder_path, keys),
        Err(error) => Err(PassError::UnableToWritePasswordFile(error)),
    }
}

pub fn write_keys_file(folder_path: &str, key: Vec<&str>) -> Result<(), PassError> {
    match fs::write(
        folder_path.to_owned() + &"/.gpg-id",
        key.join("\n").to_owned() + "\n",
    ) {
        Ok(()) => Ok(()),
        Err(error) => Err(PassError::UnableToWriteGpgKeyFile(error)),
    }
}

pub fn delete_folder(folder_path: &str) -> Result<(), PassError> {
    match fs::remove_dir_all(folder_path) {
        Ok(_) => Ok(()),
        Err(error) => Err(PassError::UnableToDeletePasswordFile(error)),
    }
}
