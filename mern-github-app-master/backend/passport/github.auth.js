import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

dotenv.config();

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

// Configure Passport to use GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "https://mern-github-app.onrender.com/api/auth/github/callback", // Replace with your actual callback URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ username: profile.username });

                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        profileUrl: profile.profileUrl,
                        avatarUrl: profile.photos[0].value,
                        likedProfiles: [],
                        likedBy: [],
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
