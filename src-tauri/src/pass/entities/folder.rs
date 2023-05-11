use std::fs::DirEntry;

use serde::{ser::SerializeStruct, Serialize, Serializer};

use crate::utils;

use super::file_details::FileDetails;
#[derive(Debug)]
pub struct FolderDetailsWithChildren {
    pub file_details: FileDetails,
    pub children: Option<Vec<FolderDetailsWithChildren>>,
}

impl FolderDetailsWithChildren {
    pub fn is_cached_dir(&self) -> bool {
        self.file_details.filename.chars().next().unwrap() == '.'
    }
}

impl From<&DirEntry> for FolderDetailsWithChildren {
    fn from(file_data: &DirEntry) -> FolderDetailsWithChildren {
        FolderDetailsWithChildren {
            file_details: file_data.into(),
            children: None,
        }
    }
}

impl From<DirEntry> for FolderDetailsWithChildren {
    fn from(file_data: DirEntry) -> FolderDetailsWithChildren {
        FolderDetailsWithChildren::from(&file_data)
    }
}

// This is what #[derive(Serialize)] would generate.

impl Serialize for FolderDetailsWithChildren {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut s = serializer.serialize_struct("FolderDetailsWithChildren", 6)?;
        s.serialize_field("filename", &self.file_details.filename)?;
        s.serialize_field("path", &self.file_details.path)?;
        s.serialize_field(
            "filetype",
            &String::from(self.file_details.filetype.clone()),
        )?;
        s.serialize_field(
            "lastModified",
            &utils::iso8601(&self.file_details.last_modified),
        )?;
        s.serialize_field("encryptKeysId", &self.file_details.encrypt_keys_id)?;
        s.serialize_field("children", &self.children)?;
        s.end()
    }
}
