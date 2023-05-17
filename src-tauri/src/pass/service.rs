use gpgme::Key;
use rand::Rng;

use super::repository::{self, file_password::open_file};
use crate::pass::entities::{
    error::PassError, file_details::FileDetails, folder::FolderDetailsWithChildren,
    password_data::PasswordData,
};
use crate::utils::remove_last_dir;

pub fn get_password_data(password_path: &str) -> Result<PasswordData, PassError> {
    let mut file_content = open_file(password_path)?;
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

pub fn folder_gpg_id_or_parents(path: &str) -> Result<Option<Vec<String>>, PassError> {
    let store_path = repository::folder::password_store_path()?;

    if !path.contains(&store_path) {
        return Err(PassError::PathNotInPasswordStorePath);
    }

    match folder_gpg_id(path)? {
        Some(keys) => Ok(Some(keys)),
        None => match folder_gpg_id_or_parents(&remove_last_dir(path)) {
            Ok(result) => Ok(result),
            Err(error) => match error {
                PassError::PathNotInPasswordStorePath => Ok(None),
                _ => Err(error),
            },
        },
    }
}

pub fn folder_gpg_id(path: &str) -> Result<Option<Vec<String>>, PassError> {
    let gpg_id_path = path.to_owned() + "/.gpg-id";

    if repository::file_password::is_file_exist(&gpg_id_path) {
        Ok(Some(repository::gpg::get_gpg_id_from_path(&gpg_id_path)?))
    } else {
        Ok(None)
    }
}

pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    Ok(repository::file_password::list_files_path(path)?
        .map(|file| -> FileDetails {
            let file_unwraped = file.unwrap();
            FileDetails {
                encrypt_keys_id: folder_gpg_id_or_parents(file_unwraped.path().to_str().unwrap())
                    .unwrap_or(None),
                ..file_unwraped.into()
            }
        })
        .filter(|file| !file.is_cached_dir())
        .collect())
}

pub fn list_folder_tree(path: &str) -> Result<Option<Vec<FolderDetailsWithChildren>>, PassError> {
    let children: Result<Vec<FolderDetailsWithChildren>, PassError> =
        repository::file_password::list_files_path(path)?
            .filter(|file| file.as_ref().unwrap().file_type().unwrap().is_dir())
            .map(|file| -> Result<FolderDetailsWithChildren, PassError> {
                let file_unwraped = file.unwrap();
                let children = list_folder_tree(file_unwraped.path().to_str().unwrap())?;

                Ok(FolderDetailsWithChildren {
                    children: children,
                    file_details: FileDetails {
                        encrypt_keys_id: folder_gpg_id_or_parents(
                            file_unwraped.path().to_str().unwrap(),
                        )
                        .unwrap_or(None),
                        ..file_unwraped.into()
                    },
                })
            })
            .filter(|result_file| match result_file {
                Ok(file) => !file.is_cached_dir(),
                _ => false,
            })
            .collect();

    let children = children?;

    if children.len() == 0 {
        return Ok(None);
    } else {
        return Ok(Some(children));
    }
}

pub fn search_password(path: &str, search: &str) -> Result<Option<Vec<FileDetails>>, PassError> {
    Ok(
        match repository::file_password::search_files(path, search)? {
            Some(results) => Some(
                results
                    .iter()
                    .map(|f| -> FileDetails { f.into() })
                    .collect(),
            ),
            None => None,
        },
    )
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
    repository::gpg::get_all_keys()
}

fn encrypt_password(password_data: PasswordData, password_path: &str) -> Result<(), PassError> {
    let recipients = repository::gpg::get_keys(vec!["A55C6AADE9A6B18BEA78E857FC406DBF8E8EDB24"])?;
    let result_data = repository::gpg::encrypt_string(password_data.into(), recipients)?;
    repository::file_password::write_password_file(password_path, result_data)
}

pub fn create_password(password_data: PasswordData, path: &str) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        encrypt_password(password_data, path)
    }
}

pub fn init_pass_folder(path: &str, keys: Vec<&str>) -> Result<(), PassError> {
    if repository::file_password::is_file_exist(path) {
        Err(PassError::PasswordFileAlreadyExists)
    } else {
        repository::folder::create_pass_folder(path, keys)
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
    repository::file_password::delete_password_file(path)
}

pub fn delete_password_folder(path: &str) -> Result<(), PassError> {
    repository::folder::delete_folder(path)
}
