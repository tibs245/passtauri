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
            pass::explore::search_password,
            pass::explore::get_folder_tree,
            pass::pass::read_password,
            pass::pass::generate_password,
            pass::pass::delete_password,
            pass::pass::delete_password_folder,
            pass::pass::create_password,
            pass::pass::update_password,
            pass::pass::init_pass_folder,
            pass::pass::update_pass_folder,
            pass::explore::get_folder,
            pass::pass::get_all_keys,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
