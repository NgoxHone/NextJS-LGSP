"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRecoilState } from "recoil";
import {
  accessTokenState,
  optionEnviroment,
} from "../../../utilities/Atom/atom";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { TotalPN2 } from "../../components/Dashboard/body";
import { dataApp } from "../../components/Dashboard/data";
import {
  convertDateToMilliseconds,
  fetchData,
  getTimestampRanges,
} from "../../../utilities/GlobalFunction";
const SignIn = dynamic(() => import("../auth/signin/page"), { ssr: false });
const DefaultLayout = dynamic(
  () => import("@/components/Layouts/DefaultLayout"),
  { ssr: false },
);
const TableFive = dynamic(() => import("@/components/Tables/TableFive"), {
  ssr: true,
});
const { today, yesterday } = getTimestampRanges();
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getLastMonthDate = () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return lastMonth.toISOString().split("T")[0];
};
const ApplicationsPage = () => {
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const [documents, setDocuments] = useState(dataApp);
  const [accessToken] = useRecoilState(accessTokenState);
  const [endDate, setEndDate] = useState(
    convertDateToMilliseconds(getTodayDate()),
  );
  const [startDate, setStartDate] = useState(
    convertDateToMilliseconds(getLastMonthDate()),
  );
  const handleStartDateChange = (date) => {
    setStartDate(convertDateToMilliseconds(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(convertDateToMilliseconds(date));
  };
  const fetchDocuments = () => {
    // setLoading(true);
    fetchData(TotalPN2(startDate, endDate, selectedEnv), setDocuments).finally(
      () => {},
      //   setLoading(false),
    );
  };
  console.log(documents);
  useEffect(() => fetchDocuments(), [startDate, endDate, selectedEnv]);
  return (
    <>
      {!accessToken ? (
        <SignIn />
      ) : (
        <DefaultLayout>
          <Breadcrumb pageName="Applications" />

          <TableFive
            // xuatEx={false}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            data={documents}
            search={false}
            app={true}
            // lienthong={false}
            // title="Thống kê "
          />
        </DefaultLayout>
      )}
    </>
  );
};

export default ApplicationsPage;
