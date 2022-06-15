exports.handler = async (event, context, callback) => {
    // TODO implement
    const auth=event.headers.Authorization;
    if (!auth||!auth.includes(' ')) return callback('Unauthorized');
    
    var encodedCreds = auth.split(' ')[1];
    var plainCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
    var username = plainCreds[0];
    var password = plainCreds[1];
    
    if (!(username === 'admin' && password === 'admin')) return callback('Unauthorized');
    
    callback(null,buildPolicy(event, context, username));
};

function buildPolicy(event, context, username)
{
    var arn=event.methodArn.split(":");
    var region=arn[3];
    var account=arn[4];
    var apiId=arn[5].split("/")[0];
    
    var apiArn = 'arn:aws:execute-api:' + region + ':' + account + ':' +apiId + '/*/*';
    
    var policyDoc=  {
                    principalId: username,
                    policyDocument: { 
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Action: "execute-api:Invoke",
                                Resource: [apiArn],
                                Effect:"Allow"
                                
                            }
                        ]
                    }
        
    }
    return policyDoc;
}
