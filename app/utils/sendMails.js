import sendForgotPasswordTemplate from './templates/send.forgot.password';
import sendResetSuccessfulTemplate from './templates/reset.success';
import sendPasswordChangedSuccessfulTemplate from './templates/change.password.success';
import createUserSuccessfulTemplate from './templates/createTutor';
import sendRequestDemoTemplate from './templates/requestDemo';
import sendComplaintMailTemplate from './templates/complaintMail';
import sendCertificatePdfEmailTemplate from './templates/pdfEmail';
import sendWeeklyGoalsEmailTemplate from './templates/weeklyGoal';
import sendPrivateUserEmailTemplate from './templates/privateUser';
import sendUserGroupTemplate from './templates/groupInvitation';
import sendStudentLiveMailTemplate from './templates/liveMail';

const sendMails = {
  sendForgotPasswordTemplate: (first_name, email,
    code) => sendForgotPasswordTemplate(first_name, email,
    code),

  sendRequestDemoTemplate: (name, email, country, role) => sendRequestDemoTemplate(name, email, country, role),

  sendResetSuccessfulTemplate: (email) => sendResetSuccessfulTemplate(email),

  sendPasswordChangedSuccessfulTemplate: (email) => sendPasswordChangedSuccessfulTemplate(email),
  createUserSuccessfulTemplate: (first_name, email, password, user_type) => createUserSuccessfulTemplate(first_name, email, password, user_type),

  sendCertificatePdfEmailTemplate: (first_name, lastname, course) => sendCertificatePdfEmailTemplate(first_name, lastname, course),

  sendComplaintMailTemplate: (first_name, last_name, email, phone_number,
    user_type, feedback) => sendComplaintMailTemplate(first_name, last_name, email, phone_number, user_type, feedback),

  sendWeeklyGoalsEmailTemplate: (first_name, lastname, email) => sendWeeklyGoalsEmailTemplate(first_name, lastname, email),

  sendPrivateUserEmailTemplate: (password) => sendPrivateUserEmailTemplate(password),

  sendUserGroupTemplate: (firstName, groupName, inviterName) => sendUserGroupTemplate(firstName, groupName, inviterName),

  // eslint-disable-next-line arrow-body-style
  sendStudentLiveMailTemplate: (date, time, link, googleCal, outlook, title) => {
    return sendStudentLiveMailTemplate(date, time, link, googleCal, outlook, title);
  },
};
export default sendMails;
