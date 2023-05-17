use crate::pass::{
    entities::{error::PassError, file_details::FileDetails, folder::FolderDetailsWithChildren},
    repository,
};

use super::keys::folder_gpg_id_or_parents;

pub fn list_password_path(path: &str) -> Result<Vec<FileDetails>, PassError> {
    Ok(repository::file_password::list_files_path(path)?
        .map(|file| -> FileDetails {
            let file_unwraped = file.unwrap();
            FileDetails {
                encrypt_keys_id: folder_gpg_id_or_parents(file_unwraped.path().to_str().unwrap())
                    .unwrap_or(None),
                ..file_unwraped.into()
            }
        })
        .filter(|file| !file.is_cached_dir())
        .collect())
}

pub fn list_folder_tree(path: &str) -> Result<Option<Vec<FolderDetailsWithChildren>>, PassError> {
    let children: Result<Vec<FolderDetailsWithChildren>, PassError> =
        repository::file_password::list_files_path(path)?
            .filter(|file| file.as_ref().unwrap().file_type().unwrap().is_dir())
            .map(|file| -> Result<FolderDetailsWithChildren, PassError> {
                let file_unwraped = file.unwrap();
                let children = list_folder_tree(file_unwraped.path().to_str().unwrap())?;

                Ok(FolderDetailsWithChildren {
                    children: children,
                    file_details: FileDetails {
                        encrypt_keys_id: folder_gpg_id_or_parents(
                            file_unwraped.path().to_str().unwrap(),
                        )
                        .unwrap_or(None),
                        ..file_unwraped.into()
                    },
                })
            })
            .filter(|result_file| match result_file {
                Ok(file) => !file.is_cached_dir(),
                _ => false,
            })
            .collect();

    let children = children?;

    if children.len() == 0 {
        return Ok(None);
    } else {
        return Ok(Some(children));
    }
}

pub fn search_password(path: &str, search: &str) -> Result<Option<Vec<FileDetails>>, PassError> {
    Ok(
        match repository::file_password::search_files(path, search)? {
            Some(results) => Some(
                results
                    .iter()
                    .map(|f| -> FileDetails { f.into() })
                    .collect(),
            ),
            None => None,
        },
    )
}
