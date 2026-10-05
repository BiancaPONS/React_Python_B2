import { useSearchParams } from "react-router-dom";

import InvalidResetRequest from "../components/InvalidResetRequest";
import ResetPasswordForm from "../components/ResetPasswordForm";


function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const challengeIdValue = searchParams.get("challenge_id");
  const challengeId = Number(challengeIdValue);

  const isValidChallengeId =
    challengeIdValue !== null
    && Number.isInteger(challengeId)
    && challengeId > 0;

  if (!isValidChallengeId) {
    return <InvalidResetRequest />;
  }

  return <ResetPasswordForm challengeId={challengeId} />;
}


export default ResetPasswordPage;