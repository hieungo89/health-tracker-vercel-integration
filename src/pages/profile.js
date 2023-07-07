import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
// import { getServerAuthSession } from "../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useFormatter } from "next-intl";
import Link from "next/link";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [age, setAge] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const format = useFormatter();

  const getData = async () => {
    const { data } = await axios.get(`/api/user?email=${session?.user.email}`);
    setUserProfile(data);
  };

  const date = () => {
    const dateTime = userProfile.birthday;
    const now = new Date().toISOString();
    const formatted = format.relativeTime(dateTime, now).replace("ago", "old");
    setAge(formatted);
  };

  useEffect(() => {
    if (!session) return;
    getData();
  }, [session]);

  useEffect(() => {
    if (!userProfile) return;
    date();
  }, [userProfile]);

  if (status === "loading") {
    return <Layout>...Loading</Layout>;
  }

  if (status === "unauthenticated") router.push("/");

  return (
    <>
      <Head>
        <title>Health Tracker - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div>
          <div className="flex justify-center items start">
            <div className="rounded border w-32 h-32 mr-6">
              <img
                src={userProfile.image}
                alt="profile"
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col">
              <div>
                Name: {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="py-4">Email: {userProfile.email}</div>
              <div>Age: {age}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 my-12">
            <div className="col-span-4">
              <span className="text-2xl">Your Dietary Goals:&nbsp;</span>
              {userProfile.dietaryGoals}
            </div>
            <div className="col-span-2">
              <span className="text-2xl">
                Current Dietary Restrictions:&nbsp;
              </span>
              {userProfile.dietaryRestrictions
                ? userProfile.dietaryRestrictions
                : "none"}
            </div>
            <div className="col-span-2">
              <span className="text-2xl">Health Complications:&nbsp;</span>
              {userProfile.healthComplications}
            </div>
          </div>
        </div>

        <div>
          Input data
          <button className="p-2 border rounded m-4 hover:border-black hover:bg-green-400">
            <Link href="/data/addHealthData">Input Wellness Data</Link>
          </button>
          <button className="p-2 border rounded m-4 hover:border-black hover:bg-green-400">
            Input Meals
          </button>
        </div>

        <div>
          View my Progress
          <button className="p-2 border rounded m-4 hover:border-black hover:bg-green-400">
            Exercise/Sleep/Weight
          </button>
          <button className="p-2 border rounded m-4 hover:border-black hover:bg-green-400">
            Meals
          </button>
        </div>
      </Layout>
    </>
  );
};

export default Profile;

// export async function getServerSideProps(ctx) {
//   const session = await getServerAuthSession(ctx.req, ctx.res);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user: session.user,
//     },
//   };
// }