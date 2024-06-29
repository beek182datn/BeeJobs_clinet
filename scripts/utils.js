const decodeToken = (token) => {
  try {
    const [, payload, ] = token.split('.');
    console.log(token)
    console.log(payload)
    const decodedPayload = JSON.parse(atob(payload));
    console.log('Decoded token:', decodedPayload);
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

module.exports = {
  decodeToken,
};
