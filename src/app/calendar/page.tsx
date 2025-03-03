"use client"
// import Calendar from "@/components/Calender";
import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../utilities/Atom/atom";
import Table from "@/components/Tables/TableFive";
import TableFour from "@/components/Tables/TableFour";
// import SignIn from "../auth/signin/page";
// export const metadata: Metadata = {
//   title: "Thống kê request LGSP",
//   description:
//     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
// };
const SignIn = dynamic(() => import("../auth/signin/page"), { ssr: false });
const DefaultLayout = dynamic(
  () => import("@/components/Layouts/DefaultLayout"),
  { ssr: false },
);
const Calendar = dynamic(
  () => import("@/components/Calender"),
  { ssr: true },
);
const CalendarPage = () => {
  const [accessToken] = useRecoilState(accessTokenState);
  return (<>
    {!accessToken ? (
      <SignIn />
    ) : (
      <DefaultLayout>
        <Calendar />
        {/* <Table
            xuatEx={false}
            // onStartDateChange={handleStartDateChange2}
            // onEndDateChange={handleEndDateChange2}
            // data={[]}
            search={false}
            title="Thống kê gửi nhận văn bản"
          />
        <TableFour/> */}
      </DefaultLayout>
    )}
  </>

  );
};

export default CalendarPage;
