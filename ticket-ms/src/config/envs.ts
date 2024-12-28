import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env
import * as joi from 'joi'; // Importa Joi para la validación

// Interfaz que define el tipo de las variables de entorno
interface EnvVars {
  PORT: number;
  HOST: string;
}

// Definición del esquema de validación usando Joi
const envsSchema = joi.object({
  PORT: joi.number().required(),
  HOST: joi.string().required(),
  
}).unknown(true); // Permitir variables de entorno adicionales no especificadas en el esquema

// Validación de las variables de entorno
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`); // Lanza un error si la validación falla
}

// Asigna las variables validadas a un objeto con la interfaz correspondiente
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  host: envVars.HOST,
 
};
