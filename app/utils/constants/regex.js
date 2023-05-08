export default {
  passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
  otpRegex: /^\d{4}$/,
  wordRegex: /^[A-Za-z].*$/,
};
