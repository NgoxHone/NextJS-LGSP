import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import { formatTimestampToDate } from "../../../utilities/GlobalFunction";
import { useEffect, useState } from "react";
import axios from "axios";
import { bodyLog, dataOption } from './body'
import MultiSelect from "../FormElements/MultiSelect";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";

const ChatCard = () => {
  const [optionData, setOptionData] = useState(null)
  const [selectedOption, setSelectedOption] = useState("HTTTNTW");
  const [data, setData] = useState([])
  // console.log(bodyLog("aa"))
  const fetchData = async () => {
    try {
      const response = await axios({
        method: 'post', url: "/api/service", headers: {
          'Content-Type': 'application/json'
        },
        data: bodyLog(selectedOption)
      });
      const dataRes = response.data;


      setData(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  const fetchOption = async () => {
    try {
      const response = await axios({
        method: 'post', url: "/api/service", headers: {
          'Content-Type': 'application/json'
        },
        data: dataOption
      });
      const dataRes = response.data;


      setOptionData(dataRes);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  useEffect(() => {

    fetchOption();
  }, []);
  useEffect(() => {
    fetchData();
  }, [selectedOption])

  console.log(selectedOption)
  // Hàm xử lý khi người dùng chọn một giá trị mới từ dropdown
  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };
  return (
    <div style={{ height: 800, borderRadius: 7 }} className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">

      <div className="mb-6 px-7.5 flex items-center justify-between">
        {/* <h4 className="text-xl font-semibold text-black dark:text-white">
                <MultiSelect />
        </h4> */}
        <div style={{ alignSelf: 'center' }}>
          {optionData != null && <SelectGroupTwo
            onSelect={handleSelectChange}
            label=""
            options={optionData?.aggregations?.group_by_api?.buckets?.map(i => { return { "value": i.key, "label": i.key } })}
          />}
        </div>


        {/* <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="ml-4 border border-gray-300 rounded-md px-5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-boxdark dark:text-white pr-8"
        >
          {optionData?.aggregations?.group_by_api?.buckets?.map((i, index) => (
            <option value={i.key}>{i.key}</option>
          ))}
        </select> */}

      </div>

      <div style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: 680, width: 350, paddingBottom: 20 }}>
        {data?.hits?.hits?.map((chat, key) => (
          <div
            className={`flex items-center gap-5 px-7.5 py-3 transition-colors duration-200 `}
            key={key}
          >
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p style={{ color: 'gray', fontWeight: 'bold' }}>
                  <span style={{ textAlign: "right", fontStyle: "italic" }} className="text-sm text-gray-200 dark:text-gray-400">
                    {formatTimestampToDate(chat._source.date_created)}
                  </span>
                </p>
                <h5 className="font-medium text-blue-600 dark:text-blue-400">
                  {chat._source.api}
                </h5>

                <p>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
    </div>
  );
};

export default ChatCard;
