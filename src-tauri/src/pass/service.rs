use gpgme::Key;
use rand::Rng;

use crate::pass::entities::file_details::FileDetails;
use crate::pass::entities::password_data::PasswordData;

use crate::pass::error::PassError;

use super::repository::{
    self, decrypt_password_file, delete_password_file, is_password_file_exist, list_files_path,
    search_files,
};

pub fn get_password_data(password_path: &str) -> Result<PasswordData, PassError> {
    let password_data = decrypt_password_file(password_path)?;

    Ok(PasswordData {
        name: password_path
            .to_string()
            .split('/')
            .last()
            .unwrap()
            .replace(&".gpg", &""),
        ..PasswordData::from(password_data)
    })
}

pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    Ok(list_files_path(path)?
        .map(|f| -> FileDetails { f.unwrap().into() })
        .filter(|file| !file.is_cached_dir())
        .collect())
}

pub fn search_password(path: &str, search: &str) -> Result<Option<Vec<FileDetails>>, PassError> {
    Ok(match search_files(path, search)? {
        Some(results) => Some(
            results
                .iter()
                .map(|f| -> FileDetails { f.into() })
                .collect(),
        ),
        None => None,
    })
}

// Directly inspired by : https://rust-lang-nursery.github.io/rust-cookbook/algorithms/randomness.html#create-random-passwords-from-a-set-of-user-defined-characters
pub fn generate_string(list_of_caractere: &str, size: usize) -> String {
    let charset: Vec<char> = list_of_caractere.chars().collect();

    let mut rng = rand::thread_rng();

    (0..size)
        .map(|_| {
            let idx = rng.gen_range(0..charset.len());
            charset[idx] as char
        })
        .collect()
}

pub fn get_all_keys() -> Result<Vec<Key>, PassError> {
    repository::get_all_keys()
}

fn encrypt_password(password_data: PasswordData, password_path: &str) -> Result<(), PassError> {
    let recipients = repository::get_keys(vec!["A55C6AADE9A6B18BEA78E857FC406DBF8E8EDB24"])?;
    let result_data = repository::encrypt_string(password_data.into(), recipients)?;
    repository::write_password_file(password_path, result_data)
}

pub fn create_password(password_data: PasswordData, password_path: &str) -> Result<(), PassError> {
    if is_password_file_exist(password_path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        encrypt_password(password_data, password_path)
    }
}

pub fn update_password(password_data: PasswordData, password_path: &str) -> Result<(), PassError> {
    let password_old_name = password_path
        .to_string()
        .split('/')
        .last()
        .unwrap()
        .replace(&".gpg", &"");

    if password_old_name != password_data.name {
        create_password(
            password_data.clone(),
            password_path
                .replace(password_old_name.as_str(), password_data.name.as_str())
                .as_str(),
        )?;
        delete_password(password_path)
    } else {
        encrypt_password(password_data, password_path)
    }
}

pub fn delete_password(path: &str) -> Result<(), PassError> {
    delete_password_file(path)
}
