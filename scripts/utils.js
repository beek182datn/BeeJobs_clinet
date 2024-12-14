const decodeToken = (token) => {
  try {
    console.log('tokenString: ', token)
    const payload = `"${token.split('.')[1]}"`;
    console.log('payload: '+payload)
    const decodedPayload = JSON.parse(atob(payload));
    console.log('Decoded payload:', decodedPayload);
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

module.exports = {
  decodeToken,
};
