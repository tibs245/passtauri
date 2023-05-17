use crate::pass::{entities::error::PassError, repository};

pub fn init_pass_folder(path: &str, keys: Vec<&str>) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        repository::folder::create_pass_folder(path, keys)
    }
}

pub fn delete_password_folder(path: &str) -> Result<(), PassError> {
    repository::folder::delete_folder(path)
}
