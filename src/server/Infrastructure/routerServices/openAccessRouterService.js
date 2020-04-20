import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import publicEnums from '../../app/publicEnums'
import RedisCache from '../utils/redisAuthCache'

import userService from '../../domains/services/userService'


  // free access endpoints for authentication
  const openAccessRouterService = express.Router([routeUtils.routerOptions])
  // openAccessRouterService.use(routeUtils.csrfMiddleware)

  
  /**
    * CREATE SCHOOL
    */
  openAccessRouterService.route('/school/signup').post(routeUtils.asyncMiddleware(async (req,res,next) => {
  
    winstonLogger.info('user-SIGNUP')

    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    if(
       req.body.Name && 
       req.body.Email &&
       req.body.Password &&
       req.body.PhoneNumber &&
       req.body.Motto &&
       req.body.Address &&
       req.body.Aniversary 
       ){

      // perfomance timer  
      const profiler = winstonLogger.startTimer()

      try{
          
        // create user
        const payloadS =  await userService.createNewEmailUser(
          req.body.Name,
          req.body.Email,
          req.body.Password,
          req.body.PhoneNumber,
          req.body.Motto,
          req.body.Address,
          req.body.Aniversary
        )
        winstonLogger.info('CREATED:')
        winstonLogger.info(JSON.stringify(payloadS,null,4))
      
        if(payloadS.statusCode !== 402){
            
          // done with SIGNUP
          // authenticate user -> creates token
          const payloadA = await userService.authenticateUser({
              detail: payloadS.email,
              password: payloadS.password
          }).
          catch((err) => {
      
              winstonLogger.error('ERROR: authentication')
              winstonLogger.error(err.stack)

              res.json({
                request_url: '/signup',
                state: publicEnums.STATES.AUTHENTICATION_ERROR,
                statusCode: publicEnums.STATUS_CODES.REQUEST_FAILED,
                statusMessage: publicEnums.STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
                token: null
              })
      
          })
      
          winstonLogger.info("SIGNUP PAYLOAD")
          winstonLogger.info(JSON.stringify(payloadA,null,4))

          // Persist images if account was created  ---> OPTIMIZE !!! FIRE AS EVENT
          if(payloadA.token !== null ){

              winstonLogger.info('SAVE LOGO TO CLOUDINARY')
              // if it worked save the image to cloudinary
              const result = await cloudinaryCon.uploadUserProfileImage(req.body.ProfileImage, req.body.Name, req.body.Email).
              catch((e) => {

                  winstonLogger.error('Error uploading Logo')
                  winstonLogger.error(e.stack)

              })

              winstonLogger.info('COUDLINARY RESULTS')
              winstonLogger.info(result)
              winstonLogger.info('END')
              payloadA.state = publicEnums.STATES.REQUEST_OK
              payloadA.request_url = '/signup'

          }

          // Send the payload to client
          res.json(payloadA)

      }
      else{

          winstonLogger.info('INFO: user not created')
          res.json(payloadS)

      }
    } catch(e){

      winstonLogger.error('ERROR: signup failed')
      winstonLogger.error(e.stack)
      res.json({
        request_url: '/signup',
        state: publicEnums.STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    }
            
      profiler.done({ message: 'End of school_signup'})
      
      next()

  }else{

    res.json({
      request_url: '/school/signup/',
      state: publicEnums.STATES.REQUEST_ERROR,
      statusCode: publicEnums.STATUS_CODES.REQUEST_ERROR,
      statusMessage: publicEnums.STATUS_MESSAGES.INCORRECT_PARAMS,
      token: null
    })

  }

}))


/**
  * SCHOOL LOGIN
  */
openAccessRouterService.route('/school/login').post(routeUtils.asyncMiddleware(async (req,res,next) => {

    winstonLogger.info('user-LOGIN')

    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    if(
      req.body.Detail && // phoneNumber or email
      req.body.Password
      ){
      
        try {

            // *test cache
            // RedisCache.Whitelist.AddToken(req.body.detail, "testToken")
            //
            winstonLogger.info('CHECK: redisCache')
            winstonLogger.info(JSON.stringify(RedisCache.Whitelist.verify(req.body.detail),null,4))

            //if(!RedisCache.Whitelist.verify(req.body.detail)){
          
              const payload = await userService.authenticateUser({
                detail: req.body.Detail,
                password: req.body.Password
              })
              winstonLogger.info("PAYLOAD")
              winstonLogger.info(JSON.stringify(payload))
              // if(payload){
              //   RedisCache.Whitelist.AddToken(req.body.detail, "testToken")
              // }
              res.json(payload)

            // }else{
            //   winstonLogger.info(req.body.detail+ " Already Logged In")
            //   res.json({message: "INFO: User Already Logged In"})
            // }

          } catch (e) {

          winstonLogger.error('ERROR: authentication')
          winstonLogger.error(e.stack)

          res.json({
            request_url: '/school/login',
            state: publicEnums.STATES.AUTHENTICATION_ERROR,
            statusCode: publicEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            token: null
          })

        }

        next()
    
      }else{

        res.json({
          request_url: '/school/login',
          state: publicEnums.STATES.REQUEST_ERROR,
          statusCode: publicEnums.STATUS_CODES.REQUEST_ERROR,
          statusMessage: publicEnums.STATUS_MESSAGES.INCORRECT_PARAMS,
          token: null
        })
        
      }

}))

  
  /**
    * CREATE ...
    */

  module.exports = openAccessRouterService