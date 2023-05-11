use crate::pass::service;

use super::{
    entities::{file_details::FileDetails, folder::FolderDetailsWithChildren},
    error::PassError,
};

#[tauri::command]
pub fn list_password() -> Result<Vec<FileDetails>, PassError> {
    service::list_password_path("")
}

#[tauri::command]
pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    service::list_password_path(path)
}

#[tauri::command]
pub fn search_password(path: &str, search: &str) -> Result<Option<Vec<FileDetails>>, PassError> {
    service::search_password(path, search)
}

#[tauri::command]
pub fn get_folder_tree(path: &str) -> Result<Vec<FolderDetailsWithChildren>, PassError> {
    match service::list_folder_tree(path) {
        Ok(tree) => Ok(tree.unwrap_or(vec![])),
        Err(error) => Err(error),
    }
}
