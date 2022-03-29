#!/usr/bin/env node
const yargs = require('yargs/yargs');
const axios = require('axios');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const url = process.env.SLACK_URL;

const IS_ENV_AVAILABLE = Boolean(process.env.CI_ENVIRONMENT_NAME);

const linkToPipeline = {
  'type': 'section',
  'text': {
    'type': 'mrkdwn',
    'text': 'View job in Gitlab.'
  },
  'accessory': {
    'type': 'button',
    'text': {
      'type': 'plain_text',
      'text': 'View in Gitlab'
    },
    'value': 'View in Gitlab',
    'url': process.env.CI_JOB_URL,
    'action_id': 'button-action'
  }
};

const projectName = {
  'type': 'section',
  'text': {
    'type': 'mrkdwn',
    'text': `*${process.env.CI_PROJECT_TITLE}*`
  }
};

const deploymentTarget = IS_ENV_AVAILABLE ? process.env.CI_ENVIRONMENT_NAME : process.env.CI_COMMIT_BRANCH;

const deploymentStartTitle = {
  'type': 'section',
  'text': {
    'type': 'mrkdwn',
    'text': `Deployment started for *${deploymentTarget}*`
  }
};

const deploymentFinishTitle = {
  'type': 'section',
  'text': {
    'type': 'mrkdwn',
    'text': `Deployment for *${deploymentTarget}* has finished 🎉`
  }
};

const deploymentFailTitle = {
  'type': 'section',
  'text': {
    'type': 'mrkdwn',
    'text': `⛔️ Deployment for *${deploymentTarget}* has failed ⛔️`
  }
};

const fields = [{
  'type': 'mrkdwn',
  'text': `By: *${process.env.GITLAB_USER_NAME}*`
}];

if (process.env.CI_COMMIT_TAG) {
  fields.push( {
    'type': 'mrkdwn',
    'text': `Tag: *${process.env.CI_COMMIT_TAG}*`
  });
} else {
  fields.push( {
    'type': 'mrkdwn',
    'text': `Commit sha: *${process.env.CI_COMMIT_SHA}*`
  });
}

const informationTable = {
  'type': 'section',
  fields
};

const step = argv.step;

const sendToSlack = template => {
  axios.post(url, template);
};

if (step === 'start') {
  const template = {
    blocks: [
      projectName,
      deploymentStartTitle,
      informationTable
    ]
  };
  sendToSlack(template);
}

if (step === 'finish') {
  if (process.env.CI_JOB_STATUS == 'success') {
    const template = {
      blocks: [
        projectName,
        deploymentFinishTitle
      ]
    };

    sendToSlack(template);
  }

  if (process.env.CI_JOB_STATUS == 'failed') {
    const template = {
      blocks: [
        projectName,
        deploymentFailTitle,
        linkToPipeline
      ]
    };

    sendToSlack(template);
  }
}
