const aws =require('aws-sdk');
const dynamoClient= new aws.DynamoDB.DocumentClient({region: "eu-west-2"});

exports.handler= async (event,context,callback) =>{
     switch(event.path)
    {
        case "/read":
        await readDoc().then((data)=>{
             callback(null,{
                 statusCode:200,
                 body: JSON.stringify(data)
              });
        }).catch((error)=>{
           console.log(error); 
        });
        
        case "/write":
        await writeDoc(context.awsRequestId).then(()=>{
             callback(null,{
                 statusCode:200,
                 body: "Hello from dynamoDBUtil req_id:" + context.awsRequestId
              });
        }).catch((error)=>{
           console.log(error); 
        });
    }
};
function writeDoc(param){
    var document={
        TableName: "r-test",
        Item: {
        "_app_id": param,
        "_t_id": "12344",
        "name": "rana from lambda",
        "age": "97"
        }
    };
    return dynamoClient.put(document).promise();
}
function readDoc(){
    var document={
        TableName: "r-test",
        Limit: 50,
    };
    return dynamoClient.scan(document).promise();
}