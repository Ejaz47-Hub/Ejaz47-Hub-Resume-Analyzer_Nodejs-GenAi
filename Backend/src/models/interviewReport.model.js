import mongoose from "mongoose";

/**
 * --The user will give this
 * job description schema:String
 * resume text:String
 * self description:String
 * 
 * -- matchscore:Number
 * 
 *-- The ai will give this
 * Technical questions:
 *       [{
 *          question:"",
 *          intention:"",
 *          answer:""
 *      }]
 * behavioral questions: [{
 *          question:"",
 *          intention:"",
 *          answer:""
 *      }]
 * skill gaps:[{
 *      skill : "",
 *      severity : {
 *      type : String,
 *      enum : ["low","medium","high"]       
 *  }
 * }]
 * prepration plan:[{
 *      day : Number,
 *       focus: String,
 *         tasks: [String]
 *  }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,'Technical question is required']
    },
    intention:{
        type:String,
        required: [true,'Intention is required']
    },
    answer:{
        type : String,
        required : [true,"Answer is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
    
    question:{
        type:String,
        required:[true,'Technical question is required']
    },
    intention:{
        type:String,
        required: [true,'Intention is required']
    },
    answer:{
        type : String,
        required : [true,"Answer is required"]
    }

},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required : [true,"Skill is required"]
    },
    severity:{type: String,
    enum : ["low","medium","high"],
    required:[true,"Severity is required"]
}},{
    _id:false
})

const preprationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,'Focus is required']
    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
})

 const interviewReportSChema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String
    },
    selfDescription : {
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preprationPlan:[preprationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[true,"Job title is required"]
    }
 },
 {
    timestamps:true
 })

 const interviewReportModel = mongoose.model("InterviewReport",
    interviewReportSChema
 )

 export default interviewReportModel