import Button from "@components/Button";
import { DietaryGoalsCard, RestrictionsCard } from "@components/Cards";
import { Setting } from "@components/Icons";
import Layout from "@components/Layout";
import MealData from "@data/mealData";
import SEW from "@data/sew";
import axios from "axios";
import { intervalToDuration, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [age, setAge] = useState("");
  const [sewData, setSewData] = useState(false);
  const [mealsData, setMealsData] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const getData = async () => {
    const { data } = await axios.get(`/api/user?email=${session?.user.email}`);
    setUserProfile(data);
    setAge(data.birthday);
  };

  const date = () => {
    const birthday = parseISO(userProfile.birthday.slice(0, 10));

    const ageDifference = intervalToDuration({
      start: birthday,
      end: new Date(),
    });

    if (ageDifference.years > 1) {
      setAge(ageDifference.years + " years old");
    } else if (ageDifference.years === 1) {
      setAge(ageDifference.years + " year old");
    } else {
      if (ageDifference.months !== 1) {
        setAge(ageDifference.months + " months old");
      } else {
        setAge(ageDifference.months + " month old");
      }
    }
  };

  useEffect(() => {
    if (!session) return;
    getData();
  }, [session]);

  useEffect(() => {
    if (!age) return;
    date();
  }, [age]);

  if (!userProfile) router.push("/");

  if (userProfile.firstName)
    return (
      <>
        <Head>
          <title>HT - Profile</title>
          <meta name="profile" content="A full display of the user profile." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Layout className="flex flex-col items-center bg-baby-blue">
          {/* //! Profile Photo, Name, Email, Age, Height, Settings */}
          <div className="flex w-full max-w-3xl">
            <div className="flex w-full justify-evenly sm:flex-col sm:items-center">
              <div className="w-40 h-auto">
                <img
                  src={userProfile.image}
                  alt="profile-pic"
                  className="w-full h-auto rounded-full"
                />
              </div>

              <div className="flex flex-col sm:text-sm sm:pt-2">
                <div>
                  <b>Name:</b> {userProfile.firstName} {userProfile.lastName}
                </div>
                <div className="py-4 md:py-1">
                  <b>Email:</b> {userProfile.email}
                </div>
                <div className="pb-4 md:py-1">
                  <b>Age:</b> {age}
                </div>
                <div>
                  <b>Height:</b>
                  {userProfile.height.height_ft}ft.{" "}
                  {userProfile.height.height_in}in.
                </div>
              </div>
            </div>

            <Link
              href={{
                pathname: "/AccountSettings",
                query: {
                  type: "update",
                },
              }}
            >
              <Setting className="p-0.5 ml-4 md:text-xl sm:p-0 sm:-ml-10" />
            </Link>
          </div>

          {/* //! Dietary & Health */}
          <div className="flex p-2 my-12 w-full max-w-3xl sm:space-y-4 sm:flex-col sm:items-center">
            <div className="w-1/3 sm:w-full">
              <DietaryGoalsCard goals={userProfile?.dietaryGoals} />
            </div>
            <div className="flex flex-col w-2/3 pl-4 space-y-4 sm:w-full sm:pl-0">
              <RestrictionsCard
                name="Current Dietary Restrictions"
                description={userProfile?.dietaryRestrictions}
              />
              <RestrictionsCard
                name="Health Complications"
                description={userProfile?.healthComplications}
              />
            </div>
          </div>

          <div className="flex w-full max-w-3xl justify-between sm:flex-col">
            {/*//! Input Data Section */}
            <div className="flex flex-col items-center py-2 space-y-4">
              <div className="text-xl font-bold uppercase underline sm:text-base">
                Input data
              </div>
              <Button
                content="Wellness Data"
                handleClick={() => router.push("/data/addHealthData")}
              />
              <Button
                content="Meals"
                handleClick={() => router.push("/data/addMealData")}
              />
            </div>

            {/*//! Show Data Section */}
            <div className="flex flex-col items-center py-2 space-y-4">
              <div className="text-xl font-bold uppercase underline sm:text-base">
                View my Progress
              </div>
              <Button
                content="Wellness Data"
                handleClick={() => {
                  setMealsData(false);
                  setSewData(!sewData);
                }}
              />
              <Button
                content="Meals"
                handleClick={() => {
                  setSewData(false);
                  setMealsData(!mealsData);
                }}
              />
            </div>
          </div>

          <div className="w-screen">
            {sewData && <SEW />}
            {mealsData && <MealData />}
          </div>
        </Layout>
      </>
    );
};

export default Profile;
