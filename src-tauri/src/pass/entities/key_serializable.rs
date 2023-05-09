use std::time::SystemTime;

use gpgme::{Key, UserId, Validity};
use serde::{Serialize, Serializer};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KeySerializable {
    fingerprint: Option<String>,
    issuer: Option<String>,
    last_update: SystemTime,
    has_secret: bool,
    is_expired: bool,
    is_revoked: bool,
    is_invalid: bool,
    is_disabled: bool,
    can_sign: bool,
    can_encrypt: bool,
    can_certify: bool,
    user: Vec<UserIdSerializable>,

    #[serde(serialize_with = "serialize_validity")]
    owner_trust: Validity,
}

impl From<&Key> for KeySerializable {
    fn from(key: &Key) -> KeySerializable {
        KeySerializable {
            fingerprint: match key.fingerprint_raw() {
                Some(fingerprint) => Some(fingerprint.to_string_lossy().to_string()),
                None => None,
            },
            issuer: match key.issuer_name_raw() {
                Some(issuers) => Some(issuers.to_string_lossy().to_string()),
                None => None,
            },
            last_update: key.last_update(),
            has_secret: key.has_secret(),
            is_expired: key.is_expired(),
            is_revoked: key.is_revoked(),
            is_invalid: key.is_invalid(),
            is_disabled: key.is_disabled(),
            can_sign: key.can_sign(),
            can_encrypt: key.can_encrypt(),
            can_certify: key.can_certify(),
            user: key.user_ids().map(UserIdSerializable::from).collect(),
            owner_trust: key.owner_trust(),
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserIdSerializable {
    #[serde(serialize_with = "serialize_validity")]
    pub validity: Validity,
    pub name: String,
    pub email: String,
    pub comment: String,
    pub is_revoked: bool,
    pub is_invalid: bool,
}

impl<'key> From<UserId<'key>> for UserIdSerializable {
    fn from(user_id: UserId<'key>) -> UserIdSerializable {
        UserIdSerializable {
            validity: user_id.validity(),
            name: user_id.name_raw().unwrap().to_string_lossy().to_string(),
            email: user_id.email_raw().unwrap().to_string_lossy().to_string(),
            comment: user_id.comment_raw().unwrap().to_string_lossy().to_string(),
            is_revoked: user_id.is_revoked(),
            is_invalid: user_id.is_invalid(),
        }
    }
}

fn serialize_validity<S>(validity: &Validity, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match validity {
        Validity::Unknown => serializer.serialize_str("UNKNOWN"),
        Validity::Undefined => serializer.serialize_str("UNDEFINED"),
        Validity::Never => serializer.serialize_str("NEVER"),
        Validity::Marginal => serializer.serialize_str("MARGINAL"),
        Validity::Full => serializer.serialize_str("FULL"),
        Validity::Ultimate => serializer.serialize_str("ULTIMATE"),
    }
}
