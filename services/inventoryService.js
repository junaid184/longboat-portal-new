import { fetchApi } from "../fetchApi";
import { TicketMasterAPIKey } from "../utils/constant";

export const fetchTicketMasterMetaData = async ({
  keyword,
  page,
  type,
  startTime,
  endTime,
  token,
}) => {
  const formatDate = (date) => moment(date).format("YYYY-MM-DDTHH:mm:ss[Z]");

  let endPoint = "";
  let params = {
    apikey: TicketMasterAPIKey,
    keyword: encodeURIComponent(keyword),
    size: 200,
    page,
    locale: "*",
    startDateTime: formatDate(startTime),
    endDateTime: formatDate(endTime),
  };

  switch (type) {
    case 1:
      endPoint = "discovery/v2/attractions";
      // params.source = "ticketmaster";
      // params.preferredCountry = "us";
      break;
    case 2:
      endPoint = "discovery/v2/venues";
      // params.source = "ticketmaster";
      // params.preferredCountry = "us";
      break;
    case 3:
      endPoint = "discovery/v2/events";
      break;
    case 4:
      endPoint = "discovery/v2/events";
      params.attractionId = keyword;
      delete params.keyword; // Remove keyword when using attractionId
      break;
    case 5:
      endPoint = "discovery/v2/events";
      params.venueId = keyword;
      delete params.keyword; // Remove keyword when using venueId
      break;
    default:
      console.error("Invalid type provided");
      return [null, "Invalid type"];
  }

  try {
    const [data, error] = await fetchApi({
      method: "GET",
      url: `${process.env.NEXT_Ticket_BaseURL}/api/${endPoint}`,
      endPoint,
      params,
      token,
    });
    

    if (error) {
      console.error("Error fetching TicketMaster data:", error);
      return [null, error];
    }

    return [data, null];
  } catch (err) {
    console.error("Unexpected error:", err);
    return [null, err];
  }
};
