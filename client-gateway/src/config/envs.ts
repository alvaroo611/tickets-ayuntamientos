import 'dotenv/config'; // Carga las variables de entorno desde el archivo .env
import * as joi from 'joi'; // Importa Joi para la validación

// Interfaz que define el tipo de las variables de entorno
interface EnvVars {
  PORT: number;
  TICKET_MICROSERVICE_HOST:string;
  TICKET_MICROSERVICE_PORT:number;

}

// Definición del esquema de validación usando Joi
const envsSchema = joi.object({
  PORT: joi.number().required(),
  TICKET_MICROSERVICE_HOST:joi.string().required(),
  TICKET_MICROSERVICE_PORT:joi.number().required(),
  
 
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
  ticketMicroserviceHost:envVars.TICKET_MICROSERVICE_HOST,
  ticketMicroservicePort:envVars.TICKET_MICROSERVICE_PORT,
  
};
