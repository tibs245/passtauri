use fs_extra::{self, dir::CopyOptions};
use std::fs;
extern crate dirs;
use crate::pass::entities::{error::PassError, pass_item::PassItem};

pub fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store"),
        None => Err(PassError::PasswordStorePathNotFound),
    }
}

pub fn create_pass_folder(
    folder_path: &str,
    keys: Vec<&str>,
    has_parent_keys: bool,
) -> Result<(), PassError> {
    match fs::create_dir(folder_path) {
        Ok(()) => {
            if !has_parent_keys {
                write_keys_file(folder_path, keys)
            } else {
                Ok(())
            }
        }
        Err(error) => Err(PassError::UnableToWritePasswordFile(error)),
    }
}

pub fn write_keys_file(folder_path: &str, key: Vec<&str>) -> Result<(), PassError> {
    match fs::write(
        PassItem::from(folder_path).keys_file_path(),
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

pub fn move_folder(source_path: &str, destination_path: &str) -> Result<(), PassError> {
    // We try with "rename", I think this work with 95% case and It's efficient and sure
    // But if we want merge on future or copy to another file system this don't work
    // To this case I use fs_extra crate to copy / delete recursively with same privileges
    // and in future merge if we want
    match fs::rename(source_path, destination_path) {
        Ok(()) => Ok(()),
        Err(error) => {
            if let Some(err_number) = error.raw_os_error() {
                // I can't catch with ErrorKind::CrossesDevices with anoter method
                // This correspond when we rename on another file system
                if err_number == 18 {
                    match fs_extra::move_items(
                        &vec![source_path],
                        destination_path,
                        &CopyOptions::default(),
                    ) {
                        Ok(_) => return Ok(()),
                        Err(err) => return Err(PassError::FsExtraErrorOnMoveFolder(err)),
                    };
                }
            }

            Err(PassError::FsErrorOnMoveFolder(error))
        }
    }
}
