use std::{fs, path::Path};
extern crate dirs;
use crate::pass::error::PassError;

pub fn list_files_path(path: &str) -> Result<fs::ReadDir, PassError> {
    match fs::read_dir(path) {
        Ok(t) => Ok(t),
        Err(e) => Err(PassError::UnableToReadPath(path.to_string(), e)),
    }
}

pub fn search_files(path: &str, search: &str) -> Result<Option<Vec<fs::DirEntry>>, PassError> {
    let search_lowercase = search.to_lowercase();
    let result: Vec<fs::DirEntry> = list_files_path(path)?
        .filter(|f| {
            f.as_ref()
                .unwrap()
                .file_name()
                .to_string_lossy()
                .chars()
                .next()
                .unwrap_or('.')
                != '.'
        })
        .flat_map(|f| -> Option<Vec<fs::DirEntry>> {
            let dir_entry = f.unwrap();
            let mut result = vec![];
            if dir_entry.file_type().unwrap().is_dir() {
                match search_files(dir_entry.path().to_str().unwrap(), search).unwrap() {
                    Some(sub_result) => result = sub_result,
                    _ => (),
                }
            }

            if dir_entry
                .file_name()
                .to_string_lossy()
                .to_string()
                .to_lowercase()
                .contains(&search_lowercase)
            {
                result.push(dir_entry);
            }

            if result.len() >= 1 {
                return Some(result);
            }
            None
        })
        .flatten()
        .collect();

    if result.len() >= 1 {
        Ok(Some(result))
    } else {
        Ok(None)
    }
}

pub fn open_file(password_path: &str) -> Result<fs::File, PassError> {
    match fs::File::open(password_path) {
        Ok(file) => Ok(file),
        Err(error) => Err(PassError::UnableToOpenFile(error)),
    }
}

pub fn is_file_exist(password_path: &str) -> bool {
    Path::new(password_path).exists()
}

pub fn write_password_file(password_path: &str, content: Vec<u8>) -> Result<(), PassError> {
    match fs::write(password_path, content) {
        Ok(()) => Ok(()),
        Err(error) => Err(PassError::UnableToWritePasswordFile(error)),
    }
}

pub fn delete_password_file(password_path: &str) -> Result<(), PassError> {
    match fs::remove_file(password_path) {
        Ok(_) => Ok(()),
        Err(error) => Err(PassError::UnableToDeletePasswordFile(error)),
    }
}
