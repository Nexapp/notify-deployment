# Notify-Deployment

Small lib to send slack notification about Gitlab deployment.
It is less noisy then Gitlab since you can control on what environment you want it.

You must add in the repository CI/CD variables the slack URL for the bot.

```yml
 variables:
  SLACK_URL: $SLACK_URL
```

You can add a CI variable to easily reuse commands.

```yml
.notification:
  before_script:
    - npx @nexapp/notify-deployment --step start
  after_script:
    - npx @nexapp/notify-deployment --step finish
```

If there is already a before_script or after_script, you can merge them using references.

```yml
deploy/production:
  extends:
    - .deploy
  before_script:
    - !reference [.deploy, before_script]
    - !reference [.notification, before_script]
  after_script:
    - !reference [.notification, after_script]
```

Available argument:

```sh
npx @nexapp/notify-deployment --step (start|finish)
```

It customizes the message to notify when the deployment start and when it ends.
