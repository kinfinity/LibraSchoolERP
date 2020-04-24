/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * schoolService: () : schoolModel
 *
 *  implements fucntions necessary for model manipulation
 *
 * Fucntions:
 *      create | insert
 *          -> createNewEmailschool(email, password)
 *              : checks if school exists first with email [.schoolExists(email)]
 *              : creates new school with email
 *                  and password [_schoolModel.create(email,password)]
 *              : authenticates the school and sends back a token(string),
 *                  message (string), and result(boolean)
 *      remove | delete
 *      findBy | search
 *          -> authenticateschool(email, password)
 *              : searches the database for the school and compares password
 *              : it then takes the email and password from the database
 *              : creates a jwt with the email and password and sends back
 *          ->schoolExists
 *              : checks if an email exists in the database
 *      get    | retrieve
 *             | update
 *
 *
 */

import hPassword from '../utils/password'
import schoolModel from '../models/schoolModel'
import tokenService from '../services/tokenService'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import publicEnums from '../../app/publicEnums'

const schoolService = {

    // school Data
    /**
     * name,
     * email,
     * password,
     * address, 
     * profileImage,
     * topics
     * birthDate
     */

  // handle for the schoolModel
  _schoolModel: schoolModel,

  // Create new school
  async createNewEmailschool(schoolName,Name,Email,Password,Address,ProfileImage,Topics,BirthDate) {
    winstonLogger.info('::schoolService')

    // Holds return data for this fucntion
    let response = null
    
    // Check if school exists first returns promise resolved to true or false
    await schoolService.schoolExists({
      Email,
      schoolName
    }).
    then((result) => {

      winstonLogger.info('searching DB for school')
      winstonLogger.info(JSON.stringify(result,null,4))
      // Email exists in database
        response = result

    }).
    catch((e) => {
      
      winstonLogger.info('existence error')
      winstonLogger.error(e)

      Promise.resolve({
        status: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })
    // Becomes true if school already exists and we kick out of function
    if (response.value) {

      if(response.typeE == "email"){
        // Return to higher scope if there's a school
        return Promise.resolve({
          state: publicEnums.VC_STATES.RESOURCE_EXISTS,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.SIGNUP_ERROR_EMAILEXISTS,
          token: null
        })
      }else if(response.typeU == "school"){
        return Promise.resolve({
          state: publicEnums.VC_STATES.RESOURCE_EXISTS,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.SIGNUP_ERROR_schoolEXISTS,
          token: null
        })
      }

    }
    
    // Create static Data for school
      const schoolData = {
        "schoolName": schoolName,
        "name": Name,
        "email": Email,
        "password": Password,
        "address": Address,
        "profileImage": ProfileImage
      }
    
      // temp password holder  
      winstonLogger.info("password " + schoolData.password)
    const ipassword = schoolData.password

    // Hash school password on first save
    await hPassword.hash(ipassword).
    then((hashedPassword) => {

      // Append Hashed password to static school Data
      schoolData.password = hashedPassword
      // Create new school model
      const school = new schoolModel(schoolData)
    
      // Save new school
      school.
      save().
      then((result) => {

        // Succeeded in saving new school to DB
        winstonLogger.info(' -> school CREATED')
        winstonLogger.info(result)
        result.password =  ipassword
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> school NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
          token: null
        })

      })

    }).catch((err) => {

      winstonLogger.error('school PASSWORD NOT HASHED')
      winstonLogger.error(err)  

      response = Promise.resolve({
        state: publicEnums.VC_STATES.HASHING_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
        token: null
      })

      return response

    })

    // Create and use timeout
    const timeout = (ms) => new Promise((res) => setTimeout(res, ms))
    await timeout(1000)

    return response

  },
  // Authenticate an already existing school
  async authenticateschool(schoolData) {

    winstonLogger.info('school DATA:')
    winstonLogger.info(JSON.stringify(schoolData,null,4))
    let response = null
    let response1 = null
    let response2 = null
    let tempData = null
    let id = null

    // Try email
    await schoolService._schoolModel.
      findOne({email: schoolData.detail}).
    then((Data) => {

      winstonLogger.info('Searching for email')
      // Get data from DB
      if(Data) {

        winstonLogger.info('Email found:')
        tempData = Data
        winstonLogger.info(JSON.stringify(Data.email,null,4))
        response1 = true
        id = schoolData.detail

      }else{response1 = false}

    }).
    catch((err) => {
      
      //
      response1 = false
      winstonLogger.error("Eror searching for email")
      winstonLogger.error(err.message)
      winstonLogger.error(err.stack)

      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    // Try Name
    await schoolService._schoolModel.
    findOne({schoolName: schoolData.detail}).
    then((Data) => {
      
      winstonLogger.info('Searching for schoolname')
      // Get data from DB
      if(Data) {

        winstonLogger.info('schoolName found:')
        tempData = Data
        winstonLogger.info(Data.schoolName)
        response2 = true
        id = schoolData.detail

      }

    }).
    catch((err) => {

      //
      winstonLogger.error('ERROR: searching for name')
      winstonLogger.error(err.message)
      winstonLogger.error(err.stack)

      response2 = false
      
      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    if (!(response1 || response2)){

      winstonLogger.info(response1 + " " + response2)
      // Break out
      winstonLogger.info(`ERROR AUTHENTICATING :::`)
      // Return false and and empty object
      return Promise.resolve({
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_schoolNAME,
        token: null
      })

    }
    // school exists -> check password correspondence with bcrypt
    let res = null
  
    await hPassword.compare(schoolData.password, tempData.password).
    then((matched) => {
    
      // Password matched
      winstonLogger.info(`password matched ? ${matched}`)
      res = matched

    }).
    catch((err) => Promise.reject(err))

    if (!res) {

      response = {
        state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.NOT_FOUND,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PASSWORD,
        token: null
      }

      return response

    }

    let Token = null, refreshToken = null
    // refresh Token
    await Promise.resolve(tokenService.generateRefreshToken({
      schoolName: tempData.schoolName,
      schoolID: tempData._id
    })).
    then((tk) => {

      winstonLogger.info('Generated refreshToken')
      winstonLogger.info(tk)
      refreshToken = tk

    }).
    catch((e) => {
      
      winstonLogger.error('error generating refreshtoken')
      winstonLogger.error(e)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })
    // Return a boolean(true) and signed accessToken JWT
    await Promise.resolve(tokenService.generateAccessToken({
          email: tempData.email,
          schoolName: tempData.schoolName,
          schoolID: tempData._id,
          name: tempData.name,
          address: tempData.address,
          profileImage: tempData.profileImage
    })).
    then((tk) => {

      winstonLogger.info('Generated Token')
      winstonLogger.info(tk)
      Token = tk

    }).
    catch((e) => {
      
      winstonLogger.error('error generating token')
      winstonLogger.error(e)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    })

    winstonLogger.info('TOKEN')
    winstonLogger.info(JSON.stringify(Token))

    // Resolve
    response = Promise.resolve({
      state: publicEnums.VC_STATES.REQUEST_OK,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.SUCCESSFUL_LOGIN,
      token: Token,
      refreshToken
    })

    return response

  },

  /*
   * Checks if the school is in the Database without returning anyData
   * returns a boolean based on availability
   */
  async schoolExists(schoolE) {

    let eeResult = null
    let eeResult1 = null
    let eeResult2 = null

    // Check email
    await schoolService.
    _schoolModel.
    findOne({email: schoolE.Email}).
    then((Data) => {

      winstonLogger.info(`checking data base for school with email `)
      if(Data){
  
        if (Data.length === 0) {

          winstonLogger.info('no school with email exists')
          eeResult1 = Promise.resolve(false)

        }

        winstonLogger.info(`FOUND: ${Data}`)
        eeResult1 = Promise.resolve(true)
      }

    }).
    catch((err) => {

      winstonLogger.info('error checking database')
      winstonLogger.info(err)
      eeResult1 = Promise.resolve(false)

    })
    // Check Name
    await schoolService.
    _schoolModel.
    findOne({schoolName: schoolE.schoolName}).
    then((Data) => {

      winstonLogger.info(`checking data base for school Name`)
      if(Data) {

        if (Data.length === 0) {

          winstonLogger.info('no school exists with Name ')
          eeResult2 = Promise.resolve(false)

        }

        winstonLogger.info(`FOUND: ${Data}`)
        eeResult2 = Promise.resolve(true)
      }
    }).
    catch((err) => {

      winstonLogger.info('error checking database')
      winstonLogger.info(err)
      eeResult2 = Promise.resolve(false)

    })

    let typeE = null
    let typeU = null

    if(eeResult1){
      typeE = "email"
    }else if(eeResult2){
        typeU = "school"
    }
    return eeResult = {
      value: eeResult1 || eeResult2,
      typeE,
      typeU
    }

  },

  /*
   * Init reset send mail ( verification code | reset token)
   * update passresetkey & keyexpiration in schema
   * return result message (boolean)
   */
  async initPasswordReset(schoolE) {

    // Email exists result
    let response0 = null

    // Ensure email exists in database
    await schoolService.schoolExists(schoolE).
    then((result) => {

      // Boolean result
      response0 = result

    }).
    catch((err) => winstonLogger.info(err))
    // If no return failure if yes continue
    if (!response0) {

      winstonLogger.info(`${school} does not belongs to a school in database`)

      return Promise.reject(response0)

    }
    // Initialize and get resetDetails
      const verificationPack = await hPassword.initReset(email)
      .then((verPack) => {

          Promise.resolve(verPack)

      })
      .catch((err) => {

          Promise.reject(err)

      })

    // Add email to verificationPack
      winstonLogger.info('this is the RESET data')
    winstonLogger.info(verificationPack)
      verificationPack.email = email

    // Add temporaryData(verificationPack) to school's data in DB
    await schoolService
      ._schoolModel.update(verificationPack)
      .then((response) => {

        winstonLogger.info('updated: ')
          winstonLogger.info(response)

      })
      .catch((err) => {

          winstonLogger.info('error updating the school data with reset data ')
          winstonLogger.info(err)
        // Return false and and empty object

          Promise.reject(err)

      })

    // Return value
    return Promise.resolve()

  },

  /*
   * get Profile Info
   */
  async getProfile(schoolID) {

    //
    let response = null
    // 
    await schoolService.
    _schoolModel.
    findOne({
      _id: schoolID
    })
    .then((schoolData) => {

      if(schoolData){
          winstonLogger.info('schoolData : ')
          winstonLogger.info(schoolData)
          response = {
            schoolName: schoolData.schoolName,
            name: schoolData.name,
            email: schoolData.email,
            address: schoolData.address,
            profileImage: schoolData.profileImage
          }
      }

    })
    .catch((err) => {

        winstonLogger.error('ERROR getting Profile')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: publicEnums.VC_STATES.REQUEST_OK,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

},

/*
   * update Profile Info
   */
  async updateProfile(schoolID,Data) {

    const options  = {
      useFindAndModify: false,
      new: true
    }

    winstonLogger.info('GET: school Info')
    winstonLogger.info(JSON.stringify(Data,null,4))
    //
    let response = null
    // 
    await schoolService.
    _schoolModel.
    findOneAndUpdate({
          _id: schoolID
        },
        Data,
        options
    )
    .then((schoolData) => {

      winstonLogger.info('schoolData : ')
      winstonLogger.info(schoolData)
      
      response = {
        schoolName: schoolData.schoolName,
        name: schoolData.name,
        email: schoolData.email,
        address: schoolData.address,
        profileImage: schoolData.profileImage
      }

    })
    .catch((err) => {

        winstonLogger.error('ERROR updating Profile')
        winstonLogger.error(err.message)

      return Promise.resolve({
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        Data: null
      })

    })

    return Promise.resolve({
      state: publicEnums.REQUEST_OK,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
      Data: response
    })

  },

  /*
   * Validates verification code and resets the password
   */
    async validatePasswordResetEmail(email, verificationCode, newPassword) {

      winstonLogger.info('ENTERED VALIDATEPASSWORDRESETEMAIL FUNCTION')
    // Find email and verificationCode combination
    await schoolService._schoolModel.findOne({
            email,
      verificationCode,
        })
      .then((schoolData) => {

        winstonLogger.info('schoolData : ')
        winstonLogger.info(schoolData)
        // Update passwordfied
          schoolData.password = newPassword
        // Delete the temporaryData
        schoolData.verificationCode = null
        schoolData.verificationCodeExpiration = null
        winstonLogger.info('new schoolData : ')
        schoolData.save()
          .catch((err) => {

              winstonLogger.info('error updating password')
              winstonLogger.info(err)

          })
        winstonLogger.info(schoolData)


      })
      .catch((err) => {

          winstonLogger.info('ERROR updating PASSWORD')

        return Promise.reject(err)

      })

  },

  /*
   * Uses validated resetToken to reset the password
   */
    async validatePasswordResetToken(resetToken, newPassword) {

      winstonLogger.info('ENTERED VALIDATEPASSWORDRESETTOKEN FUNCTION')
    // Find email and verificationCode combination
      await schoolService._schoolModel.findOne(resetToken)
      .then((schoolData) => {

        winstonLogger.info('schoolData : ')
          winstonLogger.info(schoolData)
        // Update passwordfied
          schoolData.password = newPassword
        // Delete the temporaryData
          schoolData.verificationCode = null
          schoolData.verificationCodeExpiration = null

      })
      .catch((err) => {

          winstonLogger.info('ERROR updating PASSWORD')

          return Promise.reject(err)

      })

  },

  /*
   * Destroy the Token object from DB so authorisation would fail for all requests
   */
    async logoutschool(Token) {

    // Destroy the token from database
    winstonLogger.info('destroy token')
    //await Promise.resolve(tokenService.killToken(Token))

  },

}

export default schoolService