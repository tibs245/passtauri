mod explore;
use gpgme::{Context, Protocol};
use std::fs::File;

// #![cfg_attr(
//   all(not(debug_assertions), target_os = "windows"),
//   windows_subsystem = "windows"
// )]


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_password])
        .invoke_handler(tauri::generate_handler![explore::list_password])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_password(name: &str) -> String {
    let mut ctx = Context::from_protocol(Protocol::OpenPgp).unwrap();
    let mut input = File::open("/home/tibs/.password-store/perso/ce-sii.gpg").unwrap();
    let mut output = Vec::new();
    ctx.decrypt(&mut input, &mut output)
        .map_err(|e| format!("decrypting failed: {:?}", e));

    String::from_utf8_lossy(&output).into()
}
