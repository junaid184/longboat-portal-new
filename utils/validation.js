import * as yup from "yup";

export const loginValidation = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export const addEventSchema = yup.object().shape({
  eventName: yup
    .string()
    .required("Event Name is required"), // Matches `eventName` initial type
  venueName: yup
    .string()
    .required("Venue Name is required"), // Matches `venueName` initial type
  tmEventId: yup
    .string()
    .required("Event Mapping ID is required"), // Matches `tmEventId` initial type
  eventMappingId: yup.string(), // Optional field
  image: yup
    .string()
    .url("Invalid image URL")
    .required("Image is required"), // Matches `image` initial type
  inHandDate: yup
    .date()
    .nullable()
    .required("In Hand Date is required"), // Matches `inHandDate` type with `null` allowed
  eventDate: yup
    .date()
    .nullable()
    .required("Event Date is required"), // Matches `eventDate` type with `null` allowed
  listCostPercentage: yup
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must not exceed 100")
    .required("List Cost Percentage is required"), // Matches `listCostPercentage`
  eventUrl: yup.string().url("Must be a valid URL"), // Matches `eventUrl`, optional
  hasGALAWNPIT: yup
    .boolean()
    .required("This field is required"), // Matches `hasGALAWNPIT`
  allowPreSales: yup
    .boolean()
    .required("This field is required"), // Matches `allowPreSales`
  shownQuantity: yup
    .string()
    .required("Shown Quantity is required"), // Matches `shownQuantity`
  rank: yup
    .number()
    .integer("Rank must be an integer")
    .min(1, "Rank must be at least 1")
    .default(1), // Matches `rank` 
});


export const userValidationSchema = yup.object().shape({
  userName: yup.string().required("userName is required"),
  userEmail: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .when("$isEditMode", {
      is: false,
      then: yup.string().required("Password is required"),
    }),
    role: yup.number().required("Role is required"),
});


export const AddAccountSchema = yup.object().shape(
  {
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    surname: yup.string().required(),
    phoneNo: yup.string().required(),
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.number().required(),
    takeUsCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    takeUsLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits"),
    amexCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    amexLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits"),
    citiCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    citiLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits")
  }
)

export const UpdateAccountSchema = yup.object().shape(
  {
    accountId: yup.string().required(),
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    surname: yup.string().required(),
    phoneNo: yup.string().required(),
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    proxy: yup.string().required(),
    takeUsCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    takeUsLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits"),
    amexCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    amexLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits"),
    citiCVC: yup.string()
      .matches(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
    citiLast4: yup.string()
      .matches(/^\d{4}$/, "Must be exactly 4 digits")
  }
)