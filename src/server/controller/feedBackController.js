const nodemailer = require('nodemailer');
const FeedBack = require('../model/feedBackModel');

module.exports.addfeedback = async (req, res) => {
    const { feedback, rating, author } = req.body;
    try {
        const newfeedback = new FeedBack({ feedback, rating, author });
        await newfeedback.save();
        res.status(200).json(newfeedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// TO DO:
// - user._id not being sent
// - feedback being sent as undefined
// - feedback module reopens once server successfully sends the email?

module.exports.emailFeedback = async (req, res) => {
    try {
        // Add try block
        const { user, feedback, rating } = req.body;

        // message to send
        const message = `
      <h2> ${user.username} has submitted some feedback.</h2>
      <p><userId: ${user._id}</p>
      <p>User email: ${user.email}</p>
      <p>Feedback: ${feedback}</p> 
      <p>Rating: ${rating}</p>
    `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: 'CodeBooker: New Feedback Received',
            html: message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json('Email sent!');
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (err) {
        // Add catch block to handle exceptions
        console.log(err.message);
        res.status(500).json('Something went wrong...');
    }
};

module.exports.allfeedback = async (req, res) => {
    try {
        const newfeedback = await FeedBack.find();
        res.status(200).json(newfeedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
