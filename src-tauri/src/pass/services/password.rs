use rand::Rng;

use crate::pass::{
    entities::{error::PassError, password_data::PasswordData},
    repository,
};

use super::keys::encrypt_password;

pub fn get_password_data(password_path: &str) -> Result<PasswordData, PassError> {
    let mut file_content = repository::file_password::open_file(password_path)?;
    let password_data = repository::gpg::decrypt_password_file(&mut file_content)?;

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

pub fn create_password(password_data: PasswordData, path: &str) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        encrypt_password(password_data, path)
    }
}

pub fn update_password(password_data: PasswordData, password_path: &str) -> Result<(), PassError> {
    if !repository::file_password::is_file_exist(password_path) {
        return Err(PassError::UnableToUpdatePasswordNotExists(
            password_path.to_string(),
        ));
    }

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

pub fn delete_password(path: &str) -> Result<(), PassError> {
    repository::file_password::delete_password_file(path)
}
