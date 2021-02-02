import http, { handleResponse } from "../utils/http";
import { APP_URL, ZEPLIN_CLIENT_ID, ZEPLIN_CLIENT_SECRET } from "../constants";

const ZEPLIN_API_URL = "https://api.zeplin.dev/v1";

export function authorize() {
  window.location = `${ZEPLIN_API_URL}/oauth/authorize?client_id=${ZEPLIN_CLIENT_ID}&redirect_uri=${APP_URL}&response_type=code`;
}

export function fetchAccessToken(code) {
  const params = {
    grant_type: "authorization_code",
    client_id: ZEPLIN_CLIENT_ID,
    client_secret: ZEPLIN_CLIENT_SECRET,
    redirect_uri: APP_URL,
    code,
  };

  return http
    .post(`${ZEPLIN_API_URL}/oauth/token`, params)
    .then(handleResponse);
}

export function fetchCurrentUser() {
  return http.get(`${ZEPLIN_API_URL}/users/me`).then(handleResponse);
}

export async function fetchProjects() {
  return http.get(`${ZEPLIN_API_URL}/projects?limit=100`).then(handleResponse);
}

function fetchProjectScreens(pid) {
  return http
    .get(`${ZEPLIN_API_URL}/projects/${pid}/screens?sort=section`)
    .then(handleResponse);
}

function fetchProjectScreenSections(pid) {
  return http
    .get(`${ZEPLIN_API_URL}/projects/${pid}/screen_sections`)
    .then(handleResponse);
}

const DEFAULT_SECTION = {
  id: "default",
};

export async function fetchProjectScreensGroupedBySection(pid) {
  return Promise.all([
    fetchProjectScreens(pid),
    fetchProjectScreenSections(pid),
  ])
    .then(([screens, sections]) =>
      [DEFAULT_SECTION].concat(sections).map((section) => ({
        ...section,
        screens: screens.filter((screen) => {
          if (screen.section) {
            return screen.section.id === section.id;
          }

          return section.id === "default";
        }),
      }))
    )
    .catch((e) => {
      console.log(e);
      return [];
    });
}