import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
  generateTailoredResume,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../../interview/interview.context.jsx";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return response.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  };

  const getReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return response.interviewReports;
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    let response = null;
    try {
      console.log("🚀 Requesting interview report for:", interviewReportId);
      response = await generateResumePdf({ interviewReportId });

      console.log("✅ Response received, type:", typeof response);
      console.log("📦 Response size:", response?.size || response?.length);

      if (!response || response.size === 0) {
        throw new Error("Empty response from server");
      }

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "text/plain" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `interview-report-${interviewReportId}.txt`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Download triggered successfully");
    } catch (error) {
      console.error("❌ getResumePdf Error:", error);
      console.error("📋 Error message:", error.message);
      alert(`Failed to generate interview report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTailoredResume = async (interviewReportId) => {
    setLoading(true);
    let response = null;
    try {
      console.log("🚀 Requesting tailored resume for:", interviewReportId);
      response = await generateTailoredResume({ interviewReportId });

      console.log("✅ Response received, type:", typeof response);
      console.log("📦 Response size:", response?.size || response?.length);

      if (!response || response.size === 0) {
        throw new Error("Empty response from server");
      }

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "text/plain" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tailored-resume-${interviewReportId}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Download triggered successfully");
    } catch (error) {
      console.error("❌ getTailoredResume Error:", error);
      console.error("📋 Error message:", error.message);
      alert(`Failed to generate tailored resume: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    getTailoredResume,
  };
};
