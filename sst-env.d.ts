/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "Email": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "RDS": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "sst.aws.Postgres"
      "username": string
    }
    "Vpc": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
    "Web": {
      "type": "sst.aws.TanstackStart"
      "url": string
    }
  }
}
