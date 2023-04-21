use std::io::Error;

#[derive(Debug)]
pub enum PassError {
    PasswordStorePathNotFound,
    UnableToReadPath(String, Error),
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
        }
    }
}
