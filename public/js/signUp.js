import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://${location.host}/api/users/sign-up`,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully');
      setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'could not sign up');
  }
};
