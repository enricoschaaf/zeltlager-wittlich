#!/usr/bin/env node
import * as cdk from "@aws-cdk/core"
import "source-map-support/register"
import { TentCampStack } from "../lib/tent-camp-stack"

const app = new cdk.App()
new TentCampStack(app, "TentCampStack")