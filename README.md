About
=====

this is a simple comand line script using headless chromium to open and download bank statement csv file from several japanese bank website

Support
==========

Currently implemented banks:

- SMBC cash card website
- SMBC Vpass credit card website
- Tokyu credit card website

How to use
===========

install dependencies
```
npm i
```

create an `.env` file in this folder and put credentials in it:

```
SMBC_BRANCH_CODE=xxx
SMBC_ACCOUNT_CODE=xxxxxxx
SMBC_PASS=xxxx
VPASS_USER=xxxxx
VPASS_PASS=xxxxx
TOKYU_USER=xxxxx
TOKYU_PASS=xxxxx
```

the fields meaning are self-explanatial.

**this file should not be committed in git, keep it in your local or delete it every time after you use the script**

run the main script:

```
node --experimental-modules ./index.mjs
```

it will download csv files under `./downloads`