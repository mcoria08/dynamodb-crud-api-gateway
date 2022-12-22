//import { dynamoDB } from "@aws-sdk/client-dynamodb";
//import { nanoid } from "nanoid";
const dynamoDB = require("aws-sdk/clients/dynamodb");
const { nanoid } = require('nanoid');
const docClient = new dynamoDB.DocumentClient();

let response;

exports.FetchAllUsers = async (event, context) => {
        const data = await docClient.scan({
            TableName: 'usersDB'
        }).promise()
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                users: data.Items,                
            })
        }
    return response
};

exports.CreateUser = async (event, context) => {
    const { username, email, password } = JSON.parse(event.body);
    const data = await docClient.put({
        TableName: 'usersDB',
        Item: {
            id: nanoid(8),
            username, 
            email,
            password
        }
    }).promise()
    response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User created`,
        })
    }
return response
};

exports.DeleteUser = async (event, context) => {
    await docClient.delete({
        TableName: 'usersDB',
        Key: {
            id: event.pathParameters.id
        }
    }).promise()
    response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User deleted`,
        })
    }
return response
};

exports.UpdateUser = async (event, context) => {
    const Item = JSON.parse(event.body);
    await docClient.update({
        TableName: 'usersDB',
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: 'set username= :u, email= :e, password= :p',
        ExpressionAttributeValues: {
            ':u': Item.username,
            ':e': Item.email,
            ':p': Item.password
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise()
    response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User UPDATED`,
        })
    }
return response
};