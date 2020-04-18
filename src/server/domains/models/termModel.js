/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * termModel : TermSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * 
 */
const TermSchema = new TSchema(
    {
        name: {  // 1st term = 20xx20xx_1
            type: String,
            required: false,
            trim: true,
            unique: true
        },
        academicYear: {  // 20xx20xx
            type: String,
            required: false,
            trim: true,
            unique: true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date.now(),
            required: false,
        },
        updatedAt: {
            type: Date,
            required: false
        }
        
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

TermSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
TermSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('termModel', TermSchema)