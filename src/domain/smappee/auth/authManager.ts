import "dotenv/config";
import fetch from "node-fetch";
import { RefreshTokenSmappee } from "./refresh-token-type";
import { logger } from "../../../utils/logger";
const REFRESH_TOKEN_URL = `${process.env.SMAPPEE_BASEURL}/oauth2/token`;

let accessToken = "";
let expiry = 0;

export const getAccessToken = async () => {
  if (expiry - 1000 < new Date().getTime()) {
    const token = await fetchAccessToken();
    expiry = new Date().getTime() + Number(token.expires_in) * 1000;
    accessToken = token?.access_token;
    return token?.access_token;
  }
  return accessToken;
};

const fetchAccessToken = async (): Promise<RefreshTokenSmappee> => {
  const formUrlEncoded = new URLSearchParams();
  formUrlEncoded.append("client_id", process.env.SMAPPEE_CLIENT_ID);
  formUrlEncoded.append("client_secret", process.env.SMAPPEE_CLIENT_SECRET);
  formUrlEncoded.append("username", process.env.SMAPPEE_USERNAME);
  formUrlEncoded.append("password", process.env.SMAPPEE_PASSWORD);
  formUrlEncoded.append("grant_type", "password");

  try {
    const result = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      body: formUrlEncoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (result.ok) {
      return result.json() as Promise<RefreshTokenSmappee>;
    } else {
      logger.error(`HTTP error! ${REFRESH_TOKEN_URL} status: ${result.status}`);
    }
  } catch (error) {
    logger.error(`HTTP error! ${REFRESH_TOKEN_URL} status: ${error.status}`);
  }
};
