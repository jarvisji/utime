var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  var userSchema = new Schema({
    mobile: {type: String, index: true, unique: true}, // maybe mobile, openid, username.
    password: String,
    salt: String,
    linkedTo: String, // teacher/parent/student
    linkedId: String,
    wechat: {
      subscribe: Number,
      openid: {type: String, index: true, unique: true},
      nickname: String,
      sex: Number,
      language: String,
      city: String,
      province: String,
      country: String,
      headimgurl: String,
      subscribe_time: Date,
      remark: String,
      groupid: Number
    },
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  });
  userSchema.pre('update', function () {
    this.update({}, {$set: {lastModified: new Date()}});
  });

  var classSchema = new Schema({
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
    registerGrade: String,
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  });
  classSchema.pre('update', function () {
    this.update({}, {$set: {lastModified: new Date()}});
  });
  var teacherSchema = new Schema({
    classIds: [String],
    name: String,
    sex: String,
    birthday: Date,
    mobile: String,
    QQ: String,
    email: String,
    teachStartDate: Date,
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  });
  teacherSchema.pre('update', function () {
    this.update({}, {$set: {lastModified: new Date()}});
  });

  var studentSchema = new Schema({
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
    joinClassDate: Date,
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  });
  studentSchema.pre('update', function () {
    this.update({}, {$set: {lastModified: new Date()}});
  });

  var courseSchema = new Schema({
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
    endTime: Date,
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  });
  courseSchema.pre('update', function () {
    this.update({}, {$set: {lastModified: new Date()}});
  });

  return {
    userSchema: userSchema,
    classSchema: classSchema,
    teacherSchema: teacherSchema,
    studentSchema: studentSchema,
    courseSchema: courseSchema
  }
};
