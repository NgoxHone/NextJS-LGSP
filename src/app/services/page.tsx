"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRecoilState } from "recoil";
import { accessTokenState, optionEnviroment } from "../../../utilities/Atom/atom";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { data1 } from "../../components/Dashboard/body";
import data from "../../components/Dashboard/data";
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
  today.setHours(23, 59, 59, 999);

  // Add 24 hours (in milliseconds) to get the end of tomorrow
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // Convert to ISO string and adjust for timezone
  const localISOTime = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);

  return localISOTime;
};

const getLastMonthDate = () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return lastMonth.toISOString().split("T")[0];
};
const ServicesPage = () => {
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const [documents, setDocuments] = useState(data);
  const [accessToken] = useRecoilState(accessTokenState);
  const [loading, setLoading] = useState(true);

  const [endDate, setEndDate] = useState(
    convertDateToMilliseconds(getTodayDate()),
  );
  const [startDate, setStartDate] = useState(
    null
  );
  const handleStartDateChange = (date) => {
    setStartDate(convertDateToMilliseconds(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(convertDateToMilliseconds(date));
  };
  const fetchDocuments = () => {
    setLoading(true);
    fetchData(data1(startDate, endDate, selectedEnv), setDocuments).finally(
      () => { },
        setLoading(false),
    );
  };
  useEffect(() => fetchDocuments(), [startDate, endDate, selectedEnv]);
  return (
    <>
      {!accessToken ? (
        <SignIn />
      ) : (
        <DefaultLayout>
          <Breadcrumb pageName="Dịch vụ" />

          <TableFive
            // xuatEx={false}
            loading={loading}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            data={documents}
            search={false}
          // lienthong={false}
          // title="Thống kê gửi nhận văn bản"
          />
        </DefaultLayout>
      )}
    </>
  );
};

export default ServicesPage;
