/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * timeTableModel : TimeTableSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * 
 */
const TimeTableSchema = new TSchema(
    {
        termID: {
            type: TSchema.Types.ObjectId,
            ref: 'termModel',
            required: true,
            unique: true
        },
        classID: {
            type: TSchema.Types.ObjectId,
            required: true,
        },
        Data: [{
            subject: {
                type: TSchema.Types.ObjectId,// subject
                required: false,
                ref: 'subjectModel'
            },
            teacher: {
                type: TSchema.Types.ObjectId,//teacher
                required: false,
                ref: 'teacherModel'
            },
            start: {
                type: Date, // find time object for mongoose - start time
                required: true,
            },
            stop: {
                type: Date, // - stop time 
                required: true
            }
        }]
        
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

TimeTableSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
TimeTableSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('timeTableModel', TimeTableSchema)