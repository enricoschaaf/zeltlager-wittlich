#!/usr/bin/env node
import * as cdk from "@aws-cdk/core"
import { config } from "dotenv"
import "source-map-support/register"
import { TentCampAuthStack } from "../lib/tent-camp-auth-stack"
import { TentCampImageStack } from "../lib/tent-camp-image-stack"
import { TentCampMailingListsStack } from "../lib/tent-camp-mailing-lists-stack"
import { TentCampStack } from "../lib/tent-camp-stack"

config()

const account = process.env.ACCOUNT

const app = new cdk.App()

// new TentCampAuthStack(app, "TentCampAuthStack", {
//   env: { region: "eu-central-1", account },
// })

// new TentCampImageStack(app, "TentCampImageStack", {
//   env: { region: "eu-central-1", account },
// })

const table = new TentCampStack(app, "TentCampStack", {
  env: { region: "eu-central-1", account },
}).table

// new TentCampMailingListsStack(app, "TentCampMailingListsStack", {
//   env: { region: "eu-west-1", account },
//   table,
// })
