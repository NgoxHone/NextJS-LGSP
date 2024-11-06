"use client";
// import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import SignIn from "./auth/signin/page";
import { useRecoilState } from "recoil";
import { accessTokenState } from "../../utilities/Atom/atom";
import dynamic from "next/dynamic";
// export const metadata: Metadata = {
//   title: "Thống kê request LGSP",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };
const SignIn = dynamic(() => import("./auth/signin/page"), { ssr: false });
const DefaultLayout = dynamic(
  () => import("@/components/Layouts/DefaultLayout"),
  { ssr: false },
);
const ECommerce = dynamic(() => import("@/components/Dashboard/Dashboard"), {
  ssr: true,
});
export default function Home() {
  const [accessToken] = useRecoilState(accessTokenState);

  return (
    <>
      {!accessToken ? (
        <SignIn />
      ) : (
        <DefaultLayout>
          <ECommerce />
        </DefaultLayout>
      )}
    </>
  );
}
