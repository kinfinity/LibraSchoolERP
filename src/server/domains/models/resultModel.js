/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * resultModel : ResultSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * 
 */
const ResultSchema = new TSchema(
    {
        'studentID': {
            type: String,
            required: false,
            unique: true,
        },
        'subjectGrade': [{
            subjectName:{
            type: TSchema.Types.ObjectId,
            ref: 'subjectModel',
            required: true    
            },
            subjectGrade: {
            type: String,
            unique:false,
            required: true
            },
            subjectTeacher: {        
            type: TSchema.Types.ObjectId,
            ref: 'teacherModel'
            }
        }],
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

ResultSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
ResultSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('resultModel', ResultSchema)