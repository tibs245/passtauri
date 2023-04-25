use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordData {
    pub name: String,
    pub password: String,
    pub extra: Option<String>,
    pub username: Option<String>,
    pub otp: Option<String>,
}
