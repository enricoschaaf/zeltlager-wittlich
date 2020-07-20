#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ZeltlagerWittlichStack } from '../lib/zeltlager-wittlich-stack';

const app = new cdk.App();
new ZeltlagerWittlichStack(app, 'ZeltlagerWittlichStack');
