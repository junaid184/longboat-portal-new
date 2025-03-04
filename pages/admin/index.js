import DashboardIcon from "@mui/icons-material/Dashboard";
import Card from "../../components/Card";
import menuItems from "../../components/MenuItems";
import Image from "next/image";
import orderIcon from "../../assets/images/icons/order.png";
import eventIcon from "../../assets/images/events.png";
import { fetchApi } from "../../fetchApi";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/themeContext";
import { Skeleton } from "@mui/material";

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.ajs_anonymous_id;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Pass the token as a prop
  };
}

export default function Dashboard({ token }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Fetch dashboard counts
  const getDashboardApi = async () => {
    const [responseData, error] = await fetchApi({
      method: "GET",
      endPoint: "Dashboard",
      token,
    });

    if (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
      return;
    }

    if (responseData?.data) {
      setCounts(responseData.data);
    } else {
      console.error("Unexpected response format:", responseData);
    }

    setLoading(false);
  };

  useEffect(() => {
    getDashboardApi();
  }, []);

  // Define theme styles
  const themeStyles = {
    backgroundColor: theme === "light" ? "#FFF" : "#333",
    color: theme === "light" ? "#000" : "#FFF",
    iconFilter: theme === "light" ? "invert(0)" : "invert(1)",
  };

  // Section data mapping
  const sections = [
    {
      title: "Orders",
      icon: orderIcon,
      menuKey: "admin1",
      eventTypeMapping: {
        "Total Orders": "totalOrders",
        "Done Orders": "doneOrders",
        "Active Orders": "activeOrders",
        "Pending Orders": "pendingOrders",
      },
    },
    {
      title: "Events",
      icon: eventIcon,
      menuKey: "admin2",
      eventTypeMapping: {
        "Total Events": "totalEvent",
        "Broadcast Events": "broadcastedEvents",
        "Unbroadcast Events": "unbroadcastedEvents",
      },
    },
    // {
    //   title: "Inventory",
    //   icon: inventoryIcon,
    //   menuKey: "admin3",
    //   eventTypeMapping: {
    //     Inventory: "totalInventoryCount", // Replace with actual key if different
    //   },
    // },
  ];

  return (
    <div
      style={{
        backgroundColor: themeStyles.backgroundColor,
        color: themeStyles.color,
      }}
    >
      <Header theme={theme} />

      {/* {loading ? (
        // <div className="text-center text-xl mt-10">Loading...</div>
        <Skeleton variant="circular" width={32} height={32} className="ml-8 mt-3" sx={{ backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0' }} />
      ) : (
        sections.map((section, index) => (
          <DashboardSection
            key={index}
            section={section}
            counts={counts}
            themeStyles={themeStyles}
            loading={loading}
          />
        ))
      )} */}
      {sections.map((section, index) => (
        <DashboardSection
          key={index}
          section={section}
          counts={counts}
          themeStyles={themeStyles}
          loading={loading} // Pass loading state to show skeletons in sections
        />
      ))}

    </div>
  );
}

function Header({ theme }) {
  return (
    <div
      className={`text-4xl font-bold ml-4 p-3 flex items-center ${theme === "light" ? "text-gray-900" : "text-white"
        }`}
    >
      <DashboardIcon
        className={`w-10 h-8 mr-2 ${theme === "light" ? "text-gray-900" : "text-white"
          }`}
      />
      <h1>Dashboard</h1>
    </div>
  );
}

function DashboardSection({ section, counts, themeStyles, loading }) {
  const { title, icon, menuKey, eventTypeMapping } = section;

  return (
    <>
      <SectionHeader icon={icon} title={title} themeStyles={themeStyles} loading={loading} />
      <CardContainer
        items={menuItems[menuKey]}
        counts={counts}
        loading={loading}
        eventTypeMapping={eventTypeMapping}
      />
    </>
  );
}


function SectionHeader({ icon, title, themeStyles, loading,theme }) {
  return (
    <div className="flex items-center">
      {loading ? (
        <Skeleton variant="circular" width={32} height={32} className="ml-8 mt-3" sx={{ backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0' }} />
      ) : (
        <Image
          src={icon}
          alt={`${title} icon`}
          className="w-8 h-8 ml-8 mt-3"
          style={{ filter: themeStyles.iconFilter }}
        />
      )}
      {loading ? (
        <Skeleton width={150} height={40} className="ml-4 mt-3" sx={{
          backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0', // Gray-700 for dark, Gray-300 for light
        }} />
      ) : (
        <h1 className="text-4xl font-bold ml-4 mt-3">{title}</h1>
      )}
    </div>
  );
}

function CardContainer({ items, counts, eventTypeMapping = {}, loading ,theme}) {
  return (
    <div className="flex flex-wrap justify-start px-2 ml-2">
      {items.map(({ title, icon, url }, index) => (
        <div key={index} className="flex-grow basis-1/4 p-2">
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{
                backgroundColor: theme === 'dark' ? '#D3D3D3' : '#e0e0e0', // Gray-700 for dark, Gray-300 for light
              }}
            />
          ) : (
            <Card
              title={title}
              icon={icon}
              url={url}
              count={counts[eventTypeMapping[title]] || 0}
            />
          )}
        </div>
      ))}
    </div>
  );
}
