/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * classModel : ClassSchema: mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import uniqueValidator from 'mongoose-unique-validator'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const TSchema = mongoose.Schema
/**
     * name, // soldiers_SJC
     * alias, // Form one ... 
     * subjects,
     * classTeachers,
     * students
     * 
 */
const ClassSchema = new TSchema(
    {
        name: {
            type: String,
            required: false,
            trim: false,
            unique: true
        },
        alias: {
            type: String,
            required: true
        },
        subjects: [{
            type: TSchema.Types.ObjectId,
            ref: 'subjectModel'    
        }],
        classTeachers: [{
            type: TSchema.Types.ObjectId,
            ref: 'teacherModel'
        }],
        students: [{
            type: TSchema.Types.ObjectId,
            ref: 'studentModel'
        }]
        
    },
    {
        timestamps: true,
        strict: true,
        runSettersOnQuery: true
    }
)

ClassSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
ClassSchema.pre('save', function(next) {

    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('classModel', ClassSchema)