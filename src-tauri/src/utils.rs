use chrono::prelude::{DateTime, Utc};

pub fn iso8601(st: &std::time::SystemTime) -> String {
    let dt: DateTime<Utc> = st.clone().into();
    format!("{}", dt.format("%+"))
    // formats like "2001-07-08T00:34:60.026490+09:30"
}

pub fn remove_last_dir(path: &str) -> String {
    let mut test: Vec<&str> = path.split(std::path::MAIN_SEPARATOR).collect();
    test.pop();

    test.join(&std::path::MAIN_SEPARATOR.to_string())
}
