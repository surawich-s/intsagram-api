require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/user');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:5000/api/v1/auth/google/callback',
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, done) {
			// console.log(profile._json);
			const { email, name, picture } = await profile._json;
			await User.findOne({ email: email }, async (err, user) => {
				if (err) throw err;
				if (user) {
					done(null, user);
				} else {
					new User({
						email,
						name,
						picture,
					})
						.save()
						.then((newUser) => {
							done(null, newUser);
						});
				}
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id).then((user) => {
		done(null, user);
	});
});
