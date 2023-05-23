use std::{
    fs::{DirEntry, FileType},
    path::Path,
    str::FromStr,
    time::SystemTime,
};

use serde::ser::{Serialize, SerializeStruct, Serializer};

use crate::utils;

use super::{error::PassError, pass_item::PassItem};

#[derive(Clone, Debug, PartialEq)]
pub enum FileTypeAPI {
    DIRECTORY,
    FILE,
    None,
}

impl From<FileTypeAPI> for String {
    fn from(file_type: FileTypeAPI) -> String {
        match file_type {
            FileTypeAPI::DIRECTORY => "DIRECTORY".to_string(),
            FileTypeAPI::FILE => "FILE".to_string(),
            FileTypeAPI::None => "NONE".to_string(),
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

impl From<&Path> for FileTypeAPI {
    fn from(file_path: &Path) -> FileTypeAPI {
        if !file_path.exists() {
            FileTypeAPI::None
        } else if file_path.is_dir() {
            FileTypeAPI::DIRECTORY
        } else {
            FileTypeAPI::FILE
        }
    }
}
#[derive(Debug)]
pub struct FileDetails {
    pub filename: String,
    pub path: String,
    pub filetype: FileTypeAPI,
    pub last_modified: SystemTime,
    pub has_parent_keys: bool,
    pub encrypt_keys_id: Option<Vec<String>>,
}

impl FileDetails {
    fn new(path: &Path) -> Result<FileDetails, PassError> {
        if !path.exists() {
            return Err(PassError::PathNotFound(path.to_string_lossy().to_string()));
        }

        let mut directory_last_modified = SystemTime::UNIX_EPOCH;

        if let Ok(metadata) = path.metadata() {
            if let Ok(last_modified) = metadata.modified() {
                directory_last_modified = last_modified;
            }
        }

        let pass_item = PassItem::new(path);

        Ok(FileDetails {
            filename: path.file_name().unwrap().to_string_lossy().to_string(),
            path: path.canonicalize().unwrap().to_string_lossy().to_string(),
            filetype: path.into(),
            last_modified: directory_last_modified,
            encrypt_keys_id: pass_item.default_keys_gpg_id().unwrap(),
            has_parent_keys: pass_item.has_parent_keys(),
        })
    }

    pub fn is_cached(&self) -> bool {
        self.filename.chars().next().unwrap() == '.'
    }
}

impl From<&DirEntry> for FileDetails {
    fn from(file_data: &DirEntry) -> FileDetails {
        Self::new(&file_data.path()).unwrap()
    }
}

impl From<DirEntry> for FileDetails {
    fn from(file_data: DirEntry) -> FileDetails {
        Self::new(&file_data.path()).unwrap()
    }
}

#[derive(Debug)]
pub enum ParseFileDetailsErr {
    NotFound,
}
// TODO : Add test
impl FromStr for FileDetails {
    type Err = ParseFileDetailsErr;
    fn from_str(path_str: &str) -> Result<FileDetails, Self::Err> {
        match Self::new(Path::new(path_str)) {
            Ok(result) => Ok(result),
            Err(_) => Err(ParseFileDetailsErr::NotFound),
        }
    }
}

impl Serialize for FileDetails {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("FileDetails", 6)?;
        s.serialize_field("filename", &self.filename)?;
        s.serialize_field("path", &self.path)?;
        s.serialize_field("filetype", &String::from(self.filetype.clone()))?;
        s.serialize_field("lastModified", &utils::iso8601(&self.last_modified))?;
        s.serialize_field("hasParentKeys", &self.has_parent_keys)?;
        s.serialize_field("encryptKeysId", &self.encrypt_keys_id)?;
        s.end()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use std::env;
    use std::fs;

    #[test]
    fn test_is_cached() {
        let file_details = FileDetails {
            filename: ".git".to_string(),
            path: "/home/user/.password-store/.git".to_string(),
            filetype: FileTypeAPI::FILE,
            last_modified: SystemTime::now(),
            has_parent_keys: true,
            encrypt_keys_id: None,
        };

        assert_eq!(file_details.is_cached(), true);

        let file_details2 = FileDetails {
            filename: "git".to_string(),
            path: "/home/user/.password-store/git".to_string(),
            filetype: FileTypeAPI::FILE,
            last_modified: SystemTime::now(),
            has_parent_keys: true,
            encrypt_keys_id: None,
        };

        assert_eq!(file_details2.is_cached(), false);
    }

    #[test]
    fn test_serialize_file_from_dir_entry_with_file() {
        let temp_dir = env::temp_dir()
            .as_path()
            .join("rust_unit_test_test_serialize_file_from_dir_entry_with_file");
        let temp_file_name = "test_from_dir_entry";

        if temp_dir.exists() {
            fs::remove_dir_all(temp_dir.clone()).expect("Unable remove temp dir folder");
        }

        fs::create_dir(temp_dir.clone()).expect("Unable create temp dir to test");
        // Create a temp file and write some content to it
        fs::write((temp_dir.clone()).join(temp_file_name), "hello world")
            .expect("Unable to write file");

        let file_data = fs::read_dir(&temp_dir).unwrap().next().unwrap().unwrap();

        let file_details = FileDetails::from(file_data);

        assert_eq!(file_details.filename, temp_file_name.to_string());
        assert_eq!(
            file_details.path,
            temp_dir
                .clone()
                .join(temp_file_name)
                .to_string_lossy()
                .to_string()
        );
        assert_eq!(file_details.filetype, FileTypeAPI::FILE);
        assert!(file_details.has_parent_keys);
        assert_eq!(file_details.encrypt_keys_id, None);
        assert!(file_details.is_cached() == false);

        fs::remove_dir_all(temp_dir.clone()).expect("Unable remove temp dir folder");
    }

    #[test]
    fn test_serialize_file_from_dir_entry_with_cached_directory() {
        let temp_dir = env::temp_dir()
            .as_path()
            .join("rust_unit_test_test_serialize_file_from_dir_entry_with_cached_directory");
        let temp_file_name = ".test_from_dir_entry";

        if temp_dir.exists() {
            fs::remove_dir_all(temp_dir.clone()).expect("Unable remove temp dir folder");
        }

        fs::create_dir(temp_dir.clone()).expect("Unable create temp dir to test");
        // Create a temp file and write some content to it
        fs::create_dir((temp_dir.clone()).join(temp_file_name)).expect("Unable to write folder");

        let file_data = fs::read_dir(&temp_dir).unwrap().next().unwrap().unwrap();

        let file_details = FileDetails::from(file_data);

        assert_eq!(file_details.filename, temp_file_name.to_string());
        assert_eq!(
            file_details.path,
            temp_dir
                .clone()
                .join(temp_file_name)
                .to_string_lossy()
                .to_string()
        );
        assert_eq!(file_details.filetype, FileTypeAPI::DIRECTORY);
        assert!(file_details.has_parent_keys);
        assert_eq!(file_details.encrypt_keys_id, None);
        assert!(file_details.is_cached());

        fs::remove_dir_all(temp_dir.clone()).expect("Unable remove temp dir folder");
    }
}
