const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

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
      type: String,
      trim: true,

    },
    educationQualificationDocument: {
      type: String,
      trim: true,
    },
    isDifferentPanName: {
      type: Boolean,
      default: false,
    },
    residentialAddressProof: {
      type: String,
      trim: true,
    },
    officeAddressProof: {
      type: String,
      trim: true,
    },
    proofOfNameChange: {
      type: String,
      trim: true,
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
const authorizedPersonsSchema = new mongoose.Schema(
  {
    authorizedPersonId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => {
        const now = Date.now().toString();
        return now.slice(0, 3) + now.slice(10, 13);
      },
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
    address: addressSchema,
    document: documentSchema,
    business: businessSchema,
    bankDetails: bankDetailsSchema,
    nomineeDetails: nomineeDetailsSchema,
    paymentDetails: {
      type: Object
    },
    isActive: {
      type: Boolean,
      default: true,
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
  const authorizedPersons = this;
  const token = jwt.sign(
    {
      _id: authorizedPersons._id ? authorizedPersons._id.toString() : "",
      name: authorizedPersons.name ? authorizedPersons.name.toString() : "",
      email: authorizedPersons.email ? authorizedPersons.email.toString() : "",
      mobileNumber: authorizedPersons.mobileNumber
        ? authorizedPersons.mobileNumber.toString()
        : "",
      profileURL: authorizedPersons.profileURL
        ? authorizedPersons.profileURL.toString()
        : "",
    },
    process.env.JWT_authorizedPerson_SECRET,

    { expiresIn: process.env.TOKEN_EXPIRATION }
  );
  authorizedPersons.token = token;
  await authorizedPersons.save();
  return token;
};

const authorizedPersons = mongoose.model(
  "authorizedPersons",
  authorizedPersonsSchema
);
// export default authorizedPersons;
module.exports = { authorizedPersons };
