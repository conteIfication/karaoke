import { interfaces } from 'inversify'
import * as passportModule from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

export function passport({ container }: interfaces.Context) {
  passportModule.serializeUser((password, done) => {
    done(null, password)
  })
  passportModule.deserializeUser((password, done) => {
    if (password === 'qwerty') {
        done(null, password)
    } else {
        return done(new Error)
    }
  });

  passportModule.use('local-login', new LocalStrategy({
    usernameField: 'password',
    passwordField: 'password',
    passReqToCallback: true,
  },
    (req: any, username, password, done) => {
        console.log('elo')
        if (password === 'qwerty') {
            return done(null, password)
        }
        else {
            return done(null, false, req.flash('loginMessage', 'The entered password is not correct'))
        }
    }))

    return passportModule
}