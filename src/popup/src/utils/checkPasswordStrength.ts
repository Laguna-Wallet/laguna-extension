import { Options } from "check-password-strength";

export const checkPasswordStrength: Options<string>= [
    {
      id: 0,
      value: "Poor",
      minDiversity: 0,
      minLength: 0,
    },
    {
      id: 1,
      value: "Fair",
      minDiversity: 2,
      minLength: 5,
    },
    {
      id: 2,
      value: "Good",
      minDiversity: 3,
      minLength: 8,
    },
    {
      id: 3,
      value: "Excellent",
      minDiversity: 4,
      minLength: 10,
    },
  ];