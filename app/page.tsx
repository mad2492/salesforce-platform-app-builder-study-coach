import type { Metadata } from "next";
import StudyCoach from "./StudyCoach";

export const metadata: Metadata = {
  title: "Builder Bench | Platform App Builder Study Coach",
  description:
    "A private, adaptive study coach for the Salesforce Certified Platform App Builder exam.",
};

export default function Home() {
  return <StudyCoach />;
}

