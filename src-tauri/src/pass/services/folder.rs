use std::path::Path;

use crate::pass::{
    entities::{error::PassError, file_details::FileDetails},
    repository, services,
};

pub fn init_pass_folder(path: &str, keys: Vec<&str>) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        repository::folder::create_pass_folder(path, keys)
    }
}

pub fn get_folder(path_str: &str) -> Result<FileDetails, PassError> {
    let path = Path::new(path_str);

    if !path.is_dir() {
        return Err(PassError::FolderDontExists(path_str.to_string()));
    }

    match path_str.parse::<FileDetails>() {
        Ok(file_details) => Ok(FileDetails {
            encrypt_keys_id: services::keys::folder_gpg_id(path_str)?,
            ..file_details
        }),
        Err(error) => Err(PassError::UnableParseFileDetailsFromStr(error)),
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
