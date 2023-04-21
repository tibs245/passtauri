pub mod pass;
pub mod utils;

// #![cfg_attr(
//   all(not(debug_assertions), target_os = "windows"),
//   windows_subsystem = "windows"
// )]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![pass::explore::list_password])
        .invoke_handler(tauri::generate_handler![pass::explore::list_password_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
