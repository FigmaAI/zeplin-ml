import http, { handleResponse } from "../utils/http";
import { APP_URL, ZEPLIN_CLIENT_ID, ZEPLIN_CLIENT_SECRET } from "../constants";
import stringComparison from "string-comparison";
import { getOverlapSize } from "overlap-area";

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

export async function CreateNote(pid, screenId, params) {
  return http
    .post(`${ZEPLIN_API_URL}/projects/${pid}/screens/${screenId}/notes`, params)
    .then(handleResponse);
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

export async function fetchLayersFromScreenVersions(pid, screenId) {
  return http
    .get(
      `${ZEPLIN_API_URL}/projects/${pid}/screens/${screenId}/versions/latest`
    )
    .then(handleResponse);
}

//
// Raw JSON에서 component_name이 있는 Layers만 추출하는 함수
//

const ID = "id";
const RECT = "rect";
const COMPONENT_NAME = "component_name";
const LAYERS = "layers";

// raw 객체가 component로 변환될 수 있는지 여부 반환
function isComponent(raw) {
  return ID in raw && RECT in raw && COMPONENT_NAME in raw;
}

// raw 객체로부터 copmonent를 추출하여 객체화
function extractComponent(raw) {
  return {
    id: raw[ID],
    bbox: [
      raw[RECT].absolute.x,
      raw[RECT].absolute.y,
      raw[RECT].width,
      raw[RECT].height,
    ],
    label: raw[COMPONENT_NAME],
  };
}

// raw 객체로부터 재귀적으로 component를 추출하여 배열로 반환
export function ExtractComponents(raw) {
  // 추출한 component들
  const components = [];

  // 해당 raw 객체가 component로 변환될 수 있으면 변환하여 추가
  if (isComponent(raw)) {
    components.push(extractComponent(raw));
  }

  // layers가 재귀적으로 포함되어있으면 각 layer별로 추출하여 합친다
  if (LAYERS in raw) {
    for (const layer of raw[LAYERS]) {
      // layer로부터 component들을 추출하여 합친다
      components.push(...ExtractComponents(layer));
    }
  }

  return components;
}

//BoxMatcher 코드 시작

const cosine = stringComparison.cosine;

function boxArea([, , w, h]) {
  return w * h;
}

function computeOverlappingArea([x1, y1, w1, h1], [x2, y2, w2, h2]) {
  const points1 = [
    [x1, y1],
    [x1 + w1, y1],
    [x1 + w1, y1 + h1],
    [x1, y1 + h1],
  ];

  const points2 = [
    [x2, y2],
    [x2 + w2, y2],
    [x2 + w2, y2 + h2],
    [x2, y2 + h2],
  ];

  return getOverlapSize(points1, points2);
}

function computeIoU(box1, box2) {
  const overlap = computeOverlappingArea(box1.bbox, box2.bbox);
  const union = boxArea(box1.bbox) + boxArea(box2.bbox);
  return overlap / (union - overlap);
}

export function matchBoxes(design, prediction) {
  prediction.forEach((predictItem) => {
    design.forEach((designItem) => {
      const iou = computeIoU(predictItem, designItem);

      if (iou > 0.5) {
        const similarity = cosine.similarity(
          predictItem.label,
          designItem.label
        );
        predictItem["iou"] = iou;
        predictItem["labelSimilarity"] = similarity;
        predictItem["design"] = designItem;
      }
    });
  });

  return prediction;
}
