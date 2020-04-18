/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * subjectModel : SubjectSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * title,
     * code, // title_SJC
     * 
     * 
 */
const SubjectSchema = new TSchema(
    {
        title: {
            type: String,
            required: false,
            trim: false,
            unique: true
        },
        code: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

SubjectSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
SubjectSchema.pre('save', function(next) {

    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('subjectModel', SubjectSchema)