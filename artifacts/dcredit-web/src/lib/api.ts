import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react/src/custom-fetch";

// Initialize the API client
export function initApi() {
  // Set the base URL if needed, although it defaults to relative paths which is fine for the same domain
  setBaseUrl("");
  
  // Set the auth token getter to read from localStorage
  setAuthTokenGetter(() => {
    return localStorage.getItem("dcredit_token");
  });
}
