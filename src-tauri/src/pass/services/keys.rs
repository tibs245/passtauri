use gpgme::Key;

use crate::pass::{
    entities::{error::PassError, password_data::PasswordData},
    repository,
};

pub fn get_all_keys() -> Result<Vec<Key>, PassError> {
    repository::gpg::get_all_keys()
}

pub(super) fn encrypt_password(
    password_data: PasswordData,
    password_path: &str,
    keys: Vec<String>,
) -> Result<(), PassError> {
    let recipients = repository::gpg::get_keys(keys.iter().map(|x| x.as_str()).collect())?;
    let result_data = repository::gpg::encrypt_string(password_data.into(), recipients)?;
    repository::file_password::write_password_file(password_path, result_data)
}
