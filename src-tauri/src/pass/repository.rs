use std::fs;
extern crate dirs;
use crate::pass::error::PassError;

fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store/"),
        None => Err(PassError::PasswordStorePathNotFound),
    }
}

pub fn list_files_path(path: &str) -> Result<fs::ReadDir, PassError> {
    match fs::read_dir(password_store_path()? + path) {
        Ok(t) => Ok(t),
        Err(e) => Err(PassError::UnableToReadPath(path.to_string(), e)),
    }
}
