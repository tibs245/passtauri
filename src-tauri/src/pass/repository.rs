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

pub fn decrypt_password_file(password_path: &str) -> Result<String, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;
    let mut input = open_password_file(password_path)?;
    let mut output = Vec::new();

    match ctx.decrypt(&mut input, &mut output) {
        Ok(_result) => Ok(String::from_utf8_lossy(&output).into()),
        Err(_error) => Err(PassError::OpenPgpProtocolNotFound),
    }
}

fn password_store_path() -> Result<String, PassError> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().into_owned() + &"/.password-store/"),
        None => Err(PassError::PasswordStorePathNotFound),
    }
}

pub fn list_files_path(path: &str) -> Result<fs::ReadDir, PassError> {
    match fs::read_dir(password_store_path()? + path) {
        Ok(t) => Ok(t),
        Err(e) => Err(PassError::UnableToReadPath(path.to_string(), e)),
    }
}
