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
                println!("{:?}", username_regex.captures(line).unwrap());
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
            Some(username) => data_to_stringify.push(format!("username: {}", username)),
            _ => (),
        };

        match password_data.extra {
            Some(extra) => data_to_stringify.push("\n".to_owned() + &extra),
            _ => (),
        };

        data_to_stringify.join("\n")
    }
}
