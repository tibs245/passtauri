use std::fs;
extern crate dirs;
use crate::pass::error::PassError;
use gpgme::{Context, Protocol};

fn get_context_openpgp_protocol() -> Result<Context, PassError> {
    match Context::from_protocol(Protocol::OpenPgp) {
        Ok(ctx) => Ok(ctx),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

fn open_password_file(password_path: &str) -> Result<fs::File, PassError> {
    match fs::File::open(password_path) {
        Ok(file) => Ok(file),
        Err(error) => Err(PassError::UnableToOpenPasswordFile(error)),
    }
}

pub fn delete_password_file(password_path: &str) -> Result<(), PassError> {
    match fs::remove_file(password_path) {
        Ok(_) => Ok(()),
        Err(error) => Err(PassError::UnableToDeletePasswordFile(error)),
    }
}

pub fn decrypt_password_file(password_path: &str) -> Result<String, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;
    let mut input = open_password_file(password_path)?;
    let mut output = Vec::new();

    match ctx.decrypt(&mut input, &mut output) {
        Ok(_result) => Ok(String::from_utf8_lossy(&output).into()),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

pub fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store/"),
        None => Err(PassError::PasswordStorePathNotFound),
    }
}

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
