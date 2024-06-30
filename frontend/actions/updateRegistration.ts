"use server"

import { verify } from "jsonwebtoken"
import { authTableName, privateKey, tableName } from "utils/env"
import { dynamo } from "utils/dynamo"
import { config } from "project.config"
import { z } from "zod"

const schema = z.object({
  streetAddress: z.string(),
  postalCode: z.string(),
  city: z.string(),
  phoneNumbers: z.array(z.string()),
  email: z.string().email(),
  eatingHabits: z.string(),
  foodIntolerances: z.string().optional(),
  canSwim: z.boolean(),
  supervision: z.boolean(),
  firstAid: z.boolean(),
  diseases: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.array(z.string()),
  familyDoctorName: z.string(),
  familyDoctorPhone: z.string(),
  healthInsurance: z.string(),
  groupWith: z.string().optional(),
  kjgMember: z.boolean().optional(),
})

export async function updateRegistration(
  accessToken: string,
  registrationId: string,
  registration: any,
) {
  try {
    const data = schema.parse(registration)

    const { userId }: any = verify(accessToken, privateKey, {
      algorithms: ["RS256"],
    })

    const { Item } = await dynamo.get({
      TableName: authTableName,
      ProjectionExpression: "email",
      Key: { PK: "USER#" + userId, SK: "PROFILE" },
    })

    if (!Item?.email) return { error: "NOT_FOUND" }
    console.log(registrationId, data)

    await dynamo.update({
      TableName: tableName,
      Key: {
        PK: `REGISTRATIONS#${config.year}`,
        SK: `REGISTRATION#${registrationId}`,
      },
      UpdateExpression:
        "SET streetAddress = :streetAddress, postalCode = :postalCode, city = :city, phoneNumbers = :phoneNumbers, email = :email, eatingHabits = :eatingHabits, foodIntolerances = :foodIntolerances, canSwim = :canSwim, supervision = :supervision, firstAid = :firstAid, diseases = :diseases, allergies = :allergies, medications = :medications, familyDoctorName = :familyDoctorName, familyDoctorPhone = :familyDoctorPhone, healthInsurance = :healthInsurance, groupWith = :groupWith, kjgMember = :kjgMember",
      ExpressionAttributeValues: {
        ":streetAddress": data.streetAddress,
        ":postalCode": data.postalCode,
        ":city": data.city,
        ":phoneNumbers": data.phoneNumbers,
        ":email": data.email,
        ":eatingHabits": data.eatingHabits,
        ":foodIntolerances": data.foodIntolerances,
        ":canSwim": data.canSwim,
        ":supervision": data.supervision,
        ":firstAid": data.firstAid,
        ":diseases": data.diseases,
        ":allergies": data.allergies,
        ":medications": data.medications,
        ":familyDoctorName": data.familyDoctorName,
        ":familyDoctorPhone": data.familyDoctorPhone,
        ":healthInsurance": data.healthInsurance,
        ":groupWith": data.groupWith,
        ":kjgMember": data.kjgMember,
      },
    })
  } catch (err) {
    console.error(err)
    return { error: "INTERNAL_ERROR" }
  }
}
