use crate::pass::services;

use super::entities::{
    error::PassError, file_details::FileDetails, folder::FolderDetailsWithChildren,
};

#[tauri::command]
pub fn list_password() -> Result<Vec<FileDetails>, PassError> {
    services::explore::list_password_path("")
}

#[tauri::command]
pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    services::explore::list_password_path(path)
}

#[tauri::command]
pub fn search_password(path: &str, search: &str) -> Result<Option<Vec<FileDetails>>, PassError> {
    services::explore::search_password(path, search)
}

#[tauri::command]
pub fn get_folder_tree(path: &str) -> Result<Vec<FolderDetailsWithChildren>, PassError> {
    match services::explore::list_folder_tree(path) {
        Ok(tree) => Ok(tree.unwrap_or(vec![])),
        Err(error) => Err(error),
    }
}

#[tauri::command]
pub fn get_folder(path: &str) -> Result<FileDetails, PassError> {
    services::folder::get_folder(path)
}
