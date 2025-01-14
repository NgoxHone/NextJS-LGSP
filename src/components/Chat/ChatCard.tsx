import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import { formatTimestampToDate } from "../../../utilities/GlobalFunction";
import { useEffect, useState } from "react";
import axios from "axios";
import { bodyLog, dataOption, dataOptionApp } from "./body";
import MultiSelect from "../FormElements/MultiSelect";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import { useRecoilState } from "recoil";
import { optionEnviroment, optionService } from "../../../utilities/Atom/atom";

const ChatCard = ({}) => {
  const [optionData, setOptionData] = useRecoilState(optionService);
  const [optionDataApp, setOptionDataApp] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionApp, setSelectedOptionApp] = useState("");

  const [data, setData] = useState([]);
  const [selectedEnv] = useRecoilState(optionEnviroment);

  const fetchData = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: bodyLog(selectedEnv, selectedOption, selectedOptionApp),
      });
      const dataRes = response.data;

      setData(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  const fetchOption = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataOption(selectedEnv),
      });
      const dataRes = response.data;

      setOptionData(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  const fetchOptionApp = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataOptionApp(selectedEnv),
      });
      const dataRes = response.data;

      setOptionDataApp(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  useEffect(() => {
    fetchOption();
    fetchOptionApp();
  }, [selectedEnv]);

  useEffect(() => {
    fetchData();
  }, [selectedOption, selectedEnv, selectedOptionApp]);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };
  const handleSelectAppChange = (value: string) => {
    setSelectedOptionApp(value);
  };
  // useEffect(() => {}, [height]);
  return (
    <div
      style={{ borderRadius: 7 }}
      className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
    >
      <div className="mb-6 flex items-center justify-between px-7.5">
        {/* <h4 className="text-xl font-semibold text-black dark:text-white">
                <MultiSelect />
        </h4> */}
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div className="mr-2">
            {optionData != null && (
              <>
                <label style={{ fontFamily: "sans-serif" }}>Phần mềm</label>

                <SelectGroupTwo
                  onSelect={handleSelectAppChange}
                  label=""
                  options={[
                    { value: "Tất cả", label: "Tất cả" },
                    ...(
                      optionDataApp?.aggregations?.group_by_api?.buckets ?? []
                    ).map((i) => ({
                      value: i.key,
                      label: i.key,
                    })),
                  ]}
                />
              </>
            )}
          </div>

          {/* {optionData != null && (
            <SelectGroupTwo
              onSelect={handleSelectAppChange}
              label=""
              options={[
                { value: "Tất cả", label: "Tất cả" }, 
                ...(
                  optionDataApp?.aggregations?.group_by_api?.buckets ?? []
                ).map((i) => ({
                  value: i.key,
                  label: i.key,
                })),
              ]}
            />
          )} */}
        </div>
      </div>
      {data?.hits?.hits?.length > 0 ? (
        <div
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            // minHeight: "50vh",
            height: "150vh",
            paddingBottom: 20,
            scrollbarWidth: "thin" /* Firefox */,
            // scrollbarColor: "#888 #333" /* Firefox */,
          }}
        >
          {data?.hits?.hits?.map((chat, key) => (
            <div
              className={`flex items-center gap-5 px-7.5 py-3 transition-colors duration-200 `}
              key={key}
            >
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p style={{ color: "gray", fontWeight: "bold" }}>
                    <span
                      style={{ textAlign: "right", fontStyle: "italic" }}
                      className="text-gray-200 dark:text-gray-400 text-sm"
                    >
                      {formatTimestampToDate(chat._source.date_created)}
                    </span>
                  </p>
                  <h5 className="font-medium text-blue-600 dark:text-blue-400">
                    {chat._source.api}
                  </h5>
                  <p>
                    <span className="text-sm text-sm text-pink-600 dark:text-pink-400">
                      {chat._source.am_key_type}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {chat._source.full_request_path}
                    </span>
                  </p>
                  <p>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {chat._source.application_name}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <a
            style={{
              textAlign: "center",
              color: "gray",
              fontStyle: "italic",
              fontFamily: "sans-serif",
            }}
          >
            Không tìm thấy dữ liệu
          </a>
        </div>
      )}
    </div>
  );
};

export default ChatCard;
