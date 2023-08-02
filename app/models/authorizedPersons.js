const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { Sequence } = require('./sequence');

const { getImageURL } = require("../utils/s3Utils")
const addressSchema = new mongoose.Schema(
  {
    addressType: {
      type: String,
      trim: true,
    },
    residentialFlatNo: {
      type: String,
      trim: true,
    },
    residentialArea: {
      type: String,
      trim: true,
    },
    residentialCity: {
      type: String,
      trim: true,
    },
    residentialState: {
      type: String,
      trim: true,
    },
    residentialCountry: {
      type: String,
      trim: true,
    },
    residentialLandMark: {
      type: String,
      trim: true,
    },
    residentialPinCode: {
      type: String,
      trim: true,
    },
    isResidentialSameAsOffice: {
      type: Boolean,
      default: false,
    },
    officeFlatNo: {
      type: String,
      trim: true,
    },
    officeArea: {
      type: String,
      trim: true,
    },
    officeCity: {
      type: String,
      trim: true,
    },
    officeState: {
      type: String,
      trim: true,
    },
    officeCountry: {
      type: String,
      trim: true,
    },
    officeLandMark: {
      type: String,
      trim: true,
    },
    officePinCode: {
      type: String,
      trim: true,
    },
    isOfficeSameAsResident: {
      type: Boolean,
      default: false,
    },
  }
)

const documentSchema = new mongoose.Schema(
  {
    professionalDocument: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
    educationQualificationDocument: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
    isDifferentPanName: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
    residentialAddressProof: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
    officeAddressProof: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
    
    proofOfNameChange: {
      status: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      } 
    },
  }
)

const settingsSchema = new mongoose.Schema(
  {
    isDarkTheme: {
      type: Boolean,
      default: false,
    },
    isEnableBioMetricLogin: {
      type: Boolean,
      default: false,
    },
    isMyNotificationSettings: {
      type: Boolean,
      default: false,
    },
    isInsurenceNotification: {
      type: Boolean,
      default: false,
    },
    isMutualFundsNotification: {
      type: Boolean,
      default: false,
    },
    isEquityNotification: {
      type: Boolean,
      default: false,
    },
    isSIPNotification: {
      type: Boolean,
      default: false,
    },
    isIPONotification: {
      type: Boolean,
      default: false,
    },
    isLoanNotification: {
      type: Boolean,
      default: false,
    },
  }
)


const businessSchema = new mongoose.Schema(
  {
    internetType: {
      type: String,
      trim: true,
    },
    internetQuality: {
      type: String,
      trim: true,
    },
    internetUsage: {
      type: String,
      trim: true,
    },
    businessForecast: {
      type: Object,
      trim: true,
    },
    businessRefference: {
      type: Array,
      trim: true,
    },
    segmentSelection: {
      type: Array,
      trim: true,
    }

  }
)

const bankDetailsSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
    },
    accountNo: {
      type: String,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    bankBranch: {
      type: String,
      trim: true,
    },
    uploadChequeLeaflet: {
      type: String,
      trim: true,
    },


  }
)

const nomineeDetailsSchema = new mongoose.Schema(
  {
    nomineeName: {
      type: String,
      trim: true,
    },
    nomineePan: {
      type: String,
      trim: true,
    },
    nomineeMobile: {
      type: String,
      trim: true,
    },
    nomineeDOB: {
      type: String,
      trim: true,
    },
    nomineeRelationship: {
      type: String
    },
    isNomineeMinor: {
      type: Boolean,
      trim: true,
    },
    nomineeGuardian: {
      type: Object,
      trim: true
    }


  }
)

const paymentSchema = new mongoose.Schema(
  {
    paymentStatus: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: String,
      trim: true,
    },
    couponCode: {
      type: String,
      trim: true,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    orderId: {
      type: String,
      trim: true,
    },
    paymentMode: {
      type: String
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentInfo : {
      type: Object,
    }
  }
)

const authorizedPersonsSchema = new mongoose.Schema(
  {
    authorizedPersonId: {
      type: String
    },
    profileURL: {
      type: String,
      required: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    tradeMember: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    occupationType: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    capitalMarketingExperience: {
      type: Object,
      default: true
    },
    isBrokerExperirnce: {
      type: Boolean,
      default: false,
    },
    brokerDetails: {
      type: Object,
      trim: false
    },
    inPersonVerification: {
      type: String,
      trim: false
    },
    address: addressSchema,
    document: documentSchema,
    business: businessSchema,
    bankDetails: bankDetailsSchema,
    nomineeDetails: nomineeDetailsSchema,
    settings: settingsSchema,
    paymentDetails:paymentSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdminUpdated: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    otp: String,
    token: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

authorizedPersonsSchema.methods.toJSON = function () {
  const authorizedPersons = this;
  const authorizedPersonsObject = authorizedPersons.toObject();
  delete authorizedPersonsObject.otp;
  //delete authorizedPersonsObject.token;
  return authorizedPersonsObject;
};
authorizedPersonsSchema.methods.generateAuthToken = async function () {
  
  return token;
};
authorizedPersonsSchema.pre('save', async function(next) { 
  var doc = this; 
 let counter = await Sequence.findOneAndUpdate({type: 'authorizedPersons'}, {$inc: { count: 1} })
 doc.authorizedPersonId = (counter.count + 1).toString().padStart(6, '0').toString();;
 next(); 
 
});

authorizedPersonsSchema.virtual('inPersonVerificationS3').get(function () {
 
  return  this.inPersonVerification ? getImageURL(this.inPersonVerification) : null;
})
authorizedPersonsSchema.virtual('professionalDocument.documentPathS3').get(function () {
  return this.professionalDocument?.documentPath ? getImageURL(this.professionalDocument.documentPath) : null;
})
authorizedPersonsSchema.virtual('educationQualificationDocument.documentPathS3').get(function () {
  return this.educationQualificationDocument?.documentPath ? getImageURL(this.educationQualificationDocument.documentPath) : null;
})
authorizedPersonsSchema.virtual('educationQualificationDocument.documentPathS3').get(function () {
  return this.educationQualificationDocument?.documentPath ? getImageURL(this.educationQualificationDocument.documentPath) : null;
})
authorizedPersonsSchema.virtual('residentialAddressProof.documentPathS3').get(function () {
  return this.residentialAddressProof?.documentPath ? getImageURL(this.residentialAddressProof.documentPath) : null;
})
authorizedPersonsSchema.virtual('officeAddressProof.documentPathS3').get(function () {
  return this.officeAddressProof?.documentPath ? getImageURL(this.officeAddressProof.documentPath) : null;
})
authorizedPersonsSchema.virtual('proofOfNameChangef.documentPathS3').get(function () {
  return this.proofOfNameChange?.documentPath ? getImageURL(this.proofOfNameChange.documentPath) : null;
})
authorizedPersonsSchema.virtual('uploadChequeLeaflet.documentPathS3').get(function () {
  return this.uploadChequeLeaflet?.documentPath ? getImageURL(this.uploadChequeLeaflet.documentPath) : null;
})



const authorizedPersons = mongoose.model(
  "authorizedPersons",
  authorizedPersonsSchema
);
// export default authorizedPersons;
module.exports = { authorizedPersons };
