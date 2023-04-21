#[tauri::command]
fn read_password(name: &str) -> String {
    let mut ctx = Context::from_protocol(Protocol::OpenPgp).unwrap();
    let mut input = File::open("/home/tibs/.password-store/perso/ce-sii.gpg").unwrap();
    let mut output = Vec::new();
    ctx.decrypt(&mut input, &mut output)
        .map_err(|e| format!("decrypting failed: {:?}", e));

    String::from_utf8_lossy(&output).into()
}
