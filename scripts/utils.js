

const decodeToken = (token) => {
  try {
    const decoded = token.split('.')[1];
    const payload = JSON.parse(atob(decoded));
    console.log(payload);
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

module.exports = {
  decodeToken,
};
