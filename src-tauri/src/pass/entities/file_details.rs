use std::{
    fs::{DirEntry, FileType},
    time::SystemTime,
};

use crate::utils;
use serde::ser::{Serialize, SerializeStruct, Serializer};

#[derive(Clone)]
pub enum FileTypeAPI {
    DIRECTORY,
    FILE,
}

impl From<FileTypeAPI> for String {
    fn from(file_type: FileTypeAPI) -> String {
        match file_type {
            FileTypeAPI::DIRECTORY => "DIRECTORY".to_string(),
            FileTypeAPI::FILE => "FILE".to_string(),
        }
    }
}

impl From<FileType> for FileTypeAPI {
    fn from(file_type: FileType) -> FileTypeAPI {
        if file_type.is_dir() {
            FileTypeAPI::DIRECTORY
        } else {
            FileTypeAPI::FILE
        }
    }
}

pub struct FileDetails {
    pub filename: String,
    pub path: String,
    pub filetype: FileTypeAPI,
    pub last_modified: SystemTime,
}

impl FileDetails {
    pub fn is_cached_dir(&self) -> bool {
        self.filename.chars().next().unwrap() == '.'
    }
}

impl From<&DirEntry> for FileDetails {
    fn from(file_data: &DirEntry) -> FileDetails {
        FileDetails {
            filename: file_data.file_name().to_string_lossy().to_string(),
            path: file_data.path().to_string_lossy().to_string(),
            filetype: file_data.file_type().unwrap().into(),
            last_modified: match file_data.metadata().unwrap().modified() {
                Ok(value) => value,
                Err(_) => SystemTime::UNIX_EPOCH,
            },
        }
    }
}

impl From<DirEntry> for FileDetails {
    fn from(file_data: DirEntry) -> FileDetails {
        FileDetails::from(&file_data)
    }
}

// This is what #[derive(Serialize)] would generate.

impl Serialize for FileDetails {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("FileDetails", 4)?;
        s.serialize_field("filename", &self.filename)?;
        s.serialize_field("path", &self.path)?;
        s.serialize_field("filetype", &String::from(self.filetype.clone()))?;
        s.serialize_field("lastModified", &utils::iso8601(&self.last_modified))?;
        s.end()
    }
}
