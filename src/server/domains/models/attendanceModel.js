/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * attendanceModel : AttendanceSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * 
 */
const AttendanceSchema = new TSchema(
    {
        term: {
            type: Tschema.Types.ObjectId,
            required: true,
            unique: false
        },
        subject: {
            type: String,
            required: true,
            unique: false
        },
        dateTime: {
            type: String,
            required: true,
            default: Date.now(),
            unique: false
        },
        teacher: {
            type: TSchema.Types.ObjectId,
            ref: 'teacherModel',
            required: true
        },
        class: {
            type: TSchema.Types.ObjectId,
            ref: 'classModel',
            required: true
        },
        absentStudent: [{
              subject: {
                type: TSchema.Types.ObjectId,
                ref: 'studentModel'    
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

AttendanceSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
AttendanceSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('attendanceModel', AttendanceSchema)