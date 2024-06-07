/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  jsconfigPaths: true,
  env:{
    /*
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.BACKEND_API_URL,
    BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,
    NEXT_PUBLIC_BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,
    */
    // BACKEND_API_URL: "http://192.168.0.117:5000",
    BACKEND_API_URL: "https://tda-api.emergentcybernetics.net",
    NEXT_PUBLIC_BACKEND_API_URL: "https://tda-api.emergentcybernetics.net",
    //BACKEND_API_URL: "http://local.emergentcybernetics.net:5000",
    //NEXT_PUBLIC_BACKEND_API_URL: "http://local.emergentcybernetics.net:5000",
    BACKEND_API_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2FkbWluIjoiYWRtaW4iLCJleHAiOjE3MjAyNzQ1NDEsImlzcyI6Imp3dF9hcGlfaXNzdWVyIiwiYXVkIjoiand0X2FwaV9hdWRpZW5jZSJ9.7fk9bZb6FQLCeJjECH4dye3CC5bK0qTPIweTJNXk08I",
    NEXT_PUBLIC_BACKEND_API_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsInByX2FkbWluIjoiYWRtaW4iLCJleHAiOjE3MjAyNzQ1NDEsImlzcyI6Imp3dF9hcGlfaXNzdWVyIiwiYXVkIjoiand0X2FwaV9hdWRpZW5jZSJ9.7fk9bZb6FQLCeJjECH4dye3CC5bK0qTPIweTJNXk08I",
  },
}

module.exports = nextConfig
