use rand::Rng;

use crate::pass::entities::file_details::FileDetails;
use crate::pass::entities::password_data::PasswordData;

use crate::pass::error::PassError;
use regex::Regex;

use super::repository::{
    decrypt_password_file, delete_password_file, list_files_path, search_files,
};

pub fn get_password_data(password_path: &str) -> Result<PasswordData, PassError> {
    let password_data = decrypt_password_file(password_path)?;

    let mut line_number = 0;
    let mut password = String::from("");
    let mut extra: Option<String> = None;
    let mut username: Option<String> = None;
    let mut otp: Option<String> = None;

    let username_regex = Regex::new(r"^username:\s(\S)\s*$").unwrap();
    let otp_regex = Regex::new(r"^otpauth:").unwrap();

    for line in password_data.split('\n') {
        line_number = line_number + 1;

        if line_number == 1 {
            password = line.to_string();
            continue;
        }

        if username_regex.is_match(line) {
            username = Some(username_regex.find(line).unwrap().as_str().to_string());
            continue;
        }

        if otp_regex.is_match(line) {
            otp = Some(line.to_string());
            continue;
        }

        if extra.is_some() || line != "" {
            extra = Some(match extra {
                Some(extradata) => extradata + line + &"\n",
                None => line.to_owned() + &"\n",
            })
        }
    }

    Ok(PasswordData {
        name: password_path
            .to_string()
            .split('/')
            .last()
            .unwrap()
            .replace(&".gpg", &""),
        password: password,
        extra: extra,
        username: username,
        otp: otp,
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

pub fn delete_password(path: &str) -> Result<(), PassError> {
    delete_password_file(path)
}
