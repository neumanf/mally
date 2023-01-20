import httpProxy from "http-proxy";
import Cookies from "cookies";
import url from "url";
import { NextApiRequest, NextApiResponse } from "next";

// Get the actual API_URL as an environment variable. For real
// applications, you might want to get it from 'next/config' instead.
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleProxy = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    if (!req.url) return reject();

    const pathname = url.parse(req.url).pathname;
    const isLogin = pathname === "/api/proxy/api/auth/login";

    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("accessToken");

    // Rewrite URL, strip out leading '/api'
    // '/api/proxy/*' becomes '${API_URL}/*'
    req.url = req.url.replace(/^\/api\/proxy/, "");

    // Don't forward cookies to API
    req.headers.cookie = "";

    // Set auth-token header from cookie
    if (accessToken) {
      req.headers["accessToken"] = accessToken;
    }

    proxy
      .once("proxyRes", (proxyRes, req, res: any) => {
        if (isLogin) {
          let responseBody = "";
          proxyRes.on("data", (chunk) => {
            responseBody += chunk;
          });

          proxyRes.on("end", () => {
            try {
              const { accessToken } = JSON.parse(responseBody);
              const cookies = new Cookies(req, res);
              cookies.set("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "lax", // CSRF protection
              });

              res.status(200).send({ accessToken });
              resolve({ accessToken });
            } catch (err) {
              reject(err);
            }
          });
        } else {
          resolve({});
        }
      })
      .once("error", reject)
      .web(req, res, {
        target: API_URL,
        autoRewrite: false,
        selfHandleResponse: isLogin,
      });
  });
};

export default handleProxy;
