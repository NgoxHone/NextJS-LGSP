"use client"
import Chart from "@/components/Charts/page";
import React from "react";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../../utilities/Atom/atom";
import dynamic from "next/dynamic";
const SignIn = dynamic(() => import("../auth/signin/page"), { ssr: false });
const DefaultLayout = dynamic(
  () => import("@/components/Layouts/DefaultLayout"),
  { ssr: false },
);
const BasicChartPage: React.FC = () => {
  const [accessToken] = useRecoilState(accessTokenState);
  return (<>
    {!accessToken ? (
      <SignIn />
    ) : (
      <DefaultLayout>
        <Chart />
      </DefaultLayout>
    )}
  </>);
}
export default BasicChartPage;
