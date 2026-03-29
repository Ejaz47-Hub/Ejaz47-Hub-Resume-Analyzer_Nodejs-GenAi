import { createContext, useState } from "react";

// ✅ Create Context
export const InterviewContext = createContext();

// ✅ Provider
export const InterviewProvider = ({ children }) => {
    const [interviewReport, setInterviewReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider
            value={{
                interviewReport,
                setInterviewReport,
                loading,
                setLoading,reports,setReports
            }}
        >
            {children}
        </InterviewContext.Provider>
    );
};