use rand::{distributions::Alphanumeric, Rng};

use crate::pass::entities::file_details::FileDetails;
use crate::pass::entities::password_data::PasswordData;

use crate::pass::error::PassError;

use super::repository::{decrypt_password_file, list_files_path, search_files};

pub fn get_password_data(password_path: &str) -> Result<PasswordData, PassError> {
    let password_data = decrypt_password_file(password_path)?;

    let mut line_number = 0;
    let mut password = String::from("");
    let mut extra = String::from("");

    for line in password_data.split('\n') {
        line_number = line_number + 1;

        if line_number == 1 {
            password = line.to_string();
            continue;
        }

        if extra != "" || line != "" {
            if extra != "" {
                extra = extra + &"\n"
            }
            extra = extra + line
        }
    }

    Ok(PasswordData {
        password: password,
        extra: extra,
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
