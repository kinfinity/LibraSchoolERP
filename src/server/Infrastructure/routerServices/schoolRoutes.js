import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import shortid from 'shortid'
import publicEnums from '../../app/publicEnums'
import jsStringCompression from 'js-string-compression'
import schoolService from '../../domains/services/schoolService'

/**
     * 
     *  Build  school API call routes
     *        - LibraSchool/logout              | Destroy access for school Token
     *        - LibraSchool/resetpassword       | 
     *        - LibraSchool/school                | Get school Info
     *        - LibraSchool/school/update         | Update school Info
     *  
     */

  // school router for all school calls 
  const schoolRouter = express.Router([routeUtils.routerOptions])

  //  Protect all the school routes
  schoolRouter.use('/school',routeUtils.asyncMiddleware(routeUtils.authschool))
  
  //  ~! LogOut
  schoolRouter.route('/school/logout')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('school-LOGOUT')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
         // const payload = await schoolService.signout({Token: req.body.Token})
          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: signing out')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

      next()
  }))

  // Get school Info
  schoolRouter.route('/school')
  .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('school-PROFILE')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          // 
          const payload = await schoolService.getProfile(
            req.body.schoolID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:getting school info')
        winstonLogger.error(e.stack)

        res.json({
            state: publicEnums.VC_STATES.REQUEST_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))
  
  // Update school Info
  schoolRouter.route('/school/update')
  .post(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('school-CONTACTINFO')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          // 
          const payload = await schoolService.updateProfile(
            req.body.schoolID,
            {
              name: req.body.Data.Name || req.body.name,
              address: req.body.Data.Address || req.body.address,
              profileImage: req.body.Data.ProfileImage || req.body.profileImage
            }

          )
            
          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: updating contactInfo')
        winstonLogger.error(e.stack)

        res.json({
            state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))


  module.exports = schoolRouter