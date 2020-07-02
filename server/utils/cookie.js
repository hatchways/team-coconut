const getCookieConfig = () => {
  const cookieExp = parseInt(process.env.COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000; //days * hours * minutes * sec * ms
  const isHttps = process.env.NODE_ENV === "production" ? true : false;

  return {
    expires: new Date(Date.now() + cookieExp),
    secure: isHttps, //http or https
    httpOnly: true,
  };
};

module.exports = { getCookieConfig };
