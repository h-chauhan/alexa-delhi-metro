# Alexa Skill - Delhi Metro Guide

Built with :heart: and Node.Js

## Setup

```
npm install
```

and Add a ```.env``` file in root with contents

```
SKILL_ID=<alexa-skill-id>
```

## Testing

Install ```alexa-skill-test```

```
npm install -g alexa-skill-test
```

Run

```
alexa-skill-test
```

## Deployment

Install ```AWS-CLI```.

1. Run

```
aws configure
```

2. Zip the folder contents to ```index.zip```.

3. Run

```
aws lambda update-function-code --function-name alexa-delhi-metro --zip-file fileb://index.zip
```

