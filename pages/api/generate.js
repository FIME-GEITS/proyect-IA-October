import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const next = req.body.next || '';
  const gender = req.body.gender || '';
  const author = req.body.author || '';
  
  if (next.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor ingrese una entrada valida",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(next,gender,author),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(next,gender,author) {
  const capitalizedNext = next[0].toUpperCase() + next.slice(1).toLowerCase();
  const capitalizedGender = gender[0].toUpperCase() + gender.slice(1).toLowerCase();
  const capitalizedAuthor = author[0].toUpperCase() + author.slice(1).toLowerCase();
  return `Sugiéreme libros de la biblioteca del genero ${capitalizedGender} que traten sobre ${capitalizedNext} y que esten escritos por ${capitalizedAuthor}`;
}
