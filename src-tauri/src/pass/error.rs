use std::io::Error;

#[derive(Debug)]
pub enum PassError {
    PasswordStorePathNotFound,
    UnableToReadPath(String, Error),
    OpenPgpProtocolNotFound,
    UnableToOpenPasswordFile(Error),
    UnableToWritePasswordFile(Error),
    UnableToDeletePasswordFile(Error),
    KeyNotFound(Error),
    PasswordFileAlreadyExists,
}

impl From<PassError> for String {
    fn from(pass_error: PassError) -> String {
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
            PassError::UnableToOpenPasswordFile(error) => {
                format!("Impossible to open password file : {}", error)
            }
            PassError::UnableToWritePasswordFile(error) => {
                format!("Impossible to write password file : {}", error)
            }
            PassError::UnableToDeletePasswordFile(error) => {
                format!("Impossible to delete password file : {}", error)
            }
            PassError::KeyNotFound(error) => {
                format!("Impossible de trouver la clef : {}", error)
            }
            PassError::PasswordFileAlreadyExists => {
                "Impossible create password if already exists".to_string()
            }
        }
    }
}
