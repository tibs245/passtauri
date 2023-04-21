use crate::pass::entities::FileDetails;
use crate::pass::error::PassError;
use crate::pass::repository::list_files_path;

pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    Ok(list_files_path(path)?
        .map(|f| -> FileDetails { f.unwrap().into() })
        .filter(|file| !file.is_cached_dir())
        .collect())
}
