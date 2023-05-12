# PassTauri

PassTauri is app developped with [Tauri](https://tauri.app/)

### ⚠️⚠️ This project is for my pedagogy and is under developpement ⚠️⚠️

This project is initially for my pedagogy of Rust and don't respect all best practice any time

The objectif is to develop UI for [Pass](https://www.passwordstore.org/)

I am inspired by [BitWarden](https://go.bitwarden.com)

## Stack

- [Tauri](https://tauri.app/)
- [NextJS](https://nextjs.org/)
- [React](https://fr.legacy.reactjs.org/)
- [Rust](https://www.rust-lang.org/fr)
- [Gpgme](https://github.com/gpg/gpgme)
- [ChakraUI](https://chakra-ui.com/)
- [Chakra React Select](https://github.com/csandman/chakra-react-select)
- [React Hook Form](https://react-hook-form.com/)

## Roadmap

### V1 : Have all QtPass feature with better UI/UX

- [x] Show password
- [-] Create and edit password
   - [ ] Form need to be improved
- [x] Create and edit folder
- [ ] Can choose gpg key by password
- [x] Search password and folder
- [ ] Have general settings (Have some data in hard code 🙄)
- [ ] Have settings page
- [x] Compatible Linux
- [ ] Compatible Windows
- [ ] Add git integration
- [ ] Add OTP
- [ ] Add generate QRCode
- [ ] Insure sensible data is not stored in cache and is secure
- [ ] Improve UI and add Responsive Design
- [ ] Stabilize code for the community
   - [ ] Refacto
   - [ ] Add contributing.md
- [ ] Add CI/CD

## V2 : Add note section

- [ ] Add folder to note
- [ ] Add Markdown edit and preview

## Getting Started

First, run the development server:

```bash
pnpm run tauri dev
```

## Preview

### Home


<div align="center">
            <img src="https://raw.githubusercontent.com/tibs245/passtauri/main/docs/home.png" alt="Home Passtauri" />
</div>

<div align="center">
            <img src="https://raw.githubusercontent.com/tibs245/passtauri/main/docs/generate_password.png" alt="Generate password" />
</div>

<div align="center">
            <img src="https://raw.githubusercontent.com/tibs245/passtauri/main/docs/view_password.png" alt="View password" />
</div>