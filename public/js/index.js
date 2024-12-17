import "@babel/polyfill";
import { login } from "./login";
import { sendFile } from "./sendFile";
import { signUp } from "./signUp";
// import { downloadFile } from './downloadFile';

const loginForm = document.getElementById("login");
const uploadForm = document.getElementById("upload");
const signUpForm = document.getElementById("sign-up");

console.log(location.host);

// const downloads = document.querySelectorAll('.download');

// if (downloads.length > 0) {
//   downloads.forEach((el) => {
//     el.addEventListener('click', (ev) => {
//       downloadFile(ev.target.dataset.fileid);
//     });
//   });
// }

if (loginForm) {
  console.log(loginForm);
  loginForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (uploadForm) {
  uploadForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = new FormData();
    form.append("file", document.getElementById("file").files[0]);
    sendFile(form);
  });
}

if (signUpForm) {
  console.log(signUpForm);
  signUpForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log("skfjke");
    console.log(name, email, password, passwordConfirm);
    signUp(name, email, password, passwordConfirm);
  });
}
