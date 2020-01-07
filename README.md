# LabelCV

[![Board Status](https://dev.azure.com/cmaneu-oss/a1ec0164-9d8b-4637-81c6-b5a67163dbf8/149dc749-1a4b-4369-aa7f-a863aa6e0d02/_apis/work/boardbadge/c419af05-c319-4b30-a0be-c1637903182e?columnOptions=1)](https://dev.azure.com/cmaneu-oss/LabelCV/_workitems/recentlyupdated)
[![Build Status](https://dev.azure.com/cmaneu-oss/LabelCV/_apis/build/status/LabelCV%20-%20NPM%20build?branchName=master)](https://dev.azure.com/cmaneu-oss/LabelCV/_build/latest?definitionId=1&branchName=master)
![Licence MIT](https://img.shields.io/github/license/cmaneu/LabelCV.svg?logo=sdq)

LabelCV is a service used to build a labeled image dataset via crowdsourcing. Researchers, companies and 
datascientists can use LabelCV to spinup a website where people can tag an existing image dataset or 
contribute to this dataset by uploading images.

## This project is under **heavy** development

What you'll find in this project is very early stage. I've decided to opensource it from the begining so people can follow it as 
it's built. Do not use it for any other usage than learning.

## The story behind LabelCV

LabelCV was created as a sample for [Café Dev](https://www.youtube.com/channel/UCSFIjQQBpP6_dNJGwJM5sDQ) YouTube channel to demonstrate how to build Cloud Native apps. It will be used for different Non-Profit organisation projects soon.

## How to setup your dev environment

1. Please Azure Visual Studio Code Remote Development Extensions for Containers to get up and running fast.
2. Create your own `.env` file on `\api\labelcv-api` page inspired by `.sample-env`
3. For the storage account, you need a **SAS KEY** not a **Storage account Key**. This is a limitation of tha Azure
storage library for NestJS.

You'll find a test postman library in `\api\test`.

> Please note that this code is not compatible with Azure Storage Emulator or Azurite.
