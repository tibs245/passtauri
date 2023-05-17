use regex::Regex;
use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PasswordData {
    pub name: String,
    pub password: String,
    pub extra: Option<String>,
    pub username: Option<String>,
    pub otp: Option<String>,
}

impl From<String> for PasswordData {
    fn from(password_data: String) -> PasswordData {
        let mut line_number = 0;
        let mut password = String::from("");
        let mut extra: Option<String> = None;
        let mut username: Option<String> = None;
        let mut otp: Option<String> = None;

        let username_regex = Regex::new(r"^username:\s*(\S+)\s*$").unwrap();
        let otp_regex = Regex::new(r"^otpauth:").unwrap();

        for line in password_data.split('\n') {
            line_number = line_number + 1;

            if line_number == 1 {
                password = line.to_string();
                continue;
            }

            if username_regex.is_match(line) {
                username = Some(username_regex.captures(line).unwrap()[1].to_string());
                continue;
            }

            if otp_regex.is_match(line) {
                otp = Some(line.to_string());
                continue;
            }

            if extra.is_some() || line != "" {
                extra = Some(match extra {
                    Some(extradata) => extradata + line + &"\n",
                    None => line.to_owned() + &"\n",
                })
            }
        }

        PasswordData {
            name: String::from(""),
            password: password,
            extra: extra,
            username: username,
            otp: otp,
        }
    }
}

impl From<PasswordData> for String {
    fn from(password_data: PasswordData) -> String {
        let mut data_to_stringify = vec![password_data.password];

        match password_data.otp {
            Some(otp) => data_to_stringify.push(otp),
            _ => (),
        };

        match password_data.username {
            Some(username) => data_to_stringify.push(format!("username:{}", username)),
            _ => (),
        };

        match password_data.extra {
            Some(extra) => data_to_stringify.push("\n".to_owned() + &extra),
            _ => (),
        };

        data_to_stringify.join("\n")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_from_string() {
        let password_data_string = "password123\n".to_string()
            + "username: testuser\n"
            + "some extra data\n"
            + "otpauth://totp/somedata\n"
            + "URL: http://*.some_site.com/";

        let password_data = PasswordData::from(password_data_string);

        assert_eq!(password_data.name, "");
        assert_eq!(password_data.password, "password123");
        assert_eq!(
            Some("some extra data\nURL: http://*.some_site.com/\n".to_string()),
            password_data.extra
        );
        assert_eq!(
            Some("otpauth://totp/somedata".to_string()),
            password_data.otp
        );
        assert_eq!(Some("testuser".to_string()), password_data.username);
    }

    #[test]
    fn test_from_string_with_only_password() {
        let password_data_string = "password123".to_string();

        let password_data = PasswordData::from(password_data_string);

        assert_eq!(password_data.name, "");
        assert_eq!(password_data.password, "password123");
        assert_eq!(None, password_data.extra);
        assert_eq!(None, password_data.otp);
        assert_eq!(None, password_data.username);
    }

    #[test]
    fn test_from_string_with_special_charactere() {
        let password_data_string = "password12345é'&é²&_é)àç&éè² \n".to_string();

        let password_data = PasswordData::from(password_data_string);

        assert_eq!(password_data.name, "");
        assert_eq!(password_data.password, "password12345é'&é²&_é)àç&éè² ");
        assert_eq!(None, password_data.extra);
        assert_eq!(None, password_data.otp);
        assert_eq!(None, password_data.username);
    }

    #[test]
    fn test_to_string() {
        let password_data = PasswordData {
            name: "".to_string(),
            password: "password123".to_string(),
            extra: Some("some extra data\n".to_string()),
            username: Some("testuser".to_string()),
            otp: Some("otpauth://totp/somedata".to_string()),
        };
        let password_data_string = String::from(password_data);

        assert_eq!(
            password_data_string,
            "password123\notpauth://totp/somedata\nusername:testuser\n\nsome extra data\n"
        );
    }

    #[test]
    fn test_to_string_without_username() {
        let password_data_without_username = PasswordData {
            name: "".to_string(),
            password: "password123".to_string(),
            extra: Some("some extra data\n".to_string()),
            username: None,
            otp: Some("otpauth://totp/somedata".to_string()),
        };
        let password_data_string_without_username = String::from(password_data_without_username);

        assert_eq!(
            password_data_string_without_username,
            "password123\notpauth://totp/somedata\n\nsome extra data\n"
        );
    }

    #[test]
    fn test_to_string_with_only_password() {
        let password_with_only_password = PasswordData {
            name: "My Password".to_string(),
            password: "password123".to_string(),
            extra: None,
            username: None,
            otp: None,
        };
        let password_data_string_with_only_password = String::from(password_with_only_password);

        assert_eq!(password_data_string_with_only_password, "password123");
    }
}
