"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api"; // Adjusted path
// Id import might not be directly needed here if only passing interview._id of type string
// but good for type safety if we were to use the Id type explicitly for interviewId prop
// import { Id } from "../../../../../convex/_generated/dataModel";

function MeetingPage() {
  const { id: streamCallId } = useParams(); // Renamed for clarity
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(streamCallId);

  const interview = useQuery(
    api.interviews.getInterviewByStreamCallId,
    streamCallId ? { streamCallId: streamCallId as string } : "skip"
  );

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading || (streamCallId && interview === undefined)) {
    return <LoaderUI />;
  }

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  if (streamCallId && !interview) { // interview is null if not found, undefined if loading (handled above)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Interview details not found for this meeting.</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          // Ensure interview and interview._id are available before rendering MeetingRoom
          interview && <MeetingRoom interviewId={interview._id} />
        )}
      </StreamTheme>
    </StreamCall>
  );
}
export default MeetingPage;
