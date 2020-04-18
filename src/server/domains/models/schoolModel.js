/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * schoolModel : SchoolSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
require('mongoose-type-url')
require('mongoose-type-email')
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * name,
     * schoolID,
     * email,
     * password,
     * phoneNumber,
     * motto,
     * images,
     * logo,
     * address,
     * aniversary,
     * teachers,
     * classes,
     * bio
     * 
 */
const SchoolSchema = new TSchema(
    {
        name: {
            type: String,
            required: false,
            trim: false,
        },
        schooolID:{
            type: String,
            required: false,
            unique: true
        },
        email: {
            type: TSchema.Types.Email,
            required: false,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber:{
            type: Number,
            max: 13,
            min: 11
        },
        motto: {
            type: String,
            required: false,
            unique: true
        },
        images: [{
            type: TSchema.Types.Url,
            required:false,
          }],
        logo: {
           type: TSchema.Types.Url,
           required:false,
    
         },
        address: {  // ? strip
            type: String,
            required: false,
            unique: false
        }, 
        aniversary: {
            type: Date,
            required: false,
        },
        teachers: [{
            teacherName:{
                type: String,
                required: false,
                unique: false
            },
            teacherID:{
                type: TSchema.Types.ObjectId,
                ref: 'teacherModel',
            }
        }],
        classes: [{
            className:{
                type: String,
                required: false,
                unique: false
            },
            classID:{
                type: TSchema.Types.ObjectId,
                ref: 'classModel',
            }
        }],
        bio: {
            type: String
        },
        OTP: {
            type: Number,
            required: false
        },
        OTPExpiration: {
            type: Date,
            required: false
        },
        joinedOn: { type: Date, default: new Date() },
        verified: {
            type: Boolean,
            requried: false,
            default: false
        }
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

SchoolSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
SchoolSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('schoolModel', SchoolSchema)