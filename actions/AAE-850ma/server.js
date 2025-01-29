function(properties, context) {
  const boxyhqInstanceUrl = context.keys["BoxyHQ Instance URL"] || "https://sso.eu.boxyhq.com";
  const callbackUrl = context.keys["Callback URL"];
  const product = context.keys["Product"];

  const {tenant, state } = properties;
  
  const clientId = encodeURIComponent(`tenant=${tenant}&product=${product}`);
  const redirectUri = encodeURIComponent(callbackUrl);
  const authorizationUrl = `${boxyhqInstanceUrl}/api/oauth/authorize?response_type=code&provider=saml&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  return {
  	authorizationUrl
  }
}