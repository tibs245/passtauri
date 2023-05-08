use std::{fs, io::Read, path::Path};
extern crate dirs;
use crate::pass::error::PassError;
use gpgme::{Context, Key, Protocol};

fn get_context_openpgp_protocol() -> Result<Context, PassError> {
    match Context::from_protocol(Protocol::OpenPgp) {
        Ok(ctx) => Ok(ctx),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

fn open_file(password_path: &str) -> Result<fs::File, PassError> {
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

pub fn decrypt_password_file(password_path: &str) -> Result<String, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;
    let mut input = open_file(password_path)?;
    let mut output = Vec::new();

    match ctx.decrypt(&mut input, &mut output) {
        Ok(_result) => Ok(String::from_utf8_lossy(&output).into()),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

pub fn encrypt_string(content: String, recipients: Vec<Key>) -> Result<Vec<u8>, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;
    let mut output = Vec::new();

    match ctx.encrypt(&recipients, content, &mut output) {
        Ok(_result) => Ok(output),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

pub fn get_keys(reference_keys: Vec<&str>) -> Result<Vec<Key>, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;

    if !reference_keys.is_empty() {
        match ctx.find_keys(reference_keys) {
            Ok(keys) => Ok(keys
                .filter_map(|x| x.ok())
                .filter(|k| k.can_encrypt())
                .collect()),
            Err(error) => Err(PassError::KeyNotFound(error.into())),
        }
    } else {
        Ok(Vec::new())
    }
}

pub fn get_all_keys() -> Result<Vec<Key>, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;

    let result = match ctx.keys() {
        Ok(keys) => Ok(keys.filter_map(|x| x.ok()).collect()),
        Err(error) => Err(PassError::KeyNotFound(error.into())),
    };
    result
}

pub fn get_gpg_id_from_path(gpg_id_path: &str) -> Result<Vec<String>, PassError> {
    let mut file = open_file(gpg_id_path)?;
    let mut contents = String::new();

    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents
            .split('\n')
            .filter(|content| content.len() != 0)
            .map(String::from)
            .collect()),
        Err(error) => Err(PassError::EnableParseContentToString(error)),
    }
}

pub fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store"),
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
