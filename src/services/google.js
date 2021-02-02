import * as moment from "moment";

import { APP_URL, GOOGLE_API_KEY, GOOGLE_CLIENT_ID } from "../constants";
import { fetchProjectScreensGroupedBySection } from "./zeplin";
import { getScreenImageProperties } from "../utils/image";

const DISCOVERY_DOCS = [
  "https://slides.googleapis.com/$discovery/rest?version=v1",
];
const SCOPES = "https://www.googleapis.com/auth/presentations";

const gapi = window.gapi;

export function onClientLoad(onUpdateUserProfile) {
  gapi.load("client:auth2", () => init(onUpdateUserProfile));
}

function getCurrentUserProfile(user) {
  if (user.isSignedIn()) {
    return {
      email: user.getBasicProfile().getEmail(),
    };
  }

  return null;
}

function init(onUpdateUserProfile) {
  gapi.client
    .init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      () => {
        const currentGoogleUser = gapi.auth2.getAuthInstance().currentUser;
        const currentUser = currentGoogleUser.get();
        const profile = getCurrentUserProfile(currentUser);
        onUpdateUserProfile(profile);

        currentGoogleUser.listen((currentUser) => {
          const profile = getCurrentUserProfile(currentUser);
          onUpdateUserProfile(profile);
        });
      },
      (error) => {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

export function onSignInClick() {
  gapi.auth2.getAuthInstance().signIn();
}

export function onSignOutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function getPresentationUrl(presentationId) {
  return `https://docs.google.com/presentation/d/${presentationId}`;
}

function generateSlideRequests({ slideId, title, subtitle, layouts }) {
  const titleLayout = layouts.find(
    (layout) => layout.layoutProperties.name === "TITLE"
  );

  if (!titleLayout) {
    return []; // TODO: return text box shape if layout does not exist
  }

  const pageTitleId = `page_title_id_${slideId}`;
  const pageSubtitleId = `page_subtitle_id_${slideId}`;
  const pageSlideNumberId = `page_slide_number_id_${slideId}`;

  return [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: {
          predefinedLayout: "TITLE",
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "CENTERED_TITLE",
            },
            objectId: pageTitleId,
          },
          {
            layoutPlaceholder: {
              type: "SUBTITLE",
            },
            objectId: pageSubtitleId,
          },
          {
            layoutPlaceholder: {
              type: "SLIDE_NUMBER",
            },
            objectId: pageSlideNumberId,
          },
        ],
      },
    },
    {
      insertText: {
        objectId: pageTitleId,
        text: title,
      },
    },
    {
      insertText: {
        objectId: pageSubtitleId,
        text: subtitle,
      },
    },
  ];
}

function generateScreenRequests({ screen, pageSize }) {
  const {
    id: screenId,
    name: screenName,
    image: {
      original_url: screenUrl,
      width: screenWidth,
      height: screenHeight,
    },
  } = screen;

  const {
    width: { magnitude: pageWidth, unit: pageDimensionsUnit },
    height: { magnitude: pageHeight },
  } = pageSize;

  const pageId = `page_id_${screenId}`;
  const titleId = `${pageId}_title`;
  const imageId = `${pageId}_image`;
  return [
    // Add a slide for screen
    {
      createSlide: {
        objectId: pageId,
      },
    },
    // Add screen image
    {
      createImage: {
        objectId: imageId,
        url: screenUrl,
        elementProperties: getScreenImageProperties({
          pageId,
          width: screenWidth,
          height: screenHeight,
          pageSize,
        }),
      },
    },
    // Add screen name
    {
      createShape: {
        objectId: titleId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: pageId,
          size: {
            height: {
              magnitude: pageHeight / 12,
              unit: pageDimensionsUnit,
            },
            width: {
              magnitude: pageWidth,
              unit: pageDimensionsUnit,
            },
          },
        },
      },
    },
    {
      insertText: {
        objectId: titleId,
        text: screenName,
      },
    },
  ];
}

function generateSectionRequests({ section, index, pageSize, layouts }) {
  const {
    id: sectionId,
    name: sectionName,
    description: sectionDescription,
    screens: sectionScreens,
  } = section;

  let sectionRequests = [];

  // If screens do not have a section, do not add title page slide for them
  if (section.id !== "default") {
    sectionRequests = generateSlideRequests({
      slideId: sectionId,
      title: sectionName,
      subtitle: sectionDescription,
      layouts,
    });
  }

  const screenRequests = sectionScreens.map((screen) =>
    generateScreenRequests({ screen, pageSize })
  );

  return sectionRequests.concat(screenRequests);
}

function generateLastSlideRequests({
  slideId,
  title,
  subtitle,
  layouts,
  pageSize,
}) {
  const requests = generateSlideRequests({ slideId, title, subtitle, layouts });

  const {
    width: { magnitude: pageWidth, unit: pageDimensionsUnit },
    height: { magnitude: pageHeight },
  } = pageSize;

  const textId = `${slideId}_text`;
  return requests.concat([
    // Add screen name
    {
      createShape: {
        objectId: textId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            height: {
              magnitude: pageHeight / 12,
              unit: pageDimensionsUnit,
            },
            width: {
              magnitude: pageWidth,
              unit: pageDimensionsUnit,
            },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateY: (pageHeight / 12) * 11,
            unit: pageDimensionsUnit,
          },
        },
      },
    },
    {
      insertText: {
        objectId: textId,
        text: "Crafted with Zeplin Slides",
      },
    },
    {
      updateParagraphStyle: {
        objectId: textId,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    },
    {
      updateTextStyle: {
        objectId: textId,
        textRange: {
          type: "FIXED_RANGE",
          startIndex: 13,
          endIndex: 27,
        },
        style: {
          link: {
            url: APP_URL,
          },
        },
        fields: "link",
      },
    },
  ]);
}

export async function createPresentationFromProject(project) {
  const {
    id: projectId,
    name: projectName,
    updated: projectUpdateTimestamp,
  } = project;

  try {
    // Create presentation
    const createResponse = await gapi.client.slides.presentations.create({
      title: projectName,
    });

    console.log("Presentation created: ", createResponse.result);

    const {
      result: {
        presentationId,
        pageSize,
        layouts,
        slides: [{ objectId: firstSlideId } = {}],
      },
    } = createResponse;

    // Delete first slide
    const deleteRequest = {
      deleteObject: {
        objectId: firstSlideId,
      },
    };

    // Generate first slide for project
    const projectSlideRequests = generateSlideRequests({
      slideId: projectId,
      title: projectName,
      subtitle: moment(projectUpdateTimestamp * 1000).format("ll"),
      layouts,
    });

    // Generate section title pages & section screens slides
    const projectSections = await fetchProjectScreensGroupedBySection(
      projectId
    );
    const sectionsSlideRequests = projectSections.flatMap((section, index) =>
      generateSectionRequests({ section, index, pageSize, layouts })
    );

    // Generate last slide
    const lastSlideRequests = generateLastSlideRequests({
      slideId: "last_slide",
      title: "~Fin~",
      layouts,
      pageSize,
    });

    const requests = [
      firstSlideId ? deleteRequest : null,
      projectSlideRequests,
      sectionsSlideRequests,
      lastSlideRequests,
    ].flat();

    const updateResponse = await gapi.client.slides.presentations.batchUpdate({
      presentationId,
      requests,
    });

    console.log("Updated presentation:", updateResponse.result);

    return getPresentationUrl(presentationId);
  } catch (errorResponse) {
    return errorResponse.result;
  }
}
