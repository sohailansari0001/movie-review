import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AppInfoBox, LatestUploads, MostRatedMovies } from "../../components";
import { getAppInfo } from "../../api/admin";

const Dashboard = () => {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  const fetchAppInfo = async () => {
    const { success, message, appInfo } = await getAppInfo();

    if (!success) {
      return toast.error(message);
    }

    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <div className=" grid grid-cols-3 gap-5 p-5">
      <AppInfoBox
        title={"Total Uploads"}
        subtitle={appInfo.movieCount.toLocaleString()}
      />
      <AppInfoBox
        title={"Total Reviews"}
        subtitle={appInfo.reviewCount.toLocaleString()}
      />
      <AppInfoBox
        title={"Total Users"}
        subtitle={appInfo.userCount.toLocaleString()}
      />

      <LatestUploads />
      <MostRatedMovies />
    </div>
  );
};

export default Dashboard;
