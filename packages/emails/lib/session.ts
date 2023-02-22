export const ironOptions = {
    cookieName: "myapp_cookiename",
    password: "RfDBUMsD81m79NLD0wWff4sbR9qbEGbx",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };