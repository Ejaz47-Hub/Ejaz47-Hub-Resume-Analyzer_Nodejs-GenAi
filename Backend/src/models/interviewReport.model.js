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

 const 