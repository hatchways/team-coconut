const sgMail = require("@sendgrid/mail");
const ClientError = require("../common/ClientError");

sgMail.setApiKey(process.env.EMAIL_API_KEY);

const sendEmail = async (recipient, template, templateData) => {
  try {
    const msg = {
      to: recipient,
      from: process.env.EMAIL_SENDER,
      templateId: template,
      dynamic_template_data: templateData,
    };
    await sgMail.send(msg);
  } catch (error) {
    throw new ClientError(error.message, "Couldn't send an email", 502);
  }
};

module.exports = { sendEmail };
