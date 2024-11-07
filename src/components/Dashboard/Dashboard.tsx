"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import axios from "axios";
import data from "./data";
import TableTwo from "../Tables/TableTwo";
import TableThree from "../Tables/TableThree";
import TableFour from "../Tables/TableFour";
import TableFive from "../Tables/TableFive";
import { useRouter } from "next/navigation";
import {
  checkResponses,
  convertDateToMilliseconds,
  fetchAllCorrelationIds,
  fetchData,
  fetchData2,
  fetchData3,
  getTimestampRanges,
} from "../../../utilities/GlobalFunction";
import {
  bodyGetEdoc,
  bodySendEdoc,
  data1,
  dataMM,
  TotalDV,
  TotalPN,
  TotalRequest,
  TotalToday,
} from "./body";
import Calendar from "../Calender";
import { useRecoilState } from "recoil";
import {
  matchingCountState,
  matchingCountState2,
  optionEnviroment,
  optionOptionApp,
} from "../../../utilities/Atom/atom";
const { today, yesterday } = getTimestampRanges();

const getTodayDate = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toISOString();
};

const getLastMonthDate = () => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setHours(0, 0, 0, 0); // Đặt giờ về 0 để có timestamp bắt đầu ngày
  return lastMonth.getTime();
};

const isLevelUp = (today, yesterday) => today > yesterday;
const isLevelDown = (today, yesterday) => today < yesterday;
const calculatePercentageChange = (today, yesterday) => {
  if (!today) return;
  return (
    (Math.round(((today - yesterday) / yesterday) * 10000) / 100).toFixed(2) +
    "%"
  );
};

const ECommerce = () => {
  const router = useRouter();
  const [Total, setTotal] = useState(0);
  const [TotalPNs, setTotalPN] = useState(0);
  const [TotalAPI, setTotalAPI] = useState(0);
  const [loading, setLoading] = useState(true);
  const [TotalAPIToday, setTotalAPIToday] = useState(0);
  const [documents, setDocuments] = useState(data);
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const [selectedOptionApp] = useRecoilState(optionOptionApp);
  const [correlationIds2, setCorrelationIds2] = useState([]);
  const [correlationIds, setCorrelationIds] = useState([]);
  const [matchingCount, setMatchingCount] = useRecoilState(matchingCountState);
  const [matchingCount2, setMatchingCount2] = useRecoilState(matchingCountState2);
  const [loadingEdoc, setLoadingEdoc] = useState(true);
  const [startDate, setStartDate] = useState(getLastMonthDate());
  const [endDate, setEndDate] = useState(
    convertDateToMilliseconds(getTodayDate()),
  );
  const [startDateEdoc, setStartDateEdoc] = useState(getLastMonthDate());
  const [endDate2, setEndDateEdoc] = useState(
    convertDateToMilliseconds(getTodayDate()),
  );
  const [dataSentEdoc, setDataSentEdoc] = useState({
    aggregations: {
      group_by_api: {
        buckets: [
          {
            key: "SentEdoc",
            doc_count: 0,
          },
          {
            key: "GetEdoc",
            doc_count: 0,
          },
        ],
      },
    },
  });

  //functionHandle
  const handleStartDateChange = (date) => {
    setStartDate(convertDateToMilliseconds(date));
  };
  const handleEndDateChange = (date) => {
    setEndDate(convertDateToMilliseconds(date));
  };
  const handleStartDateChange2 = (date) => {
    setStartDateEdoc(convertDateToMilliseconds(date));
  };
  const handleEndDateChange2 = (date) => {
    setEndDateEdoc(convertDateToMilliseconds(date));
  };
  const updateSentEdocCount = (newCount, type) => {
    setDataSentEdoc((prevState) => {
      const updatedBuckets = prevState.aggregations.group_by_api.buckets.map(
        (bucket) => {
          if (bucket.key === type) {
            return { ...bucket, doc_count: newCount };
          }
          return bucket;
        },
      );

      return {
        ...prevState,
        aggregations: {
          ...prevState.aggregations,
          group_by_api: {
            ...prevState.aggregations.group_by_api,
            buckets: updatedBuckets,
          },
        },
      };
    });
  };
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response1 = await fetchData2(
        data1(startDate, endDate, selectedEnv, selectedOptionApp),
        null,
      );

      const response2 = await fetchData2(
        dataMM(startDate, endDate, selectedEnv, selectedOptionApp),
        null,
      );

      const mapCorrelationCounts = (api1Data, api2Data) => {
        const api1Buckets = api1Data.aggregations.group_by_api.buckets;
        const api2Buckets = api2Data.aggregations.group_by_api.buckets;
        const api2Map = new Map();
        api2Buckets.forEach((bucket) => {
          api2Map.set(bucket.key, bucket.unique_correlation_count.value);
        });
        const updatedApi1Buckets = api1Buckets.map((bucket) => {
          const correlationCount = api2Map.get(bucket.key) || 0;
          return {
            ...bucket,
            unique_correlation_count: {
              ...bucket.unique_correlation_count,
              value: correlationCount,
            },
          };
        });

        return {
          ...api1Data,
          aggregations: {
            ...api1Data.aggregations,
            group_by_api: {
              ...api1Data.aggregations.group_by_api,
              buckets: updatedApi1Buckets, // Updated buckets
            },
          },
        };
      };

      const updatedApi1Data = mapCorrelationCounts(response1, response2);

      setDocuments(updatedApi1Data);
    } catch (error) {
      console.error("Error ==>", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTotalRequest = () => {
    fetchData(TotalRequest(selectedEnv), (dataRes) => setTotal(dataRes?.count));
  };

  const fetchTotalPhanMem = () => {
    fetchData(TotalPN, (dataRes) =>
      setTotalPN(dataRes?.aggregations?.application_name_count?.value),
    );
  };

  const fetchTotalAPI = () => {
    fetchData(TotalDV(selectedEnv), (dataRes) =>
      setTotalAPI(dataRes?.aggregations?.application_name_count?.value),
    );
  };

  const fetchTotalAPIToday = () => {
    fetchData(TotalToday(today, yesterday, selectedEnv), (dataRes) =>
      setTotalAPIToday(dataRes?.aggregations?.counts_by_date?.buckets),
    );
  };

  const fetchTotalSentEdoc = () => {
    setLoading(true);
    fetchData(bodySendEdoc(startDateEdoc, endDate2), (dataRes) => {
      updateSentEdocCount(dataRes?.count, "SentEdoc");
      setLoading(false);
    });
  };

  const fetchTotalGetEdoc = () => {
    setLoading(true);
    fetchData(bodyGetEdoc(startDateEdoc, endDate2), (dataRes) => {
      updateSentEdocCount(dataRes?.count, "GetEdoc");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, [startDate, endDate, selectedEnv, selectedOptionApp]);
  useEffect(() => {
    fetchTotalGetEdoc();
    fetchTotalSentEdoc();
  }, [startDateEdoc, endDate2]);
  useEffect(() => {
    fetchTotalRequest();
    fetchTotalPhanMem();
    fetchTotalAPI();
    fetchTotalAPIToday();
  }, [selectedEnv]);
  //Tinh loi Edoc
  useEffect(() => {
    const fetchCorrelationIds = async () => {
      const filters = [];
      if (startDateEdoc && endDate2) {
        filters.push({
          range: {
            date_created: {
              gt: startDateEdoc,
              lt: endDate2,
            },
          },
        });
      }
      setLoadingEdoc(true);
      try {
        const requestData = {
          index: "apim-request-index/_search",
          body: {
            query: {
              bool: {
                filter: filters,
                must: [
                  {
                    match: { full_request_path: "/vdxp-product/1.0/sendEdoc" },
                  },
                  { wildcard: { headers: "*=edoc*" } },
                ],
              },
            },
            aggs: {
              correlation_ids: {
                composite: {
                  size: 20000,
                  sources: [
                    { correlation_id: { terms: { field: "correlation_id" } } },
                  ],
                },
              },
            },
          },
        };

        const ids = await fetchData3(requestData, null, "/api/service");
        setCorrelationIds(ids);
      } catch (err) {
        console.error("Failed to fetch correlation IDs", err);
      } finally {
      }
    };

    fetchCorrelationIds();
  }, [startDateEdoc, endDate2]);
  useEffect(() => {
    const fetchCorrelationIds = async () => {
      const filters = [];
      if (startDateEdoc && endDate2) {
        filters.push({
          range: {
            date_created: {
              gt: startDateEdoc,
              lt: endDate2,
            },
          },
        });
      }
      setLoadingEdoc(true);
      try {
        const requestData = {
          index: "apim-request-index/_search",
          body: {
            size: 0,
            query: {
              bool: {
                filter: filters,
                must: [
                  {
                    match: { full_request_path: "/vdxp-product/1.0/getEdoc" },
                  },
                ],
              },
            },
            aggs: {
              correlation_ids: {
                composite: {
                  size: 50000,
                  sources: [
                    { correlation_id: { terms: { field: "correlation_id" } } },
                  ],
                },
              },
            },
          },
        };

        const ids = await fetchData3(requestData, null, "/api/service");
        console.log(ids)
        setCorrelationIds2(ids);
      } catch (err) {
        console.error("Failed to fetch correlation IDs", err);
      } finally {
      }
    };

    fetchCorrelationIds();
  }, [startDateEdoc, endDate2]);
  useEffect(() => {
    const fetchMatchingResponses = async () => {
      setLoadingEdoc(true);
      try {
        const requestData = {
          index: "apim-response-index/_search",
          body: {
            size: 0,
            query: {
              terms: {
                correlation_id: correlationIds, // Truyền danh sách correlation_id
              },
            },
            aggs: {
              unique_correlation_ids: {
                cardinality: {
                  field: "correlation_id", // Đếm các correlation_id duy nhất
                },
              },
            },
          },
        };

        const response = await axios.post("/api/service", requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const count =
          response.data.aggregations?.unique_correlation_ids?.value || 0;
        setMatchingCount(count);
      } catch (err) {
        console.error("Failed to check responses", err);
      } finally {
        setLoadingEdoc(false);
      }
    };

    if (correlationIds.length > 0) {
      fetchMatchingResponses();
    }
  }, [correlationIds]);
  useEffect(() => {
    const fetchMatchingResponses = async () => {
      setLoadingEdoc(true);
      try {
        const requestData = {
          index: "apim-response-index/_search",
          body: {
            size: 0,
            query: {
              terms: {
                correlation_id: correlationIds2, // Truyền danh sách correlation_id
              },
            },
            aggs: {
              unique_correlation_ids: {
                cardinality: {
                  field: "correlation_id", // Đếm các correlation_id duy nhất
                },
              },
            },
          },
        };

        const response = await axios.post("/api/service", requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const count =
          response.data.aggregations?.unique_correlation_ids?.value || 0;
        setMatchingCount2(count);
      } catch (err) {
        console.error("Failed to check responses", err);
      } finally {
        setLoadingEdoc(false);
      }
    };

    if (correlationIds.length > 0) {
      fetchMatchingResponses();
    }
  }, [correlationIds2]);
  console.log("--->", correlationIds2.length)

  console.log(matchingCount2)
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Request" total={Total.toLocaleString("de-DE")}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          click={() => router.push("/services")}
          title="Dịch vụ"
          total={TotalAPI}
        // rate="4.35%" levelUp
        >
          <svg
            viewBox="0 0 512 512"
            version="1.1"
            className="fill-primary dark:fill-white"
            width="30"
            height="30"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="icon"
                  fill="#3C50E0"
                  transform="translate(42.666667, 34.346667)"
                >
                  <path
                    d="M426.247658,366.986259 C426.477599,368.072636 426.613335,369.17172 426.653805,370.281095 L426.666667,370.986667 L426.666667,392.32 C426.666667,415.884149 383.686003,434.986667 330.666667,434.986667 C278.177524,434.986667 235.527284,416.264289 234.679528,393.025571 L234.666667,392.32 L234.666667,370.986667 L234.679528,370.281095 C234.719905,369.174279 234.855108,368.077708 235.081684,366.992917 C240.961696,371.41162 248.119437,375.487081 256.413327,378.976167 C275.772109,387.120048 301.875889,392.32 330.666667,392.32 C360.599038,392.32 387.623237,386.691188 407.213205,377.984536 C414.535528,374.73017 420.909655,371.002541 426.247658,366.986259 Z M192,7.10542736e-15 L384,106.666667 L384.001134,185.388691 C368.274441,181.351277 350.081492,178.986667 330.666667,178.986667 C301.427978,178.986667 274.9627,184.361969 255.43909,193.039129 C228.705759,204.92061 215.096345,223.091357 213.375754,241.480019 L213.327253,242.037312 L213.449,414.75 L192,426.666667 L-2.13162821e-14,320 L-2.13162821e-14,106.666667 L192,7.10542736e-15 Z M426.247658,302.986259 C426.477599,304.072636 426.613335,305.17172 426.653805,306.281095 L426.666667,306.986667 L426.666667,328.32 C426.666667,351.884149 383.686003,370.986667 330.666667,370.986667 C278.177524,370.986667 235.527284,352.264289 234.679528,329.025571 L234.666667,328.32 L234.666667,306.986667 L234.679528,306.281095 C234.719905,305.174279 234.855108,304.077708 235.081684,302.992917 C240.961696,307.41162 248.119437,311.487081 256.413327,314.976167 C275.772109,323.120048 301.875889,328.32 330.666667,328.32 C360.599038,328.32 387.623237,322.691188 407.213205,313.984536 C414.535528,310.73017 420.909655,307.002541 426.247658,302.986259 Z M127.999,199.108 L128,343.706 L170.666667,367.410315 L170.666667,222.811016 L127.999,199.108 Z M42.6666667,151.701991 L42.6666667,296.296296 L85.333,320.001 L85.333,175.405 L42.6666667,151.701991 Z M330.666667,200.32 C383.155809,200.32 425.80605,219.042377 426.653805,242.281095 L426.666667,242.986667 L426.666667,264.32 C426.666667,287.884149 383.686003,306.986667 330.666667,306.986667 C278.177524,306.986667 235.527284,288.264289 234.679528,265.025571 L234.666667,264.32 L234.666667,242.986667 L234.808715,240.645666 C237.543198,218.170241 279.414642,200.32 330.666667,200.32 Z M275.991,94.069 L150.412,164.155 L192,187.259259 L317.866667,117.333333 L275.991,94.069 Z M192,47.4074074 L66.1333333,117.333333 L107.795,140.479 L233.373,70.393 L192,47.4074074 Z"
                    id="Combined-Shape"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Phần mềm"
          total={TotalPNs}
          click={() => router.push("/applications")}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
              fill=""
            />
            <path
              d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Request hôm nay"
          total={TotalAPIToday?.today?.doc_count?.toLocaleString("de-DE") || 0}
          rate={calculatePercentageChange(
            TotalAPIToday?.today?.doc_count,
            TotalAPIToday?.yesterday?.doc_count,
          )}
          levelUp={isLevelUp(
            TotalAPIToday?.today?.doc_count,
            TotalAPIToday?.yesterday?.doc_count,
          )}
          levelDown={isLevelDown(
            TotalAPIToday?.today?.doc_count,
            TotalAPIToday?.yesterday?.doc_count,
          )}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M416,64H400V48.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,368,48V64H144V48.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,112,48V64H96a64,64,0,0,0-64,64v12a4,4,0,0,0,4,4H476a4,4,0,0,0,4-4V128A64,64,0,0,0,416,64Z"></path>
              <path d="M477,176H35a3,3,0,0,0-3,3V416a64,64,0,0,0,64,64H416a64,64,0,0,0,64-64V179A3,3,0,0,0,477,176ZM224,307.43A28.57,28.57,0,0,1,195.43,336H124.57A28.57,28.57,0,0,1,96,307.43V236.57A28.57,28.57,0,0,1,124.57,208h70.86A28.57,28.57,0,0,1,224,236.57Z"></path>
            </g>
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
        {/* <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">
          <ChartOne />
          {/* <TableOne /> */}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-6 xl:flex-row 2xl:mt-7.5 2xl:gap-7.5">
        <div className="flex w-full flex-col xl:w-2/3">
          <div className="flex-grow">
            <TableFive
              loading={loading}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              data={documents}
              search={false}
              lienthong={false}
            />
          </div>
          {/* <div className="mt-8 w-full">
            <Calendar />
          </div> */}
          <div className="mt-8 w-full">{/* <ChartThree /> */}</div>
        </div>
        <div
          style={{ marginBottom: 30 }}
          className="flex w-full flex-col xl:w-1/3"
        >
          <TableFive
            // loading={loadingEdoc}
            xuatEx={false}
            onStartDateChange={handleStartDateChange2}
            onEndDateChange={handleEndDateChange2}
            data={dataSentEdoc}
            search={false}
            lienthong={true}
            title="Thống kê gửi nhận văn bản"
          />
          <div className="mt-6" />
          <ChatCard />
        </div>
      </div>

      <div className=""></div>
      {/* <div className="mt-4 mb-4">
        <TableFour />
      </div> */}
    </>
  );
};

export default ECommerce;
