use std::{fs::File, io::Read};

use gpgme::{Context, Key, Protocol};

use crate::pass::entities::error::PassError;

use super::file_password::open_file;

fn get_context_openpgp_protocol() -> Result<Context, PassError> {
    match Context::from_protocol(Protocol::OpenPgp) {
        Ok(ctx) => Ok(ctx),
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

pub fn decrypt_password_file(file_content: &mut File) -> Result<String, PassError> {
    let mut ctx = get_context_openpgp_protocol()?;
    let mut output = Vec::new();

    match ctx.decrypt(file_content, &mut output) {
        Ok(_result) => Ok(String::from_utf8_lossy(&output).into()),
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
