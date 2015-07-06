var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  userSchema: new Schema({
    mobile: String,
    password: String,
    salt: String,
    username: String,
    linkedTo: String, // teacher/parent/student
    linkedId: String,
    wxCallback: {
      access_token: String,
      expires_in: Number,
      refresh_token: String,
      openid: String,
      scope: String,
      unionid: String
    }
  }),
  classSchema: new Schema({
    schoolId: String,
    displayName: String,
    grade: Number,
    term: Number,
    classNumber: Number,
    headTeacher: {
      teacherId: String,
      name: String
    },
    registerDate: Date,
    registerGrade: String
  }),
  teacherSchema: new Schema({
    classIds: [String],
    name: String,
    sex: String,
    birthday: Date,
    mobile: String,
    QQ: String,
    email: String,
    teachStartDate: Date
  }),
  studentSchema: new Schema({
    classId: String,
    name: String,
    sex: String,
    birthday: Date,
    parents: [{
      name: String,
      relation: String,
      mobile: String,
      wxId: String
    }],
    homeAddress: String,
    joinClassDate: Date
  }),
  courseSchema: new Schema({
    name: String,
    teacher: {
      teacherId: String,
      name: String
    },
    classId: String,
    grade: Number,
    term: Number,
    dayOfWeek: Number,
    date: Date,
    memo: String,
    startTime: Date,
    endTime: Date
  })
};
