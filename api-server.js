const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const authConfig = require('./auth_config.json');

const app = express();

if (
  !authConfig.domain ||
  !authConfig.authorizationParams.audience ||
  authConfig.authorizationParams.audience === 'https://depositos.com'
) {
  console.log(
    'Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values'
  );

  process.exit();
}

app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: authConfig.appUri,
  })
);

const checkJwt = auth({
  audience: authConfig.authorizationParams.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your access token was successfully validated FULL CI-CD Rocking all!',
  });
});

app.get('/api/public', (req, res) => {
  res.send({
    msg: 'It is a public endpoint!',
  });
});

const port = process.env.API_SERVER_PORT || 3000;

app.listen(port, () => console.log(`Api started on port ${port}`));
