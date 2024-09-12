import { BRAND } from "@/types/brand";
import Image from "next/image";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { optionEnviroment, optionService } from "../../../utilities/Atom/atom";
import { dataOption, dataOptionApp } from "../Chat/body";
import { bodyLog } from "./body";
import axios from "axios";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import {
  convertDateToMilliseconds,
  formatTimestampToDate,
  getDatabaseDescription,
} from "../../../utilities/GlobalFunction";
const DetailServices: React.FC = () => {
  const [optionData, setOptionData] = useRecoilState(optionService);
  const [optionDataApp, setOptionDataApp] = useState([]);

  const [selectedOption, setSelectedOption] = useState("Tất cả");
  const [selectedOptionApp, setSelectedOptionApp] = useState("Tất cả");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [selectedEnv] = useRecoilState(optionEnviroment);
  const handleDateChange = (e, setDate) => {
    setDate(e.target.value);
  };

  console.log(
    "ALO ALO",
    bodyLog(
      selectedEnv,
      selectedOption,
      selectedOptionApp,
      convertDateToMilliseconds(startDate),
      convertDateToMilliseconds(endDate),
    ),
  );
  const fetchData = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/service",
        headers: {
          "Content-Type": "application/json",
        },
        data: bodyLog(
          selectedEnv,
          selectedOption,
          selectedOptionApp,
          convertDateToMilliseconds(startDate),
          convertDateToMilliseconds(endDate),
        ),
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
  }, [selectedOption, selectedEnv, selectedOptionApp, startDate, endDate]);

  console.log(selectedOption);
  // Hàm xử lý khi người dùng chọn một giá trị mới từ dropdown
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };
  const handleSelectAppChange = (value: string) => {
    setSelectedOptionApp(value);
  };
  console.log("dt", data);
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col justify-between md:flex-row">
          <div
            className="flex w-full flex-col md:flex-row"
            style={{
              alignSelf: "center",
              justifyContent: "space-evenly",
            }}
          >
            <div className="mb-4 mr-2 w-full md:mb-0 md:w-auto">
              <p style={{ fontFamily: "sans-serif" }}>Dịch vụ</p>
              {optionData != null && (
                <SelectGroupTwo
                  onSelect={handleSelectChange}
                  label=""
                  options={[
                    { value: "Tất cả", label: "Tất cả" },
                    ...(
                      optionData?.aggregations?.group_by_api?.buckets ?? []
                    ).map((i) => ({
                      value: i.key,
                      label: i.key,
                    })),
                  ]}
                />
              )}
            </div>
            <div className="mb-4 w-full md:mb-0 md:w-auto">
              <p style={{ fontFamily: "sans-serif" }}>Phần mềm</p>
              {optionData != null && (
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
              )}
            </div>
            <div className="mb-4 w-full flex-grow md:mb-0 md:w-auto md:ml-2">
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e, setStartDate)}
                className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
              />
            </div>
            <div className="w-full flex-grow md:w-auto md:ml-2">
              <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(e, setEndDate)}
                className="border-gray-400 dark:border-gray-600 dark:text-gray-300 relative z-20 w-full w-full appearance-none rounded rounded-md border border border-stroke bg-transparent px-12 px-4 py-2 py-3 outline-none transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-600 active:border-primary dark:border-form-strokedark dark:bg-boxdark dark:bg-form-input dark:focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {data?.hits?.hits?.map((brand, key) => (
            <div
              className={` ${
                key === data?.hits?.hits?.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >
              <div className="flex items-center gap-1 p-2.5 xl:p-5">
                <p className="hidden items-start font-medium text-black dark:text-white sm:block">
                  {key + 1}.
                </p>
                <div className="items-center p-2.5 xl:p-5">
                  <p style={{ color: "gray", fontWeight: "bold" }}>
                    <span
                      style={{ textAlign: "right", fontStyle: "italic" }}
                      className="text-gray-200 dark:text-gray-400 text-sm"
                    >
                      {formatTimestampToDate(brand?._source.date_created)}
                    </span>
                  </p>
                  <p style={{ fontFamily: "sans-serif" }}>
                    {getDatabaseDescription(brand?._source?.api)}
                  </p>
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {brand?._source?.api} - {brand?._source.am_key_type}
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-600">
                    {brand?._source?.full_request_path}
                  </p>
                  <p className="font-medium text-orange-400 dark:text-orange-400">
                    {brand?._source?.application_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailServices;
