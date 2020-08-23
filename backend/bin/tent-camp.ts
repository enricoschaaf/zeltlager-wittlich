#!/usr/bin/env node
import * as cdk from "@aws-cdk/core"
import "source-map-support/register"
import { TentCampAuthStack } from "../lib/tent-camp-auth-stack"
import { TentCampImageStack } from "../lib/tent-camp-image-stack"
import { TentCampMailingListsStack } from "../lib/tent-camp-mailing-lists-stack"
import { TentCampStack } from "../lib/tent-camp-stack"

const app = new cdk.App()
const authTable = new TentCampAuthStack(app, "TentCampAuthStack").authTable
new TentCampImageStack(app, "TentCampImageStack")
const table = new TentCampStack(app, "TentCampStack", { authTable }).table
new TentCampMailingListsStack(app, "TentCampMailingListsStack", {
  env: { region: "eu-west-1" },
  table,
})
