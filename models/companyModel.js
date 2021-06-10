const mongoose = require('mongoose')


let optionalWithLength = function(minLength, maxLength) {
    minLength = minLength || 0;
    maxLength = maxLength || Infinity;
    return {
      validator : function(value) {
        if (value === undefined) return true;
        return value.length >= minLength && value.length <= maxLength;
      },
      message : 'Optional field is shorter than the minimum allowed length (' + minLength + ') or larger than the maximum allowed length (' + maxLength + ')'
    }
  }


const companySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    uniqueLink: {
        type: String,
        required: true,
        unique: true,
        validate: optionalWithLength(8, 24)
    },
    logo: {
        type: String,
        default: "/images/company-placeholder.png"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("company", companySchema)