pub mod pass;
pub mod utils;

// #![cfg_attr(
//   all(not(debug_assertions), target_os = "windows"),
//   windows_subsystem = "windows"
// )]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            pass::explore::list_password,
            pass::explore::list_password_path,
            pass::pass::read_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
