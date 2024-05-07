import passport from 'passport';
import GooglePassport from 'passport-google-oauth20';
import FacebookPassport from 'passport-facebook';
import dbConnection from '../database';
import { UserModel } from '../database/models';
import dotenv from 'dotenv';
dotenv.config();

const userRepository = dbConnection.getRepository(UserModel);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  const user = await userRepository.findOneBy(id);
  done(null, user);
});

// initializing Google Strategy
const GoogleStrategy = GooglePassport.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        // check if user is already exit in db
        const existUser = await userRepository.findOneBy({
          googleId: profile.id,
        });

        if (existUser) {
          // already have the user
          console.log('user already exist in db:', existUser);
          done(null, existUser);
        } else {
          // if not , create a new user in db
          const newUser = new UserModel({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            picture: profile.photos[0].value,
            provider: profile.provider,
            isVerified: true,
          });
          const user = await userRepository.save(newUser);
          console.log('User successfully registered');
          done(null, user);
        }
      } catch (error) {
        console.log('error occured while registaring', error);
      }
    }
  )
);

// initialize Facebook Strategy
const FacebookStrategy = FacebookPassport.Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
      profileFields: ['email', 'id', 'name', 'displayName', 'picture'],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // check if user is already exit in db
      const existUser = await userRepository.findOneBy({
        facebookId: profile.id,
      });

      if (existUser) {
        // already have the user
        console.log('user already exist in db:', existUser);
        done(null, existUser);
      } else {
        try {
          // check if user is already exit in db
          const existUser = await userRepository.findOneBy({
            googleId: profile.id,
          });

          if (existUser) {
            // already have the user
            console.log('user already exist in db:', existUser);
            done(null, existUser);
          } else {
            // if not , create a new user in db

            // Here we have to check user email because there is people that register with facebook that never verify their email account and there is people that sign up with a phone number, in both those cases their emails will always be undefined.
            let email = profile.email || profile.emails[0].value;

            if (!email) {
              console.log('this user has no email in his facebook account');
              let err = { message: 'this user is missing an email' };
              return done(err);
            }
            const newUser = new UserModel({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: email,
              facebookId: profile.id,
              picture: profile.photos[0].value,
              provider: profile.provider,
            });
            const user = await userRepository.save(newUser);

            console.log('User successfully registered');

            done(null, user);
          }
        } catch (error) {
          console.log('An error occurred while registering the user:', error);
        }
      }
    }
  )
);
