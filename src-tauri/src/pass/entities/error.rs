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
    UnableToUpdatePasswordNotExists(String),
    FolderToUpdateNotExists(String),
    UnableMoveFolderIfDestinationAlreadyExists(String),
    FsExtraErrorOnMoveFolder(fs_extra::error::Error),
    FsErrorOnMoveFolder(Error),
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
                "Unable use Openpgp protocol : It's installed ?".to_string()
            }
            PassError::UnableToOpenFile(error) => {
                format!("Unable to open password file : {}", error)
            }
            PassError::UnableToWritePasswordFile(error) => {
                format!("Unable to write password file : {}", error)
            }
            PassError::UnableToDeletePasswordFile(error) => {
                format!("Unable to delete password file : {}", error)
            }
            PassError::UnableToWriteGpgKeyFile(error) => {
                format!("Unable to write gpg key file : {}", error)
            }
            PassError::KeyNotFound(error) => {
                format!("Unable de trouver la clef : {}", error)
            }
            PassError::PasswordFileAlreadyExists => {
                "Unable create password if already exists".to_string()
            }
            PassError::EnableParseContentToString(error) => {
                format!("Enable to parse content to string : {}", error)
            }
            PassError::PathNotInPasswordStorePath => {
                "Path is not in password-store path".to_string()
            }
            PassError::UnableToUpdatePasswordNotExists(password_path) => {
                format!("Unable to update password don't exists : {}", password_path)
            }
            PassError::FolderToUpdateNotExists(folder_path) => {
                format!("Unable to update folder don't exists : {}", folder_path)
            }
            PassError::UnableMoveFolderIfDestinationAlreadyExists(folder_path) => {
                format!(
                    "Unable to move folder. Already file or folder on destination : {}",
                    folder_path
                )
            }
            PassError::FsExtraErrorOnMoveFolder(_) => "Error on move folder".to_string(),
            PassError::FsErrorOnMoveFolder(_) => "Error on move folder".to_string(),
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
