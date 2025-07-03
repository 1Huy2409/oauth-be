export const randomToken = () => {
  const length = 6;
  const digits = "0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return token;
};
