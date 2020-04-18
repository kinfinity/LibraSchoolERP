/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created Apr 2020
 *
 * Copyright © 2020
 * 
 * lectureNoteModel : LectureNoteSchema: mongooseSchema
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
const LectureNoteSchema = new TSchema(
    {
        title: {
            type: String,
            unique: true
        },
        notes: {
            type: TSchema.Types.ObjectId
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

LectureNoteSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
LectureNoteSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})
  
export default mongoose.model('lectureNoteModel', LectureNoteSchema)