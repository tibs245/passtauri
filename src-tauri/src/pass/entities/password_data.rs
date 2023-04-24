use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordData {
    pub password: String,
    pub extra: String,
}
