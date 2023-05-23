use std::{
    path::{Path, PathBuf},
    str::FromStr,
};

use crate::pass::{entities::error::PassError, repository};

const GPG_KEYS_FILE_NAME: &str = ".gpg-id";

pub struct PassItem {
    path: String,
}

impl PassItem {
    pub fn new(path: &Path) -> Self {
        PassItem {
            path: path.to_string_lossy().to_string(),
        }
    }

    pub fn keys_file_path(&self) -> PathBuf {
        let path = Path::new(&self.path);

        if path.is_file() {
            path.parent().unwrap().join(GPG_KEYS_FILE_NAME)
        } else {
            path.join(GPG_KEYS_FILE_NAME)
        }
    }

    pub fn has_parent_keys(&self) -> bool {
        !Path::new(&self.path).join(GPG_KEYS_FILE_NAME).exists()
    }

    pub fn default_keys_gpg_id(&self) -> Result<Option<Vec<String>>, PassError> {
        self.gpg_id_or_parents()
    }

    pub fn folder_keys_gpg_id(&self) -> Result<Option<Vec<String>>, PassError> {
        let gpg_id_path = Path::new(&self.path).join(GPG_KEYS_FILE_NAME);

        if gpg_id_path.exists() {
            Ok(Some(repository::gpg::get_gpg_id_from_path(
                &gpg_id_path.to_str().unwrap(),
            )?))
        } else {
            Ok(None)
        }
    }

    pub(self) fn gpg_id_or_parents(&self) -> Result<Option<Vec<String>>, PassError> {
        let store_path = repository::folder::password_store_path()?;

        if !self.path.contains(&store_path) {
            return Err(PassError::PathNotInPasswordStorePath);
        }

        match Self::folder_keys_gpg_id(self)? {
            Some(keys) => Ok(Some(keys)),
            None => match Self::new(&Path::new(&self.path).parent().unwrap()).gpg_id_or_parents() {
                Ok(result) => Ok(result),
                Err(error) => match error {
                    PassError::PathNotInPasswordStorePath => Ok(None),
                    _ => Err(error),
                },
            },
        }
    }
}

impl From<&str> for PassItem {
    fn from(path_str: &str) -> PassItem {
        Self::new(Path::new(path_str))
    }
}

#[derive(Debug)]
pub enum ParsePassItemErr {
    NotFound,
}

impl FromStr for PassItem {
    type Err = ParsePassItemErr;
    fn from_str(path_str: &str) -> Result<Self, ParsePassItemErr> {
        Ok(Self::new(Path::new(path_str)))
    }
}
