const { sendEmail } = require("../utils/emailSender");
const User = require("../models/User");

const sendInvitation = async (userId, gameId, email) => {
  //TODO check if gameId exists

  const userInviter = await User.findById(userId);

  const emailTemplateId = process.env.EMAIL_TEMPLATE_ID;
  const emailTemplateData = {
    link: `${process.env.APP_URL}/game/${gameId}?email=${email}`,
    inviter: userInviter.name,
  };
  await sendEmail(email, emailTemplateId, emailTemplateData);
};

module.exports = { sendInvitation };
