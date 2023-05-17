use gpgme::Key;

use crate::{
    pass::{
        entities::{error::PassError, password_data::PasswordData},
        repository,
    },
    utils::remove_last_dir,
};

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

pub fn get_all_keys() -> Result<Vec<Key>, PassError> {
    repository::gpg::get_all_keys()
}

pub(super) fn encrypt_password(
    password_data: PasswordData,
    password_path: &str,
) -> Result<(), PassError> {
    let recipients = repository::gpg::get_keys(vec!["A55C6AADE9A6B18BEA78E857FC406DBF8E8EDB24"])?;
    let result_data = repository::gpg::encrypt_string(password_data.into(), recipients)?;
    repository::file_password::write_password_file(password_path, result_data)
}
