use std::io::Error;

use serde::{ser::SerializeStruct, Serialize, Serializer};

#[derive(Debug)]
pub enum PassError {
    PasswordStorePathNotFound,
    UnableToReadPath(String, Error),
    OpenPgpProtocolNotFound,
    UnableToOpenFile(Error),
    UnableToWritePasswordFile(Error),
    UnableToDeletePasswordFile(Error),
    UnableToWriteGpgKeyFile(Error),
    KeyNotFound(Error),
    PasswordFileAlreadyExists,
    EnableParseContentToString(Error),
    PathNotInPasswordStorePath,
}
impl From<&PassError> for String {
    fn from(pass_error: &PassError) -> String {
        match pass_error {
            PassError::PasswordStorePathNotFound => {
                "Password store path not configured or not found".to_string()
            }
            PassError::UnableToReadPath(path, error_path) => {
                format!("Unable to read path {} because : {}", path, error_path)
            }
            PassError::OpenPgpProtocolNotFound => {
                "Impossible use Openpgp protocol : It's installed ?".to_string()
            }
            PassError::UnableToOpenFile(error) => {
                format!("Impossible to open password file : {}", error)
            }
            PassError::UnableToWritePasswordFile(error) => {
                format!("Impossible to write password file : {}", error)
            }
            PassError::UnableToDeletePasswordFile(error) => {
                format!("Impossible to delete password file : {}", error)
            }
            PassError::UnableToWriteGpgKeyFile(error) => {
                format!("Impossible to write gpg key file : {}", error)
            }
            PassError::KeyNotFound(error) => {
                format!("Impossible de trouver la clef : {}", error)
            }
            PassError::PasswordFileAlreadyExists => {
                "Impossible create password if already exists".to_string()
            }
            PassError::EnableParseContentToString(error) => {
                format!("Enable to parse content to string : {}", error)
            }
            PassError::PathNotInPasswordStorePath => {
                "Path is not in password-store path".to_string()
            }
        }
    }
}

impl From<PassError> for String {
    fn from(pass_error: PassError) -> String {
        String::from(&pass_error)
    }
}

impl Serialize for PassError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("PassError", 2)?;
        s.serialize_field("errorType", &format!("{:?}", self))?;
        s.serialize_field("message", &String::from(self))?;
        s.end()
    }
}
