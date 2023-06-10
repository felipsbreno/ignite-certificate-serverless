import { APIGatewayProxyHandler } from 'aws-lambda'
import { dynamodb } from '../utils/dynamodbClient'
import { deepCopy, deepCopyInParseString } from '../utils/utils'

interface ICreateCertificate {
  id: string
  name: string
  grade: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, grade } = deepCopy(event.body) as ICreateCertificate

  await dynamodb
    .put({
      TableName: 'users_certificate',
      Item: {
        id,
        name,
        grade,
        created_at: new Date(),
      },
    })
    .promise()

  const response = await dynamodb
    .query({
      TableName: 'users_certificate',
      KeyConditionExpression: ' id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
    })
    .promise()

  return {
    statusCode: 201,
    body: deepCopyInParseString(response.Items[0]),
  }
}
