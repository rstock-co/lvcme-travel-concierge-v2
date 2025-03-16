import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Create an OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { location } = await req.json();

    if (!location) {
      return NextResponse.json(
        { error: 'No location provided' },
        { status: 400 }
      );
    }

    // Use the OpenAI API with function calling to get structured output
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a travel assistant that provides accurate airport information.'
        },
        {
          role: 'user',
          content: `The user entered "${location}" as their departure city or airport code. Correct any misspellings and provide complete airport information.`
        }
      ],
      functions: [
        {
          name: 'get_airport_information',
          description: 'Get complete and accurate airport information for a given city input',
          parameters: {
            type: 'object',
            properties: {
              correctedCity: {
                type: 'string',
                description: 'The correctly spelled city name'
              },
              region: {
                type: 'string',
                description: 'Province, state or region'
              },
              country: {
                type: 'string',
                description: 'Country name'
              },
              airportName: {
                type: 'string',
                description: 'Full airport name'
              },
              iataCode: {
                type: 'string',
                description: 'IATA 3-letter airport code'
              }
            },
            required: ['correctedCity', 'region', 'country', 'airportName', 'iataCode']
          }
        }
      ],
      function_call: { name: 'get_airport_information' }
    });

    // Extract the structured output
    const functionCall = response.choices[0].message.function_call;
    if (!functionCall || !functionCall.arguments) {
      throw new Error('Failed to get airport information');
    }

    const airportInfo = JSON.parse(functionCall.arguments);

    // Format a confirmation message using the structured data
    const confirmationMessage = `To confirm, you'd like to fly from ${airportInfo.correctedCity}, ${airportInfo.region}, ${airportInfo.country} from ${airportInfo.airportName} (${airportInfo.iataCode})?`;

    // Return the structured data and confirmation message
    return NextResponse.json({
      message: confirmationMessage,
      airportInfo: airportInfo
    });
  } catch (error) {
    console.error('Error identifying airport:', error);
    return NextResponse.json(
      { error: 'Failed to identify airport' },
      { status: 500 }
    );
  }
}
