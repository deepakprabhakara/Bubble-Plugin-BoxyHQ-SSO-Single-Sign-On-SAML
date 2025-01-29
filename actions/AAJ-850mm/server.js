function(properties, context) {  
  const boxyhqInstanceUrl = context.keys['BoxyHQ Instance URL'] || "https://sso.eu.boxyhq.com";
  const callbackUrl = context.keys["Callback URL"];
  const clientSecretVerifier = context.keys["Client Secret Verifier"] ? context.keys["Client Secret Verifier"] : "dummy";

  return context.v3.async(async function (cb) {
    const { default: fetch } = await import("node-fetch");
      
    // Fetch access token
    const tokenUrl = `${boxyhqInstanceUrl}/api/oauth/token`;
    const code = properties.code;

    const body = {
      grant_type: 'authorization_code',
      client_id: 'dummy',
      client_secret: clientSecretVerifier,
      redirect_uri: callbackUrl,
      code
    };

    const accessTokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
      

    if (!accessTokenResponse.ok) {
      cb(new Error('Failed to fetch access token'));
    }

    const accessToken = await accessTokenResponse.json();

    // Fetch user info
    const userInfoUrl = `${boxyhqInstanceUrl}/api/oauth/userinfo`;

    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      cb(new Error('Failed to fetch user info'));
    }

    const userInfo = await userInfoResponse.json();

    const profile = {
      id: userInfo.id,
      email: userInfo.email,
      firstname: userInfo.firstName,
      lastname: userInfo.lastName,
      requestedtenant: userInfo.requested.tenant,
      requestedproduct: userInfo.requested.product,
      raw: JSON.stringify(userInfo.raw)
    };

    cb(undefined, profile);
  });
}