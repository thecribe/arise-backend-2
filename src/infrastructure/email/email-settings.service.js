import { GeneralSettings } from "../../database/models/GeneralSettings.js";

const parseLogo = (logo) => {
  if (!logo) return null;

  try {
    const parsedLogo = typeof logo === "string" ? JSON.parse(logo) : logo;

    return parsedLogo?.document_url || null;
  } catch (error) {
    console.error("Failed to parse organisation logo:", error);
    return null;
  }
};

const getEmailSettings = async () => {
  const settings = await GeneralSettings.findOne({
    attributes: [
      "organisation_name",
      "site_name",
      "description",
      "website_url",
      "organisation_email",
      "recruitment_email",
      "telephone",
      "address",
      "country",
      "postcode",
      "logo",
    ],
    raw: true,
  });

  if (!settings) {
    throw new Error("Organisation settings not found");
  }

  return {
    organisationName: settings.organisation_name || "Arise",
    siteName: settings.site_name || "Arise Recruitment",
    description: settings.description || "",
    websiteUrl: settings.website_url || null,
    organisationEmail: settings.organisation_email || null,
    recruitmentEmail: settings.recruitment_email || null,
    telephone: settings.telephone || null,
    address: settings.address || null,
    country: settings.country || null,
    postcode: settings.postcode || null,
    logoUrl: parseLogo(settings.logo),
  };
};

export { getEmailSettings };
