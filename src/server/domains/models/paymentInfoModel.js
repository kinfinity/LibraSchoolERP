/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * paymentInfoModel : PaymentInfoSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * Depends on E-Money scenario in cameroon
     * 
 */
const PaymentInfoSchema = new TSchema(
    {
        bankName: {
            type: String,
            required: true
        },
        accountNumber: {
            type: Number,
            min: 8,
            max: 10
        },
        accountName: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date.now(),
            required: false,
        },
        updatedAt: {
            type: Date,
            required: false,
        }
        
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

PaymentInfoSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
PaymentInfoSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('paymentInfoModel', PaymentInfoSchema)