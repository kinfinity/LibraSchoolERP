/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * parentModel : ParentSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
require('mongoose-type-url')
require('mongoose-type-email')
import uniqueValidator from 'mongoose-unique-validator'

const TSchema = mongoose.Schema
/**
     * fullName,
     * email,
     * password,
     * gender,
     * phoneNumber,
     * profileImage,
     * address,
     * profileImage,
     * children[]
     * 
 */
const ParentSchema = new TSchema(
    {
        fullName: {
            type: String,
            required: false,
            trim: false,
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
        gender: {
            type: String,
            required: false,
        },
        phoneNumber:{
            type: Number,
            max: 13,
            min: 11
        },
        profileImage: {//mongoose.SchemaTypes.Url
            type: TSchema.Types.Url,
            required:false,
      
        },
        address: {  // ? strip
            type: String,
            required: false,
            unique: false
        },  
        children: [{
            'child': {
                type: TSchema.Types.ObjectId,
                ref: 'studentModel'
            }
        }],
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

ParentSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
ParentSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('parentModel', ParentSchema)