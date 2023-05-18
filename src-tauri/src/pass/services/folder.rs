use crate::pass::{entities::error::PassError, repository};

pub fn init_pass_folder(path: &str, keys: Vec<&str>) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        repository::folder::create_pass_folder(path, keys)
    }
}

pub fn update_pass_folder(
    actual_path: &str,
    new_path: &str,
    keys: Vec<&str>,
) -> Result<(), PassError> {
    if !repository::file_password::is_file_exist(actual_path) {
        return Err(PassError::FolderToUpdateNotExists(actual_path.to_string()));
    } else if actual_path != new_path && !repository::file_password::is_file_exist(new_path) {
        return Err(PassError::UnableMoveFolderIfDestinationAlreadyExists(
            new_path.to_string(),
        ));
    }

    if actual_path != new_path {
        repository::folder::move_folder(actual_path, new_path)?;
    }

    repository::folder::write_keys_file(new_path, keys)
}

pub fn delete_password_folder(path: &str) -> Result<(), PassError> {
    repository::folder::delete_folder(path)
}
